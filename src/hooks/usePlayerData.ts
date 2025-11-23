import { CS2Map, GAME_MODES } from "@/utils/constants";
import { CSGame, CSGameMode, RankInfo, Stats } from "@/utils/types";
import { waitForScriptLoad } from "@/utils/waitForScriptLoad";
import { useEffect, useMemo, useState } from "react";

export function usePlayerData() {
	const [stats, setStats] = useState<Stats | false>(false);
	const [hasTrackingEnabled, setHasTrackingEnabled] = useState<boolean>(true);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!window.location.href.includes('/player/')) return;

		waitForScriptLoad((s) => (s.textContent ?? '').includes('var stats = '))
			.then((script) => {
				setLoading(false);
				setHasTrackingEnabled(document.getElementsByClassName('glyphicon glyphicon-warning-sign')[0] === undefined);
				setStats(JSON.parse((script.textContent ?? '').split('var stats = ')[1].split(';')[0]) as Stats)
			})
		
	}, []);

	const user = useMemo(() => {
		if (!window.location.href.includes('/player/')) return undefined;

		const socials = document.getElementById('other-profiles') as HTMLDivElement;
		const icons = Array.from(socials.children).filter((c) => c.classList.contains('icon')).filter(Boolean) as HTMLDivElement[];
		const bannedBanner = (Array.from(socials.children) as HTMLDivElement[]).find((c) => c.innerText.includes('VAC') || c.innerText.includes('Overwatch'));

		const steamAnchor = icons.find((i) => i.children[0]?.getAttribute('href')?.includes('steamcommunity.com'))?.children[0] as HTMLAnchorElement | undefined;
		const faceitAnchor = icons.find((i) => i.children[0]?.getAttribute('href')?.includes('faceit.com'))?.children[0] as HTMLAnchorElement | undefined;
		const discordBooster = icons.find((i) => i.children[0]?.getAttribute('src')?.includes('discord-booster-1.png'))?.children[0] as HTMLImageElement | undefined;
	
		return {
			img: document.getElementById('player-avatar')?.children[0]?.getAttribute('src'),
			name: document.getElementById('player-name')?.textContent?.trim(),
			tracked: hasTrackingEnabled,
			banned: bannedBanner ? bannedBanner.innerText.trim() : undefined,
			profiles: {
				steam: steamAnchor?.href,
				faceit: faceitAnchor?.href,
				discordBooster: discordBooster?.src,
			}
		}

	}, [hasTrackingEnabled]);

	const ranks = useMemo(() => {
		if (!window.location.href.includes('/player/')) return [];
		
		const ranksSection = document.getElementById('player-ranks') as HTMLDivElement;
		if (!ranksSection) return [];

		const ranks: RankInfo[] = [];
		let game: CSGame = 'CS2';

		for (const rankElement of Array.from(ranksSection.children)) {
			// header
			if (rankElement.className === 'header') {
				const [icon, _1, _2] = Array.from(rankElement.children);
				const img = icon.children[0] as HTMLImageElement;
				game = img.alt as CSGame;

				continue;
			}

			// body
			// each rankElement has two rows
			const [over, bottom] = Array.from(rankElement.children);
			const overChildren = Array.from(over.children);
			const icon = overChildren.filter((el) => el.className === "icon")[0] as HTMLDivElement;
			const rank = overChildren.filter((el) => el.className === "rank")[0] as HTMLDivElement;
			const best = overChildren.filter((el) => el.className === "best")[0] as HTMLDivElement;
			const [date, wins, _unused] = Array.from(bottom.children);

			// retrieve map & game mode info
			const mapImgOrText = (icon.children[0] as HTMLImageElement | null) ?? icon.textContent!.trim();

			const mapOrGameMode = (game === 'CS:GO' 
				? null
				: typeof mapImgOrText === 'string' 
					? mapImgOrText
					: mapImgOrText.alt) as (CSGameMode | null);

			const map = mapOrGameMode?.includes('_') ? mapOrGameMode as CS2Map : null;
			const gamemode = {
				season: mapOrGameMode?.includes('Premier') 
					? isNaN(parseInt(mapOrGameMode.replace('Premier - Season ', ''), 10)) ? 1 : parseInt(mapOrGameMode.replace('Premier - Season ', ''), 10)
					: null,
				type: mapOrGameMode?.includes('Premier') 
					? 'Premier'
					: mapOrGameMode && GAME_MODES.includes(mapOrGameMode) ? mapOrGameMode : 'Competitive',
			};

			// retrieve rank info
			const currRankEl = rank.children[0] as HTMLImageElement | HTMLDivElement | null;

			const currentRank = currRankEl 
				? currRankEl instanceof HTMLDivElement 
					? parseInt(currRankEl.children[0].textContent!.replace(',', ''))
					: parseInt(currRankEl.src.replaceAll('wingman', '').replaceAll('level', '').split('/').pop()!.split('.')[0], 10)
				: -1;

			// same as above but for best rank
			const bestRankEl = best.children[0] as HTMLImageElement | HTMLDivElement | null;
			const bestRank = bestRankEl instanceof HTMLDivElement
				? parseInt(bestRankEl.children[0].textContent!.replace(',', ''))
				: bestRankEl ? parseInt(bestRankEl.src.replaceAll('wingman', '').replaceAll('level', '').split('/').pop()!.split('.')[0], 10) : 0;

			const rankToAdd: RankInfo = {
				game,
				map, 
				gamemode,
				rank: {
					best: bestRank === currentRank ? 0 : bestRank,
					current: currentRank === 0 && bestRank !== 0 ? -1 : currentRank, // -1 means expired rank
				},
				wins: parseInt(wins.textContent!.replaceAll('\n', '').replace('Wins:', '').trim(), 10),
				date: date.textContent!.replaceAll('\n', '').trim(),
			}

			ranks.push(rankToAdd);
		}

		return ranks;
	}, []);

	return {
		loading,
		user: {
			...user,
			stats,
			ranks,
		}
	}
}