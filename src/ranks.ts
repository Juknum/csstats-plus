import { BASE_URL, GAME_MODES, PREMIER_RANKS_COLOR } from "./constants";

export interface RankInfo {
	game: CSGame;
	map: string | null;
	mode: CSGameMode;
	rank: {
		best: number;
		current: number;
	};
	wins: number;
	date: string;
}

export type CSGame = 'CS:GO' | 'CS2';
export type CSGameMode = typeof GAME_MODES[number];

export function getRanksInfo(): RankInfo[] {
	const ranksSection = document.getElementById<HTMLDivElement>('player-ranks');
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
		const [icon, rank, best] = Array.from(over.children);
		const [date, wins, _unused] = Array.from(bottom.children);

		// retrieve map & game mode info
		const mapImgOrText = icon.children[0] as HTMLImageElement | undefined ?? icon.textContent!.trim();
		const mapOrGameMode = game === 'CS:GO' ? null : typeof mapImgOrText === 'string' ? mapImgOrText : mapImgOrText.alt

		// retrieve rank info
		const currRankEl = rank.children[0] as HTMLImageElement | HTMLDivElement;

		const currentRank = currRankEl instanceof HTMLDivElement 
			? parseInt(currRankEl.children[0].textContent!.replace(',', ''))
			: parseInt(currRankEl.src.replaceAll('wingman', '').replaceAll('level', '').split('/').pop()!.split('.')[0], 10);

		// same as above but for best rank
		const bestRankEl = best.children[0] as HTMLImageElement | HTMLDivElement | null;
		const bestRank = bestRankEl instanceof HTMLDivElement
			? parseInt(bestRankEl.children[0].textContent!.replace(',', ''))
			: bestRankEl ? parseInt(bestRankEl.src.replaceAll('wingman', '').replaceAll('level', '').split('/').pop()!.split('.')[0], 10) : 0;

		const rankToAdd: RankInfo = {
			game,
			map: !mapOrGameMode || GAME_MODES.includes(mapOrGameMode as CSGameMode) ? null : mapOrGameMode,
			mode: GAME_MODES.includes(mapOrGameMode as CSGameMode) ? mapOrGameMode as CSGameMode : 'Competitive',
			rank: {
				best: bestRank,
				current: currentRank === 0 && bestRank !== 0 ? -1 : currentRank, // -1 means expired rank
			},
			wins: parseInt(wins.textContent!.replaceAll('\n', '').replace('Wins:', '').trim(), 10),
			date: date.textContent!.replaceAll('\n', '').trim(),
		}

		ranks.push(rankToAdd);
	}

	return ranks;
}

export function slicePremierRank(num: number): [keyof typeof PREMIER_RANKS_COLOR, string] {
	return [
		parseInt(num.toString().slice(0, num < 10000 ? 1 : 2), 10) as keyof typeof PREMIER_RANKS_COLOR,
		num.toString().slice(-3)
	];
}

export function getRankPicture(rank: number, mode: CSGameMode = 'Competitive') {

	switch (mode) {
		case 'Competitive':
			if (rank === -1) return BASE_URL + 'matchmaking/expired.svg';
			return BASE_URL + 'matchmaking/' + rank + '.svg';
	
		case 'Wingman':
			if (rank === -1) return BASE_URL + 'wingman/expired.svg';
			return BASE_URL + 'wingman/' + rank + '.svg';

		case 'FACEIT':
			return BASE_URL + 'faceit/' + rank + '.svg';

		default:
			return '';
	}


}