import { BASE_URL, PREMIER_RANKS_COLOR } from "./constants";
import type { CSGameMode } from "./types";

/**
 * Properly slice a Premier rank number into its tier, level and color.
 * @param num - The Premier rank number.
 * @returns A tuple containing the tier, level and color of the Premier rank.
 */
export function slicePremierRank(num: number): [keyof typeof PREMIER_RANKS_COLOR, string, (typeof PREMIER_RANKS_COLOR)[keyof typeof PREMIER_RANKS_COLOR]] {
	return Number.isNaN(num)
		? [0, "000", PREMIER_RANKS_COLOR[0]]
		: (() => {
				const [t, h] = num
					.toLocaleString("en-US")
					.split(",")
					.map((l, i) => (i === 0 ? parseInt(l, 10) : l)) as [keyof typeof PREMIER_RANKS_COLOR, string];
				return [t, h, PREMIER_RANKS_COLOR[t]];
			})();
}

/**
 * Get the URL of the rank picture based on its number and game mode.
 * @param rank - The rank number.
 * @param mode - The game mode (default is 'Competitive').
 * @returns The URL of the rank picture as a string.
 */
export function getRankPicture(rank: number, mode: CSGameMode = "Competitive") {
	switch (mode) {
		case "Competitive":
			if (rank === -1) return `${BASE_URL}matchmaking/expired.svg`;
			if (rank === 0) return `${BASE_URL}matchmaking/none.svg`;
			return `${BASE_URL}matchmaking/${rank}.svg`;

		case "Wingman":
			if (rank === -1) return `${BASE_URL}wingman/expired.svg`;
			if (rank === 0) return `${BASE_URL}wingman/none.svg`;
			return `${BASE_URL}wingman/${rank}.svg`;

		case "FACEIT":
			return `${BASE_URL}faceit/${rank}.svg`;

		case "Premier": {
			const [, , color] = slicePremierRank(rank);
			return `https://static.csstats.gg/images/ranks/cs2/rating.${color}.png`;
		}

		default:
			return "";
	}
}

/**
 * Get the human-readable name of a rank based on its number and game mode.
 * @param rank - The rank number.
 * @param mode - The game mode (default is 'Competitive').
 * @returns The name of the rank as a string.
 */
export function getRankName(rank: number, mode: CSGameMode = "Competitive"): string {
	switch (mode) {
		case "Competitive":
		case "Wingman":
			if (rank === -1) return "Expired";
			if (rank === 0) return "Unranked";
			if (rank === 1) return "Silver I";
			if (rank === 2) return "Silver II";
			if (rank === 3) return "Silver III";
			if (rank === 4) return "Silver IV";
			if (rank === 5) return "Silver Elite";
			if (rank === 6) return "Silver Elite Master";
			if (rank === 7) return "Gold Nova I";
			if (rank === 8) return "Gold Nova II";
			if (rank === 9) return "Gold Nova III";
			if (rank === 10) return "Gold Nova Master";
			if (rank === 11) return "Master Guardian I";
			if (rank === 12) return "Master Guardian II";
			if (rank === 13) return "Master Guardian Elite";
			if (rank === 14) return "Distinguished Master Guardian";
			if (rank === 15) return "Legendary Eagle";
			if (rank === 16) return "Legendary Eagle Master";
			if (rank === 17) return "Supreme Master First Class";
			if (rank === 18) return "Global Elite";
			return "Unknown Rank";

		case "FACEIT":
			return `Level ${rank}`;

		case "Premier":
			return `Premier`;

		default:
			return "";
	}
}
