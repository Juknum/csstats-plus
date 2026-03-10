import { useCallback, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { usePlayerData } from "@/hooks/usePlayerData";
import { getMapName } from "@/utils/maps";
import { MapIcon } from "@/components/map-icon";

export default function Maps() {
	const { loading } = usePlayerData();

	const updateRows = useCallback((rows: HTMLDivElement[]) => {
		rows.forEach((row) => {
			// map name column
			const mapCell = row.firstElementChild;
			if (!mapCell) return;

			const mapName = mapCell.querySelector("span")?.textContent;
			if (!mapName) return;

			createRoot(mapCell).render(
				(() => (
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							gap: ".5rem",
						}}
					>
						<MapIcon height="60" src={mapName} alt={mapName} />
						<span style={{ textTransform: "capitalize" }}>{getMapName(mapName)}</span>
					</div>
				))(),
			);
		});
	}, []);

	useEffect(() => {
		if (loading) return;

		const topContainer = document.getElementById("player-maps");
		if (!topContainer) return;

		const subContainers = topContainer.querySelector("div");
		if (!subContainers) return;

		const rows: HTMLDivElement[] = [];
		for (let i = 0; i < subContainers.children.length; i++) {
			const element = subContainers.children.item(i);

			if (element && element instanceof HTMLDivElement) {
				element.style.padding = "0px";
				rows.push(element.querySelector("div") as HTMLDivElement);
			}
		}

		const header = rows.shift()?.parentElement;
		const mapHead = header?.children.item(0) as HTMLDivElement | null;
		const wrHead = header?.children.item(1) as HTMLDivElement | null;

		if (mapHead && wrHead) {
			mapHead.style.textAlign = "center";
			wrHead.style.textAlign = "center";
		}

		updateRows(rows);
	}, [loading, updateRows]);

	return null;
}
