import { CS2Map } from "./constants";

export function getMapIcon(name: CS2Map) {
	if (CS2_MAPS.includes(name as any) || SOME_COMMUNITY_MAPS.includes(name as any)) {
		return BASE_URL + 'maps-icons/' + (CS2_MAPS.includes(name as any) ? '' : 'community/') + name + '.svg';
	}

	return 'https://static.csstats.gg/images/maps/icons/' + name + '.png';
}

export function getMapName(name: string) {
	return name.replace('de_', '').replace('cs_', '').replace('dust2', 'dust II');
}