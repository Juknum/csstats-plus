import { CS2Map } from "./utils/constants";
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
			this.updateRankCell(tr.children[4] as HTMLTableCellElement);
		}
	}

	private updateRankCell(cell: HTMLTableCellElement) {
		const rankSpans = cell.querySelectorAll('span');

		if (rankSpans.length === 4) return; // Premier rank (no changes required)
		if (rankSpans.length === 3) return; // Already updated

		cell.attributeStyleMap.clear();

		const rankSpan = rankSpans[0];
		const backgroundImage = rankSpan ? window.getComputedStyle(rankSpan).getPropertyValue('background-image') : '';

		switch (rankSpans.length) {
			// expired/unknown rank OR wingman (img)
			case 0:

				// wingman rank
				const img = cell.querySelector('img');
				if (img) {
					
					const wingmanRank = parseInt(img.src.split('/').pop()?.split('.').shift()?.replace('wingman', '') ?? '0', 10);
					cell.innerHTML = '';
	
					const wingmanSpan = document.createElement('img');
					wingmanSpan.height = 18;
					wingmanSpan.src = getRankPicture(wingmanRank, 'Wingman');
	
					cell.append(wingmanSpan);
				}

				// expired/unknown rank
				else {
					cell.innerHTML = '';
					
					const expiredOrUnknownSpan = document.createElement('img');
					expiredOrUnknownSpan.height = 18;
					expiredOrUnknownSpan.src = getRankPicture(0);

					cell.append(expiredOrUnknownSpan);
				}

				break;

			// neither rank up nor rank down chevron
			case 1:
				const rank = parseInt(backgroundImage.split('/').pop()?.split('.').shift() ?? '0', 10);

				rankSpan.style.backgroundImage = `url(${getRankPicture(rank)})`;
				cell.style.paddingTop = '15px';
			break;

			// rank up or rank down (chevron span is present)
			case 2:
				const chevronSpan = rankSpans[1];
				const isRankUp = chevronSpan.classList.contains('glyphicon-chevron-up');

				// new rank is the one shown in the background image
				const newRank = parseInt(backgroundImage.split('/').pop()?.split('.').shift() ?? '0', 10);

				// old rank
				const oldRank = isRankUp ? newRank - 1 : newRank + 1;

				const div = document.createElement('div');
				div.style.display = 'flex';
				div.style.flexFlow = 'row';
				div.style.justifyContent = 'center';
				div.style.alignItems = 'flex-start';
				div.style.gap = '.75rem';

				const oldRankSpan = document.createElement('img');
				oldRankSpan.height = 18;
				oldRankSpan.src = getRankPicture(oldRank);

				const arrowSpan = document.createElement('span');
				arrowSpan.classList.add('glyphicon', 'glyphicon-arrow-right');
				arrowSpan.style.fontSize = '12px';

				const newRankSpan = document.createElement('img');
				newRankSpan.height = 18;
				newRankSpan.src = getRankPicture(newRank);

				div.append(oldRankSpan);
				div.append(arrowSpan);
				div.append(newRankSpan);

				cell.innerHTML = '';
				cell.append(div);
				cell.style.padding = '0';
				cell.style.height = '50px';
				break;
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
