import { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import CompetitiveOrWingmanRankIcon from "@/components/rank-icons/comp-win-rank";
import FaceitRankIcon from "@/components/rank-icons/faceit-rank";

import "@/components/common.css";
import { MapIcon } from "@/components/map-icon";

// @ts-expect-error
const extStorage: typeof browser.storage.local | null =
	// @ts-expect-error
	typeof browser !== "undefined"
		? browser.storage.local
		: // @ts-expect-error
			typeof chrome !== "undefined"
			? chrome.storage.local
			: null;

const WINGMAN_RANK_CACHE_KEY = "wingmanRankCache";

/** Minimum gap between consecutive wingman fetch requests (ms). */
const FETCH_INTERVAL_MS = 1500;

export default function AllMatchesPage() {
	const rootsRef = useState(() => new WeakMap())[0];
	// Persistent cache for matchUrl -> wingManRankNumber using extension local storage
	const matchRankCacheRef = useRef(new Map<string, number>());

	// Sequential fetch queue — drains one item at a time with a fixed inter-request gap
	// to avoid hammering the server and triggering CloudFlare rate limiting (HTTP 429).
	type QueueItem = { matchUrl: string; cell: HTMLTableCellElement };
	const fetchQueueRef = useRef<QueueItem[]>([]);
	const isDrainingRef = useRef(false);
	const lastFetchAtRef = useRef(0);

	// Load the persisted cache from extension local storage on mount
	useEffect(() => {
		if (!extStorage) return;
		extStorage
			.get([WINGMAN_RANK_CACHE_KEY])
			.then((result: Record<string, unknown>) => {
				const raw = result[WINGMAN_RANK_CACHE_KEY];
				if (raw && typeof raw === "object") {
					matchRankCacheRef.current = new Map(Object.entries(raw as Record<string, number>));
				}
			})
			.catch(() => {
				// Ignore read errors — start with an empty cache
			});
	}, []);

	const renderRankCell = useCallback(
		(cell: HTMLTableCellElement, isWingman: boolean, wingManRankNumber: number | undefined) => {
			const child = cell.firstElementChild;
			// Only guard against non-image children on fresh DOM cells.
			// If we already set up a React root for this cell (e.g. a placeholder),
			// skip the guard so the real rank can replace it.
			if (!rootsRef.has(cell) && child && !(child instanceof HTMLImageElement)) return;

			const isFaceit = (!isWingman && child?.src.includes("faceit")) ?? false;
			const rankNumber = isWingman ? wingManRankNumber : parseInt(child?.src.match(/ranks\/(\d+)\.png/)?.[1] || "0", 10);

			if (!rootsRef.has(cell)) {
				rootsRef.set(cell, createRoot(cell));
			}

			rootsRef.get(cell)?.render(
				<>
					{isFaceit && <FaceitRankIcon rankNumber={parseInt(child?.src.match(/faceit\/level(\d+)\.png/)?.[1] ?? "0", 10)} />}
					{!isFaceit && <CompetitiveOrWingmanRankIcon rankNumber={rankNumber ?? 0} gamemode={isWingman ? "Wingman" : "Competitive"} hasRankChanges={false} isRankUp={false} />}
				</>,
			);
		},
		[rootsRef],
	);

	/**
	 * Drain the fetch queue sequentially, enforcing at least FETCH_INTERVAL_MS between requests.
	 * Only one drainer runs at a time (guarded by isDrainingRef).
	 */
	const drainQueue = useCallback(async () => {
		if (isDrainingRef.current) return;
		isDrainingRef.current = true;

		while (fetchQueueRef.current.length > 0) {
			const item = fetchQueueRef.current.shift();
			if (!item) break;

			const { matchUrl, cell } = item;

			// Re-check cache in case a previous iteration already fetched it
			if (matchRankCacheRef.current.has(matchUrl)) {
				renderRankCell(cell, true, matchRankCacheRef.current.get(matchUrl));
				continue;
			}

			// Enforce minimum gap between requests
			const elapsed = Date.now() - lastFetchAtRef.current;
			if (elapsed < FETCH_INTERVAL_MS) {
				await new Promise((resolve) => setTimeout(resolve, FETCH_INTERVAL_MS - elapsed));
			}

			try {
				const url = new URL(matchUrl, location.href).toString();
				lastFetchAtRef.current = Date.now();
				const res = await fetch(url);
				if (!res.ok) continue;

				const html = await res.text();
				const doc = new DOMParser().parseFromString(html, "text/html");
				const matchInfoInner = doc.getElementById("match-info-inner");

				const avgRank = matchInfoInner?.querySelector("div")?.children[4]?.querySelector("img");
				const avgRankUrl = avgRank?.src as `https://static.csstats.gg/images/ranks/${number}.png`;

				const wingManRankNumber = parseInt(avgRankUrl.split("/").pop()?.split(".").shift() || "0", 10);

				matchRankCacheRef.current.set(matchUrl, wingManRankNumber);

				// Persist the updated cache to extension local storage
				if (extStorage) {
					try {
						const obj = Object.fromEntries(matchRankCacheRef.current.entries());
						await extStorage.set({ [WINGMAN_RANK_CACHE_KEY]: obj });
					} catch {
						// Ignore storage write errors
					}
				}

				renderRankCell(cell, true, wingManRankNumber);
			} catch {
				// Ignore fetch errors — the cell will stay as-is
			}
		}

		isDrainingRef.current = false;
	}, [renderRankCell]);

	const updateMapCell = useCallback(
		(cell: HTMLTableCellElement) => {
			const img = cell.querySelector("img")?.alt || cell.textContent.trim() || "";
			if (!img) return;

			cell.style.padding = "0";

			if (!rootsRef.has(cell)) {
				rootsRef.set(cell, createRoot(cell));
			}
			rootsRef.get(cell)?.render(<MapIcon height="25" src={img} alt={img} title={img} style={{ margin: "0 25px" }} />);
		},
		[rootsRef],
	);

	const updateAvgRankCell = useCallback(
		(cell: HTMLTableCellElement, isWingman: boolean, matchUrl: string) => {
			if (!isWingman) {
				// Competitive / Faceit — rank is already in the DOM, render immediately
				renderRankCell(cell, false, undefined);
				return;
			}

			if (!matchUrl) return;

			// Cache hit — render immediately without queuing a request
			if (matchRankCacheRef.current.has(matchUrl)) {
				renderRankCell(cell, true, matchRankCacheRef.current.get(matchUrl));
				return;
			}

			// Cache miss — show the "Unranked" placeholder immediately so the cell isn't
			// blank while waiting for the fetch, then enqueue for throttled fetching.
			renderRankCell(cell, true, 0);
			fetchQueueRef.current.push({ matchUrl, cell });
		},
		[renderRankCell],
	);

	useEffect(() => {
		const table = document.querySelector("table");
		if (!table) return;

		const tbody = table.querySelector("tbody");
		if (!tbody) return;

		const rows = Array.from(tbody.rows);

		rows.forEach((row) => {
			const cells = row.cells;

			// Update avg rank cell
			const avgRankCell = cells[1];
			const mapCell = cells[4];

			const team1PlayersCount = cells[5]?.childElementCount ?? 0;
			const team2PlayersCount = cells[8]?.childElementCount ?? 0;

			const link = cells[20]?.querySelector("a")?.href || "";
			if (avgRankCell) updateAvgRankCell(avgRankCell, team1PlayersCount + team2PlayersCount === 4, link);
			if (mapCell) updateMapCell(mapCell);
		});

		// All cache hits have been rendered synchronously above.
		// Now start draining the queue so uncached wingman fetches happen after.
		drainQueue();
	}, [updateAvgRankCell, updateMapCell, drainQueue]);

	return null;
}
