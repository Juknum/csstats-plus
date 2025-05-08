import { CS2Map } from "../utils/constants.js";
import { getMapIcon, getMapName } from "../utils/maps.js";
import { getRankPicture } from "../utils/ranks.js";

export class MatchesPage {
	constructor() {
		this.fixTable();
	}

	private fixTable(): void {
		const table = document.getElementsByClassName('table table-striped')[0] as HTMLTableElement;
		const tbody = table.tBodies[0];
		const rows = Array.from(tbody.rows);

		rows.forEach((row) => {
			const cells = Array.from(row.cells);

			const avgRankCell = cells[1];
			const mapCell = cells[4];
			const peopleInTeamOne = cells[5].childElementCount;
			const peopleInTeamTwo = cells[8].childElementCount;

			this.updateMapCell(mapCell);
			this.updateRankCell(avgRankCell, 
				   peopleInTeamOne === 2 && peopleInTeamTwo === 2 // full team both side
				|| peopleInTeamOne === 2 && peopleInTeamTwo <= 2  // full team one side
				|| peopleInTeamOne <= 2 && peopleInTeamTwo === 2  // full team other side
				|| peopleInTeamOne <= 2 && peopleInTeamTwo <= 2   // no full team (can't be 100% though)
			);
		})
	}

	private updateMapCell(cell: HTMLTableCellElement) {
		const mapIcon = cell.querySelector('img');
		const mapName = mapIcon ? mapIcon.alt as CS2Map : cell.textContent!.trim() as CS2Map;

		const icon = document.createElement('img');
		icon.src = getMapIcon(mapName);
		icon.width = 28;
		icon.height = 28;

		const mapNameSpan = document.createElement('span');
		mapNameSpan.innerText = getMapName(mapName);
		mapNameSpan.style.width = '50px';
		mapNameSpan.style.textAlign = 'left';
		mapNameSpan.style.display = 'inline-block';
		mapNameSpan.style.marginLeft = '15px';
		
		cell.innerHTML = '';
		cell.append(icon);
		cell.append(mapNameSpan);
		cell.style.textTransform = 'capitalize';
		cell.style.display = 'flex';
		cell.style.flexDirection = 'row';
		cell.style.flexWrap = 'nowrap';
		cell.style.alignItems = 'center';
		cell.style.width = '100%';
	}

	private updateRankCell(cell: HTMLTableCellElement, isWingman: boolean) {
		const img = document.createElement('img');

		if (isWingman) {
			img.src = getRankPicture(0, 'Wingman');
		}
		else {
			// competitive
			if (cell.children[0] instanceof HTMLImageElement) {
				const currImg = cell.children[0];
				const backgroundImage = currImg.src;
				const rank = parseInt(backgroundImage.split('/').pop()?.split('.').shift() ?? '0', 10);
				img.src = getRankPicture(rank, 'Competitive');
			}
			else if (cell.children[0] instanceof HTMLDivElement) {
				cell.children[0].style.height = '18px';
				const innerDiv = cell.children[0].children[0] as HTMLDivElement;

				innerDiv.style.height = '18px';
				innerDiv.style.padding = '0';
				innerDiv.style.paddingLeft = '.75rem';
				innerDiv.style.fontSize = '13px';

				const innerSpan = innerDiv.children[0] as HTMLSpanElement;
				const innerSmall = innerSpan.children[0] as HTMLDivElement;

				innerSmall.style.fontSize = '11px !important';
				return;
			}
			else {
				// can't determine if match is competitive or premier
				return;
			}
		}
		
		img.height = 18;
		cell.innerHTML = '';
		cell.append(img);
	}
}