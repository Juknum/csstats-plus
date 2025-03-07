import { BASE_URL, CS2_MAPS, CS2Map } from "./constants.js";

export function getMapIcon(name: CS2Map) {
	return BASE_URL + 'maps-icons/' + (CS2_MAPS.includes(name) ? '' : 'community/') + name + '.svg';
}

export function getMapName(name: CS2Map) {
	return name.replace('de_', '').replace('cs_', '').replace('dust2', 'dust II');
}