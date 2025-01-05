import { CS2Map } from "../utils/constants.js";
import { getMapIcon, getMapName } from "../utils/maps.js";
import { getRankPicture } from "../utils/ranks.js";

export class Match {
	
	constructor() {
		this.fixScrollbar();
		this.fixRanks();
		// this.fixMapIcons();

		this.editHeader();
	}

	fixScrollbar() {
		const div = document.getElementById('content-tabs')!;
		const child = div.children[0];

		child.setAttribute('style', ''); // instead of "overflow: auto;"
	}

	fixRanks() {
		const isPremier = document.getElementById('match-info-inner')!.children[0].children[1].innerHTML.trim().toLowerCase().includes('premier');
		if (isPremier) return;

		const isWingman = document.getElementById('match-info-inner')!.children[0].children[1].innerHTML.trim().toLowerCase().includes('wingman');

		const table = Array.from(document.getElementById('match-scoreboard')!.children)[0] as HTMLTableElement;
		const [top,, bottom] = Array.from(table.tBodies);
		const bodies = [top, bottom];

		// match stats
		bodies.forEach((tbody) => {
			const trs = Array.from(tbody.rows);
			trs.shift(); // ignore first row (empty header)

			trs.forEach((tr) => {
				const rankTd = tr.cells[2];
				const img = rankTd.querySelector('img') as HTMLImageElement | undefined;

				// player has a rank
				if (img) {
					const rankNum = parseInt(img.src.split('/').pop()!.split('.').shift()!);
					img.src = getRankPicture(rankNum, isWingman ? 'Wingman' : 'Competitive');
				}

				else {
					const rankTdChild = rankTd.children[0] as HTMLDivElement;

					const div = document.createElement('div');
					div.style.padding  = '6px 0 4px';
					div.style.position = 'relative';

					const img = document.createElement('img');
					img.src = getRankPicture(0, isWingman ? 'Wingman' : 'Competitive');
					img.width = 40;
					img.style.verticalAlign = 'top';

					div.appendChild(img);
					rankTdChild.appendChild(div);
				}

			});
		});

		// header
		const averageRankImg = document.getElementById('match-info-inner')!.children[0].children[4].children[1] as HTMLImageElement;
		const averageRankNum = parseInt(averageRankImg.src.split('/').pop()!.split('.').shift()!);
		averageRankImg.src = getRankPicture(averageRankNum, isWingman ? 'Wingman' : 'Competitive');
	}

	// fixMapIcons() {
	// 	const mapImg  = document.getElementById('match-info-inner')!.children[0].children[2].children[0] as HTMLImageElement | undefined;
	// 	const mapName = document.getElementById('match-info-inner')!.children[0].children[2].textContent!.trim() as CS2Map;

	// 	if (mapImg) {
	// 		mapImg.src = getMapIcon(mapName);
	// 		mapImg.width = 24;
	// 		mapImg.height = 24;
	// 	}
	// 	else {
	// 		document.getElementById('match-info-inner')!.children[0].children[2].appendChild(img);

	// 	}
	// }

	editHeader() {
		const details = document.getElementById('match-details')!;
		const [left, right] = Array.from(details.children);

		const div = document.createElement('div');
		div.style.display = 'flex';
		div.style.alignItems = 'center';
		div.style.justifyContent = 'center';
		div.style.flexDirection = 'column';
		div.style.width = '200px';
		div.style.height = '145px';
		div.style.marginLeft = '100px';
		div.style.marginTop = '-5px';
		div.style.gap = '10px';

		let mapImg  = document.getElementById('match-info-inner')!.children[0].children[2].children[0] as HTMLImageElement | undefined;
		const mapName = document.getElementById('match-info-inner')!.children[0].children[2].textContent!.trim() as CS2Map;

		if (!mapImg) mapImg = document.createElement('img');
		
		mapImg.src = getMapIcon(mapName);
		mapImg.width = 70;
		mapImg.height = 70;

		div.appendChild(mapImg);
		
		const mapNameSpan = document.createElement('span');
		mapNameSpan.textContent = getMapName(mapName);
		mapNameSpan.style.textTransform = 'capitalize';

		div.appendChild(mapNameSpan);

		details.appendChild(left);
		details.appendChild(div);
		details.appendChild(right);

		document.getElementById('match-info-inner')!.children[0].children[2].remove();
	}

}