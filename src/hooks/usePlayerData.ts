import { useEffect, useMemo, useState } from "react";
import { type CS2Map, GAME_MODES } from "@/utils/constants";
import type { CSGame, CSGameMode, RankInfo, Stats } from "@/utils/types";
import { waitForScriptLoad } from "@/utils/waitForScriptLoad";
import { watchElement } from "@/utils/watchElement";

export function usePlayerData() {
	const [stats, setStats] = useState<Stats | false>(false); // false means no data
	const [hasTrackingEnabled, setHasTrackingEnabled] = useState<boolean>(true);
	const [isLoginRequired, setLoginRequired] = useState<boolean>(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!window.location.href.includes("/player/")) return;

		waitForScriptLoad((s) => (s.textContent ?? "").includes("var stats = ")).then((script) => {
			setLoading(false);
			setHasTrackingEnabled(document.getElementsByClassName("tracking-bar")[0] === undefined);
			const textContent = script.textContent ?? "";
			const statsPart = textContent.split("var stats = ")[1];
			if (statsPart) {
				const jsonStr = statsPart.split(";")[0];
				if (jsonStr) setStats(JSON.parse(jsonStr) as Stats);
			}
		});

		watchElement("player-login-required", (element, mutation) => {
			if (mutation.type !== "attributes" && mutation.attributeName !== "style") return;
			setLoginRequired(element.style.display !== "none");
		});
	}, []);

	const [steamBg, setSteamBg] = useState<string | undefined>(undefined);

	useEffect(() => {
		if (!window.location.href.includes("/player/")) return;

		const getSteamUrl = (): string | null => {
			const steamPathMatch = window.location.pathname.match(/\/player\/(\d{17})/);
			if (steamPathMatch && steamPathMatch[1]) {
				return `https://steamcommunity.com/profiles/${steamPathMatch[1]}`;
			}

			const steamAnchor = (document.querySelector('a[href*="steamcommunity.com"]') ||
				document.getElementById("other-profiles")?.querySelector('a[href*="steamcommunity.com"]')) as HTMLAnchorElement | null;

			return steamAnchor?.href ?? null;
		};

		let attempts = 0;
		const checkAndFetch = () => {
			const steamUrl = getSteamUrl();
			if (steamUrl) {
				const cacheKey = `csstats_steam_bg_${steamUrl}`;
				const cached = sessionStorage.getItem(cacheKey);
				if (cached) {
					setSteamBg(cached);
					return true;
				}

				// @ts-ignore
				const runtime = typeof browser !== "undefined" ? browser.runtime : typeof chrome !== "undefined" ? chrome.runtime : null;
				if (runtime?.sendMessage) {
					try {
						console.log("[CSStats+] [Content] Requesting Steam background for URL:", steamUrl);
						runtime.sendMessage({ type: "FETCH_STEAM_BG", steamUrl }, (response: any) => {
							if (runtime.lastError) {
								console.warn("[CSStats+] [Content] Runtime lastError:", runtime.lastError.message);
								return;
							}
							if (response?.bg) {
								console.log("[CSStats+] [Content] Received Steam profile background URL:", response.bg);
								sessionStorage.setItem(cacheKey, response.bg);
								setSteamBg(response.bg);
							} else {
								console.warn("[CSStats+] [Content] Steam profile background query returned no background URL.", response);
							}
						});
					} catch (err) {
						console.error("[CSStats+] [Content] Error sending message to background script:", err);
					}
				}
				return true;
			}
			return false;
		};

		if (!checkAndFetch()) {
			const interval = setInterval(() => {
				attempts++;
				if (checkAndFetch() || attempts > 20) {
					clearInterval(interval);
				}
			}, 300);

			return () => clearInterval(interval);
		}
	}, []);

	const user = useMemo(() => {
		if (!window.location.href.includes("/player/")) return undefined;

		const socials = document.getElementById("other-profiles") as HTMLDivElement | null;
		const icons = socials
			? (Array.from(socials.children)
					.filter((c) => c.classList.contains("icon"))
					.filter(Boolean) as HTMLDivElement[])
			: [];
		const bannedBanner = socials ? (Array.from(socials.children) as HTMLDivElement[]).find((c) => c.innerText.includes("VAC") || c.innerText.includes("Overwatch")) : undefined;

		const steamAnchor = icons.find((i) => i.children[0]?.getAttribute("href")?.includes("steamcommunity.com"))?.children[0] as HTMLAnchorElement | undefined;
		const faceitAnchor = icons.find((i) => i.children[0]?.getAttribute("href")?.includes("faceit.com"))?.children[0] as HTMLAnchorElement | undefined;
		const discordBooster = icons.find((i) => i.children[0]?.getAttribute("src")?.includes("discord-booster-1.png"))?.children[0] as HTMLImageElement | undefined;

		const getSteamBg = (): string | undefined => {
			const bgOuter = document.getElementById("page-bg-outer");
			if (bgOuter) {
				const img = bgOuter.querySelector("img");
				if (img?.src) return img.src;
				const styleBg = bgOuter.style.backgroundImage || window.getComputedStyle(bgOuter).backgroundImage;
				if (styleBg && styleBg !== "none" && styleBg.includes("url")) {
					const match = styleBg.match(/url\(["']?(.*?)["']?\)/);
					if (match && match[1]) return match[1];
				}
			}

			const bgInner = document.getElementById("page-bg");
			if (bgInner) {
				const img = bgInner.querySelector("img");
				if (img?.src) return img.src;
				const styleBg = bgInner.style.backgroundImage || window.getComputedStyle(bgInner).backgroundImage;
				if (styleBg && styleBg !== "none" && styleBg.includes("url")) {
					const match = styleBg.match(/url\(["']?(.*?)["']?\)/);
					if (match && match[1]) return match[1];
				}
			}

			return undefined;
		};

		return {
			img: document.getElementById("player-avatar")?.children[0]?.getAttribute("src"),
			name: document.getElementById("player-name")?.textContent?.trim(),
			bg: steamBg ?? getSteamBg(),
			tracked: hasTrackingEnabled,
			banned: bannedBanner ? bannedBanner.innerText.trim() : undefined,
			profiles: {
				steam: steamAnchor?.href,
				faceit: faceitAnchor?.href,
				discordBooster: discordBooster?.src,
			},
		};
	}, [hasTrackingEnabled, steamBg]);

	const ranks = useMemo(() => {
		if (!window.location.href.includes("/player/")) return [];

		const ranksSection = document.getElementById("player-ranks") as HTMLDivElement | null;
		if (!ranksSection) return [];

		const ranks: RankInfo[] = [];
		let game: CSGame = "CS2";

		for (const rankElement of Array.from(ranksSection.children)) {
			// header
			if (rankElement.className === "header") {
				const [icon] = Array.from(rankElement.children);
				if (icon && icon.children[0] instanceof HTMLImageElement) {
					game = icon.children[0].alt as CSGame;
				}
				continue;
			}

			// body
			// each rankElement has two rows
			const [over, bottom] = Array.from(rankElement.children);
			if (!over || !bottom) continue;

			const overChildren = Array.from(over.children);
			const icon = overChildren.filter((el) => el.className === "icon")[0] as HTMLDivElement | undefined;
			const rank = overChildren.filter((el) => el.className === "rank")[0] as HTMLDivElement | undefined;
			const best = overChildren.filter((el) => el.className === "best")[0] as HTMLDivElement | undefined;
			const [date, wins] = Array.from(bottom.children);

			if (!icon || !rank || !best || !date || !wins) continue;

			// retrieve map & game mode info
			const mapImgOrText = (icon.children[0] as HTMLImageElement | null) ?? icon.textContent?.trim();
			const mapOrGameMode = (game === "CS:GO" ? null : typeof mapImgOrText === "string" ? mapImgOrText : mapImgOrText ? mapImgOrText.alt : null) as CSGameMode | null;

			const map = mapOrGameMode?.includes("_") ? (mapOrGameMode as CS2Map) : null;
			const gamemode = {
				season: mapOrGameMode?.includes("Premier")
					? Number.isNaN(parseInt(mapOrGameMode.replace("Premier - Season ", ""), 10))
						? 1
						: parseInt(mapOrGameMode.replace("Premier - Season ", ""), 10)
					: null,
				type: mapOrGameMode?.includes("Premier") ? "Premier" : mapOrGameMode && GAME_MODES.includes(mapOrGameMode) ? mapOrGameMode : "Competitive",
			};

			// retrieve rank info
			const currRankEl = rank.children[0] as HTMLImageElement | HTMLDivElement | null;

			const currentRank = currRankEl
				? currRankEl instanceof HTMLDivElement
					? parseInt(currRankEl.children[0]?.textContent?.replace(",", "") || "0", 10)
					: parseInt(currRankEl.src.replaceAll("wingman", "").replaceAll("level", "").split("/").pop()?.split(".")[0] || "0", 10)
				: -1;

			// same as above but for best rank
			const bestRankEl = best.children[0] as HTMLImageElement | HTMLDivElement | null;
			const bestRank =
				bestRankEl instanceof HTMLDivElement
					? parseInt(bestRankEl.children[0]?.textContent?.replace(",", "") || "0", 10)
					: bestRankEl
						? parseInt(bestRankEl.src.replaceAll("wingman", "").replaceAll("level", "").split("/").pop()?.split(".")[0] || "0", 10)
						: 0;

			const rankToAdd: RankInfo = {
				game,
				map,
				gamemode,
				rank: {
					best: bestRank === currentRank ? 0 : bestRank,
					current: currentRank === 0 && bestRank !== 0 ? -1 : currentRank,
				},
				wins: parseInt(wins.textContent?.replaceAll("\n", "").replace("Wins:", "").trim() || "0", 10),
				date: date.textContent?.replaceAll("\n", "").trim() || "",
			};

			ranks.push(rankToAdd);
		}

		return ranks;
	}, []);

	return {
		loading,
		isLoginRequired,
		user: {
			...user,
			stats,
			ranks,
		},
	};
}
