import { CS2Map } from "../utils/constants";
import { getMapIcon, getMapName } from "../utils/maps";

export class PlayerMaps {

	constructor() {
		const container = document.getElementById('player-maps');
		if (!container) return;

		const fakeTable = container.children[0] as HTMLDivElement;
		const rows = Array
			.from(fakeTable.children)
			// remove <style> and first <div> (header)
			.filter((el, index) => el.tagName === 'DIV' && index > 1) as HTMLDivElement[];

		const header = Array.from(fakeTable.children)[1];

		(Array.from(header.children) as HTMLDivElement[]).forEach((div) => {
			div.style.textAlign = 'center';
		});

		rows.map((r) => r.children[0] as HTMLDivElement).forEach((row) => {
			const mapCell = row.children[0] as HTMLDivElement;
			const mapCellInner = mapCell.children[0] as HTMLDivElement;
			const mapName = mapCellInner.querySelector('span')!.textContent as CS2Map;

			const icon = document.createElement('img');
			icon.src = getMapIcon(mapName);
			icon.width = 35;
			icon.height = 35;

			const mapNameSpan = document.createElement('span');
			mapNameSpan.innerText = getMapName(mapName);
			mapNameSpan.style.width = '50px';
			mapNameSpan.style.textAlign = 'left';
			mapNameSpan.style.display = 'inline-block';
			mapNameSpan.style.marginLeft = '10px';

			mapCell.innerHTML = '';
			mapCell.append(icon);
			mapCell.append(mapNameSpan);
			mapCell.style.textTransform = 'capitalize';
			mapCell.style.display = 'flex';
			mapCell.style.alignItems = 'center';
			mapCell.style.height = '69.97px';
		})
		
	}

}