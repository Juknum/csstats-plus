import { BASE_URL, PREMIER_RANKS_COLOR } from "./constants";
import type { CSGameMode } from "./types";

export function slicePremierRank(num: number): [keyof typeof PREMIER_RANKS_COLOR, string, typeof PREMIER_RANKS_COLOR[keyof typeof PREMIER_RANKS_COLOR]] {
	return Number.isNaN(num) 
		? [0, '000', PREMIER_RANKS_COLOR[0]] 
		: (() => {
			const [t, h] = num.toLocaleString('en-US').split(',').map((l, i) => i === 0 ? parseInt(l, 10) : l) as [keyof typeof PREMIER_RANKS_COLOR, string];
			return [t, h, PREMIER_RANKS_COLOR[t]];
		})();
}

export function getRankPicture(rank: number, mode: CSGameMode = 'Competitive') {

	switch (mode) {
		case 'Competitive':
			if (rank === -1) return BASE_URL + 'matchmaking/expired.svg';
			if (rank === 0) return BASE_URL + 'matchmaking/none.svg';
			return BASE_URL + 'matchmaking/' + rank + '.svg';
	
		case 'Wingman':
			if (rank === -1) return BASE_URL + 'wingman/expired.svg';
			if (rank === 0) return BASE_URL + 'wingman/none.svg';
			return BASE_URL + 'wingman/' + rank + '.svg';

		case 'FACEIT':
			return BASE_URL + 'faceit/' + rank + '.svg';

		case 'Premier':
			const [,, color] = slicePremierRank(rank);
			return `https://static.csstats.gg/images/ranks/cs2/rating.${color}.png`;

		default:
			return '';
	}
}