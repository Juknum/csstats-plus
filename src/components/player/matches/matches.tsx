import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

import FaceitRankIcon from "@/components/rank-icons/faceit-rank";
import CompetitiveOrWingmanRankIcon from "@/components/rank-icons/comp-win-rank";
import { usePlayerData } from "@/hooks/usePlayerData";
import { getMapIcon, getMapName } from "@/utils/maps";
import type { CS2Map } from "@/utils/constants";

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
			updateAnyRankCell(rankCell);
		});
	};

	const updateMapCell = (cell: HTMLTableCellElement) => {
		const img = cell.querySelector('img');
		const mapName = img?.alt || cell.textContent || '';

		createRoot(cell).render((() => (
			<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
				<img height="25" src={getMapIcon(mapName as CS2Map)} alt={mapName} />
				<span style={{ textTransform: 'capitalize' }}>{getMapName(mapName)}</span>
			</div>
		))());
	};

	const updateAnyRankCell = (cell: HTMLTableCellElement) => {
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

		createRoot(cell).render(
			<CompetitiveOrWingmanRankIcon
				rankNumber={parseInt(rankNumber)}
				gamemode={'Wingman'}
				hasRankChanges={cell.childElementCount > 1}
				isRankUp={cell.lastElementChild!.classList.contains('glyphicon-chevron-up')}
			/>
		);
	};

	const updateCompetitiveRankCell = (cell: HTMLTableCellElement, child: HTMLSpanElement) => {
		const backgroundImage = getComputedStyle(child).backgroundImage as `url("https://static.csstats.gg/images/ranks/${number}.png")`;
		const rankNumber = backgroundImage.match(/ranks\/(\d+)\.png/)?.[1];
		if (!rankNumber) return;

		createRoot(cell).render(
			<CompetitiveOrWingmanRankIcon
				rankNumber={parseInt(rankNumber)}
				gamemode={'Competitive'}
				hasRankChanges={cell.childElementCount > 1}
				isRankUp={cell.lastElementChild!.classList.contains('glyphicon-chevron-up')}
			/>
		);
	}

	const updateFaceItRankCell = (cell: HTMLTableCellElement, child: HTMLImageElement) => {
		const imageUrl = child.src as `https://static.csstats.gg/images/ranks/faceit/level${number}.png`;
		const rankNumber = imageUrl.match(/faceit\/level(\d+)\.png/)?.[1];
		if (!rankNumber) return;

		createRoot(cell).render(<FaceitRankIcon rankNumber={parseInt(rankNumber)} />);
	};

	return <></>;
}