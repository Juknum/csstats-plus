import { BASE_URL, CS2_MAPS, CS2Map } from "./utils/constants";
import { getMapIcon } from "./utils/maps";
import { getRankPicture } from "./utils/ranks";

export class PlayerMatches {

	public load() {
		const container = document.getElementById('match-list-outer');
		if (!container) return;

		const table = container.querySelector('table')!;
		const tbody = table.querySelector('tbody')!;

		for (const tr of Array.from(tbody.children as unknown as HTMLTableRowElement[])) {
			// tr.children[0] is the date
			// tr.children[1] is the vac status of the match
			// tr.children[2] is the map
			// tr.children[3] is the score
			// tr.children[4] is the rank
			
			this.updateMapCell(tr.children[2] as HTMLTableCellElement);
		}
	}


	private updateMapCell(cell: HTMLTableCellElement) {
		const mapIcon = cell.querySelector('img');
		const mapName = mapIcon ? mapIcon.alt as CS2Map : cell.textContent!.trim() as CS2Map;

		const icon = document.createElement('img');
		icon.src = getMapIcon(mapName);
		icon.width = 30;
		icon.height = 30;

		const mapNameSpan = document.createElement('span');
		mapNameSpan.innerText = mapName.replace('de_', '').replace('dust2', 'dust II');
		mapNameSpan.style.width = '50px';
		mapNameSpan.style.textAlign = 'left';
		mapNameSpan.style.display = 'inline-block';
		mapNameSpan.style.marginLeft = '15px';
		
		cell.innerHTML = '';
		cell.append(icon);
		cell.append(mapNameSpan);
		cell.style.textTransform = 'capitalize';
	}
}
