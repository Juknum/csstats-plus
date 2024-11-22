import { CS2Map } from "./utils/constants";
import { getMapIcon } from "./utils/maps";
import { getRankPicture } from "./utils/ranks";

export class PlayerMatches {

	public load() {
		const container = document.getElementById('match-list-outer');
		if (!container) return;

		const vacBtn = document.getElementById('match-list-show-vac') as HTMLSpanElement | undefined;
		if (vacBtn) vacBtn.innerText = `Show ${vacBtn.innerText.split(' ').shift()!} VAC matches`;

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
			// expired/unknown rank OR wingman/faceit (img)
			case 0:

				// wingman rank
				const img = cell.querySelector('img');
				if (img) {
					
					const wingmanOrFaceitRank = parseInt(img.src.split('/').pop()?.split('.').shift()?.replace('level', '').replace('wingman', '') ?? '0', 10);
					cell.innerHTML = '';
	
					const wingmanImg = document.createElement('img');
					wingmanImg.height =img.src.includes('faceit') ? 24 : 18;
					wingmanImg.src = getRankPicture(wingmanOrFaceitRank, img.src.includes('faceit') ? 'FACEIT' : 'Wingman');
	
					cell.append(wingmanImg);
				}

				// expired/unknown rank
				else {
					cell.innerHTML = '';
					
					const expiredOrUnknownImg = document.createElement('img');
					expiredOrUnknownImg.height = 18;
					expiredOrUnknownImg.src = getRankPicture(0);

					cell.append(expiredOrUnknownImg);
				}

				break;

			// no chevron
			// => CASE 1 : can be either a premier rank game (from expired to current) or a bugged premier game (from current to expired)
			// => CASE 2 : can be a competitive game (with no rank change)
			case 1:
				const fallback = cell.innerHTML; // keep the original span for CASE 1
				cell.innerHTML = '';

				const rank = parseInt(backgroundImage.split('/').pop()?.split('.').shift() ?? '0', 10);

				const rankIcon = document.createElement('img');
				rankIcon.height = 18;
				rankIcon.src = getRankPicture(rank);
				rankIcon.onerror = () => cell.innerHTML = fallback; // rank img url fails to load => is a premier rank game (CASE 1)

				cell.append(rankIcon);
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

				const oldRankImg = document.createElement('img');
				oldRankImg.height = 18;
				oldRankImg.src = getRankPicture(oldRank);

				const arrowSpan = document.createElement('span');
				arrowSpan.classList.add('glyphicon', 'glyphicon-arrow-right');
				arrowSpan.style.fontSize = '12px';

				const newRankImg = document.createElement('img');
				newRankImg.height = 18;
				newRankImg.src = getRankPicture(newRank);

				div.append(oldRankImg);
				div.append(arrowSpan);
				div.append(newRankImg);

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
		mapNameSpan.innerText = mapName.replace('de_', '').replace('cs_', '').replace('dust2', 'dust II');
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
