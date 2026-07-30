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

		return {
			img: document.getElementById("player-avatar")?.children[0]?.getAttribute("src"),
			name: document.getElementById("player-name")?.textContent?.trim(),
			tracked: hasTrackingEnabled,
			banned: bannedBanner ? bannedBanner.innerText.trim() : undefined,
			profiles: {
				steam: steamAnchor?.href,
				faceit: faceitAnchor?.href,
				discordBooster: discordBooster?.src,
			},
		};
	}, [hasTrackingEnabled]);

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
