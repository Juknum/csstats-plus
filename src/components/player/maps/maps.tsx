import { usePlayerData } from "@/hooks/usePlayerData";
import { getMapIcon, getMapName } from "@/utils/maps";
import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

import type { CS2Map } from "@/utils/constants";
import { getRankPicture } from "@/utils/ranks";
import { CSGameMode } from "@/utils/types";

export default function Maps() {
	const { loading } = usePlayerData();
	const container = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (loading) return;

		const topContainer = document.getElementById('player-maps');
		if (!topContainer) return;

		const subContainers = topContainer.querySelector('div');
		if (!subContainers) return;

		const rows: HTMLDivElement[] = [];
		for (let i = 0; i < subContainers.children.length; i++) {
			const element = subContainers.children.item(i);

			if (element && element instanceof HTMLDivElement) {
				element.style.padding = '0px';
				rows.push(element.querySelector('div') as HTMLDivElement);
			}
		}

		const header = rows.shift()?.parentElement;
		const mapHead = header?.children.item(0) as HTMLDivElement | null;
		const wrHead  = header?.children.item(1) as HTMLDivElement | null;

		if (mapHead && wrHead) {
			mapHead.style.textAlign = 'center';
			wrHead.style.textAlign  = 'center';
		}

		updateRows(rows);
	}, [loading]);

	const updateRows = (rows: HTMLDivElement[]) => {
		rows.forEach((row) => {
			// map name column
			const mapCell = row.firstElementChild
			if (!mapCell) return;

			const mapName = mapCell.querySelector('span')?.textContent;
			if (!mapName) return;

			createRoot(mapCell).render((() => (
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5rem' }}>
					<img height="60" src={getMapIcon(mapName as CS2Map)} alt={mapName} />
					<span style={{ textTransform: 'capitalize' }}>{getMapName(mapName)}</span>
				</div>
			))());
		});
	};

	return <></>;
}