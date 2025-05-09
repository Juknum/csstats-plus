import { CS2Map } from "../utils/constants.js";
import { getMapIcon, getMapName } from "../utils/maps.js";

import Chart from 'chart.js/auto';
import { options, percentageToRadians } from "../utils/chart.js";

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
			mapCell.style.height = '70px';

			const pieCell = row.children[1] as HTMLDivElement;

			const oldCanvas = pieCell.querySelector('canvas') as HTMLCanvasElement;
			const percentageSpan = pieCell.querySelector('span') as HTMLSpanElement;
			const percentage = parseFloat(percentageSpan.textContent!.replace('%', ''));

			const canvas = document.createElement('canvas');
			new Chart(canvas, {
				type: 'doughnut',
				data: {
					datasets: [{
						data: [percentage, 100 - percentage].map(percentageToRadians),
						backgroundColor: ['rgb(125, 205, 78)', 'rgb(202, 81, 81)'],
						borderWidth: 0,
					}],
				},
				options: {
					...options,
					cutout: '80%',
				},
			});

			oldCanvas.remove();
			pieCell.children[0].remove();

			pieCell.style.maxHeight = '70px';
			pieCell.style.display = 'flex';
			pieCell.style.alignItems = 'center';
			pieCell.style.justifyContent = 'center';
			pieCell.style.position = 'relative';
			pieCell.style.margin = '0';
			pieCell.append(canvas);

			const percentageText = document.createElement('span');
			percentageText.innerText = percentage + '%';
			percentageText.style.position = 'absolute';
			percentageText.style.fontSize = '1.125em';
			percentageText.style.fontWeight = 'bold';
			percentageText.style.color = 'white';
			pieCell.append(percentageText);
		})
		
	}

}