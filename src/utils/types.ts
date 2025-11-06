export interface Stats { 
	[key: string]: unknown;
	overall: {
		[key: string]: unknown;
		kpd: number;
		rating: number;
		dmg: number;
		rounds: number;
		delta: {
			'1v1': number;
			'1v2': number;
			'1v3': number;
			'1v4': number;
			'1v5': number;
			'1vX': number;
			adr: number;
			hs: number;
			kpd: number;
			rating: number;
			wr: number;
		}
	},
	totals: {
		overall: Stats['overall'] & {
			draws: number;
			games: number;
			losses: number;
			wins: number;
			/** kills */
			K: number;
			/** head shots */
			HS: number;
			/** deaths */
			D: number;
			/** assists */
			A: number;
		}
	}
}

export type CSGame = 'CS:GO' | 'CS2';
export type CSGameMode = typeof GAME_MODES[number];

export interface RankInfo {
	game: CSGame;
	map: string | null;
	gamemode: {
		season: number | null;
		type: CSGameMode;
	};
	rank: {
		best: number;
		current: number;
	};
	wins: number;
	date: string;
}

declare module 'react' {
	interface CSSProperties {
		[customProperty: `--${string}`]: string | number;
	}
}