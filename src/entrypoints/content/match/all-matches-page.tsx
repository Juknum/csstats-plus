import { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import CompetitiveOrWingmanRankIcon from "@/components/rank-icons/comp-win-rank";
import FaceitRankIcon from "@/components/rank-icons/faceit-rank";
import type { CS2Map } from "@/utils/constants";
import { getMapIcon } from "@/utils/maps";

import "@/components/common.css";

export default function AllMatchesPage() {
	const rootsRef = useState(() => new WeakMap())[0];

	const updateMapCell = useCallback(
		(cell: HTMLTableCellElement) => {
			const img = cell.querySelector("img")?.alt || cell.textContent.trim() || "";
			if (!img) return;

			cell.style.padding = "0";

			if (!rootsRef.has(cell)) {
				rootsRef.set(cell, createRoot(cell));
			}
			rootsRef.get(cell)?.render(
				<img
					height="25"
					src={getMapIcon(img as CS2Map)}
					alt={img}
					title={img}
					style={{
						margin: "0 25px",
					}}
				/>,
			);
		},
		[rootsRef],
	);

	const updateAvgRankCell = useCallback(
		async (cell: HTMLTableCellElement, isWingman: boolean, matchUrl: string) => {
			// Fetch the wingman ranks has it is not displayed by default
			// This can causes a lot of requests which may lead to rate limiting by CloudFlare (ERR HTTP 429)
			let wingManRankNumber: number | undefined;

			// TODO: add caching to avoid multiple fetches for the same match

			if (matchUrl && isWingman) {
				// Add random delay (0-2 seconds) to mitigate rate limiting
				await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000));

				const url = new URL(matchUrl, location.href).toString();
				const res = await fetch(url);
				if (!res.ok) return;

				const html = await res.text();
				const doc = new DOMParser().parseFromString(html, "text/html");
				const matchInfoInner = doc.getElementById("match-info-inner");

				const avgRank = matchInfoInner?.querySelector("div")?.children[4]?.querySelector("img");
				const avgRankUrl = avgRank?.src as `https://static.csstats.gg/images/ranks/${number}.png`;

				wingManRankNumber = parseInt(avgRankUrl.split("/").pop()?.split(".").shift() || "0", 10);
			}

			const child = cell.firstElementChild;
			if (child && !(child instanceof HTMLImageElement)) return;

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

			const team1PlayersCount = cells[5].childElementCount;
			const team2PlayersCount = cells[8].childElementCount;

			const link = cells[20]?.querySelector("a")?.href || "";
			updateAvgRankCell(avgRankCell, team1PlayersCount + team2PlayersCount === 4, link);
			updateMapCell(mapCell);
		});
	}, [updateAvgRankCell, updateMapCell]);

	return null;
}
