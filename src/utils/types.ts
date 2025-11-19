import { CS2Map, GAME_MODES } from "./constants";

export interface Stats { 
	[key: string]: unknown;
	overall: {
		'1v1': number;
		'1v2': number;
		'1v3': number;
		'1v4': number;
		'1v5': number;
		'1vX': number;
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
		overall: Omit<Stats['overall'], '1vX'> & {
			'1v1_lost': number;
			'1v2_lost': number;
			'1v3_lost': number;
			'1v4_lost': number;
			'1v5_lost': number;
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
	},
	/** matches ID, from oldest to latest */
	matches: number[];
	/** last 10 matches, from oldest to latest */
	past10: {
		adr: number;
		hs: number;
		kd: number;
		kpd: number;
		map: CS2Map;
		/** unknown usage */
		map_crc: number;
		/** rank position for competitive, premier rating otherwise, no info for FACEIT */
		rank: number;
		/** +1/-1 for competitive, amount gained/loss on Premier, no info for FACEIT */
		rank_up: number;
		rating: number;
		result: 'lose' | 'win' | 'draw';
		score: `${number}:${number}`
	}[],
	maps: {
		overall: {
			[key in CS2Map]: {
				ct_rounds_against: number;
				ct_rounds_for: number;
				played: number;
				rounds_against: number;
				rounds_for: number;
				t_rounds_against: number;
				t_rounds_for: number;
				won: number;
			}
		}
	},
	weapons: {
		overall: {
			[key: string]: {
				dmg: number; 
				headshot: number; 
				hitgroups: {
					1: number;
					2: number; 
					3: number; 
					4: number; 
					5: number; 
					6: number; 
					7: number; 
					8: number; 
				};
				hits: number; 
				kills: number; 
				overkill: number; 
				shots: number; 
			}
		}
	}
}

export type CSGame = 'CS:GO' | 'CS2';
export type CSGameMode = typeof GAME_MODES[number];

export interface RankInfo {
	game: CSGame;
	map: CS2Map | null;
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