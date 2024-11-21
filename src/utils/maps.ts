import { BASE_URL, CS2_MAPS, CS2Map } from "./constants";

export function getMapIcon(name: CS2Map) {
	return BASE_URL + 'maps-icons/' + (CS2_MAPS.includes(name) ? '' : 'community/') + name + '.svg';
}
