
export function getWeaponIcon(name: string) {

	switch (name) {
		case 'knife':
			return 'https://static.csstats.gg/images/weapons/knife_m9_light.png';

		case 'mp5sd':
			return 'https://static.csstats.gg/images/weapons/mp5_light.png';
			
		case 'incgrenade':
			return 'https://static.csstats.gg/images/weapons/molotov_light.png';
			
		case 'molotov':
			return 'https://static.csstats.gg/images/weapons/molotov_light2.png';

		case 'flashbang':
			return 'https://static.csstats.gg/images/weapons/flash_light.png';

		default:
			return `https://static.csstats.gg/images/weapons/${name}_light.png`;
	}

}
