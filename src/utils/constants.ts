export const GAME_MODES = ['Competitive' , 'Wingman' , 'Premier' , 'Danger Zone', 'FACEIT'] as const;

// missing maps are considered as community maps
export const CS2_MAPS = [
	'ar_baggage',
	'ar_shoots',
	'cs_italy',
	'cs_office',
	'de_ancient',
	'de_anubis',
	'de_dust',
	'de_dust2',
	'de_inferno',
	'de_mirage',
	'de_nuke',
	'de_overpass',
	'de_train',
	'de_vertigo',
] as const;

export type CS2Map = typeof CS2_MAPS[number];

export const BASE_URL = 'https://raw.githubusercontent.com/Juknum/csgo-rank-icons/main/' as const;

export const PREMIER_RANKS_COLOR = {
	0: 'common',
	1: 'common',
	2: 'common',
	3: 'common',
	4: 'common',
	5: 'uncommon',
	6: 'uncommon',
	7: 'uncommon',
	8: 'uncommon',
	9: 'uncommon',
	10: 'rare',
	11: 'rare',
	12: 'rare',
	13: 'rare',
	14: 'rare',
	15: 'mythical',
	16: 'mythical',
	17: 'mythical',
	18: 'mythical',
	19: 'mythical',
	20: 'legendary',
	21: 'legendary',
	22: 'legendary',
	23: 'legendary',
	24: 'legendary',
	25: 'ancient',
	26: 'ancient',
	27: 'ancient',
	28: 'ancient',
	29: 'ancient',
	30: 'unusual',
	31: 'unusual',
	32: 'unusual',
	33: 'unusual',
	34: 'unusual',
} as const;