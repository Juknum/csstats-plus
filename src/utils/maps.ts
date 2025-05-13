import { CS2Map } from "./constants";

export function getMapIcon(name: string) {
	return BASE_URL + 'maps-icons/' + (CS2_MAPS.includes(name as CS2Map) ? '' : 'community/') + name + '.svg';
}

export function getMapName(name: string) {
	return name.replace('de_', '').replace('cs_', '').replace('dust2', 'dust II');
}