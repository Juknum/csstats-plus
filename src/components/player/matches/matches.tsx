import { usePlayerData } from "@/hooks/usePlayerData";
import { getMapIcon, getMapName } from "@/utils/maps";
import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

import type { CS2Map } from "@/utils/constants";
import { getRankPicture } from "@/utils/ranks";
import { CSGameMode } from "@/utils/types";

export default function Matches() {
	const { loading } = usePlayerData();
	const table = useRef<HTMLTableElement | null>(null);

	useEffect(() => {
		if (loading) return;

		const container = document.getElementById('match-list-outer');
		if (!container) return;

		table.current = container.querySelector('table');
		if (!table.current) return;
		
		updateTable();
	}, [loading]);

	const updateTable = () => {
		if (!table.current) return;

		const rows = Array.from(table.current.rows).slice(1); // skip header row

		rows.forEach((row) => {
			// map name column
			const mapCell = row.cells[2];
			updateMapCell(mapCell);

			// rank change column
			const rankCell = row.cells[4];
			updateRankCell(rankCell);
		});
	};

	const updateMapCell = (cell: HTMLTableCellElement) => {
		const img = cell.querySelector('img');
		const mapName = img?.alt || cell.textContent || '';

		createRoot(cell).render((() => (
			<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
				<img height="25" src={getMapIcon(mapName as CS2Map)} alt={mapName} className="map-icon" />
				<span style={{ textTransform: 'capitalize' }}>{getMapName(mapName)}</span>
			</div>
		))());
	};

	const updateRankCell = (cell: HTMLTableCellElement) => {
		const child = cell.firstElementChild;
		if (!child) return;

		switch (child.tagName) {
			case 'SPAN':
				updateCompetitiveRankCell(cell, child as HTMLSpanElement);
				break;

			case 'IMG':
				updateWingmanRankCell(cell, child as HTMLImageElement);
				break;

			case 'DIV':
				if (child.firstElementChild instanceof HTMLImageElement) {
					updateFaceItRankCell(cell, child.firstElementChild);
				}
				break;

			default:
				return;
		}
	};

	const updateWingmanRankCell = (cell: HTMLTableCellElement, child: HTMLImageElement) => {
		const imageUrl = child.src as `https://static.csstats.gg/images/ranks/wingman/wingman${number}.svg`;
		const rankNumber = imageUrl.match(/wingman\/wingman(\d+)\.svg/)?.[1];
		if (!rankNumber) return;

		updateBaseRankCell(cell, parseInt(rankNumber), 'Wingman'); 
	};

	const updateCompetitiveRankCell = (cell: HTMLTableCellElement, child: HTMLSpanElement) => {
		const backgroundImage = getComputedStyle(child).backgroundImage as `url("https://static.csstats.gg/images/ranks/${number}.png")`;
		const rankNumber = backgroundImage.match(/ranks\/(\d+)\.png/)?.[1];
		if (!rankNumber) return;

		updateBaseRankCell(cell, parseInt(rankNumber), 'Competitive'); 
	}
	
	const updateBaseRankCell = (cell: HTMLTableCellElement, rankNumber: number, gamemode: CSGameMode) => {
		// Either a rank up or rank down icon is present
		if (cell.childElementCount > 1) {
			const isRankUp = cell.lastElementChild!.classList.contains('glyphicon-chevron-up');

			createRoot(cell).render((() => (
				<div style={{ display: 'flex', flexFlow: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: '.25rem' }}>

					<img 
						width="55" 
						src={getRankPicture(rankNumber + (isRankUp ? -1 : 1), gamemode)}
						style={{ margin: 'auto' }}
					/>

					<div 
						style={{
							display: 'flex',
							flexFlow: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							lineHeight: '.8em',
							width: '23.2px',
							height: '22.55px'
						}}
					>
						<span
							className="glyphicon glyphicon-arrow-right"
							style={{ fontSize: '12px', marginBottom: '3px' }}
						/>
					</div>

					<img 
						width="55" 
						src={getRankPicture(rankNumber, gamemode)} 
						style={{ margin: 'auto' }}
					/>

				</div>
			))());

		}

		else createRoot(cell).render((() => (
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
				<img width="55" src={getRankPicture(rankNumber, gamemode)} />
			</div>
		))());
	};

	const updateFaceItRankCell = (cell: HTMLTableCellElement, child: HTMLImageElement) => {
		const imageUrl = child.src as `https://static.csstats.gg/images/ranks/faceit/level${number}.png`;
		const rankNumber = imageUrl.match(/faceit\/level(\d+)\.png/)?.[1];
		if (!rankNumber) return;

		createRoot(cell).render((() => (
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
				<img height="22.34" src={getRankPicture(parseInt(rankNumber), 'FACEIT')} alt={rankNumber} />
			</div>
		))());
	};

	return <></>;
}