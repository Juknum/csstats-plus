import { BASE_URL, CS2_MAPS, type CS2CommunityMap, type CS2Map, type CS2OfficialMap, SOME_COMMUNITY_MAPS } from "./constants";

export function getMapIcon(name: CS2Map) {
	if (CS2_MAPS.includes(name as CS2OfficialMap)) return `${BASE_URL}maps-icons/${name}.svg`;
	if (SOME_COMMUNITY_MAPS.includes(name as CS2CommunityMap)) return `${BASE_URL}maps-icons/community/${name}.svg`;

	return `https://static.csstats.gg/images/maps/icons/${name}.png`;
}

export function getMapName(name: string) {
	return name.replace("de_", "").replace("cs_", "").replace("2", " II");
}
