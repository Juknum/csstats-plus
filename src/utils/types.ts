export interface Stats { 
	[key: string]: unknown;
	overall: {
		[key: string]: unknown;
		kpd: number;
		rating: number;
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