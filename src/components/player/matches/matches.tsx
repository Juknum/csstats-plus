import { useCallback, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import CompetitiveOrWingmanRankIcon from "@/components/rank-icons/comp-win-rank";
import FaceitRankIcon from "@/components/rank-icons/faceit-rank";
import { usePlayerData } from "@/hooks/usePlayerData";
import type { CS2Map } from "@/utils/constants";
import { getMapIcon, getMapName } from "@/utils/maps";

export default function Matches() {
	const { loading } = usePlayerData();
	const table = useRef<HTMLTableElement | null>(null);

	const updateMapCell = useCallback((cell: HTMLTableCellElement) => {
		const img = cell.querySelector("img");
		const mapName = (img?.alt?.trim() || cell.textContent?.trim() || "").toLowerCase() as CS2Map | "";

		createRoot(cell).render(
			(() => (
				<div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
					{mapName !== "" && <img height="25" src={getMapIcon(mapName)} alt={mapName} />}
					<span style={{ textTransform: "capitalize" }}>{getMapName(mapName)}</span>
				</div>
			))(),
		);
	}, []);

	const updateWingmanRankCell = useCallback((cell: HTMLTableCellElement, child: HTMLImageElement) => {
		const imageUrl = child.src as `https://static.csstats.gg/images/ranks/wingman/wingman${number}.svg`;
		const rankNumber = imageUrl.match(/wingman\/wingman(\d+)\.svg/)?.[1] || "-1";

		createRoot(cell).render(
			<CompetitiveOrWingmanRankIcon
				rankNumber={parseInt(rankNumber, 10)}
				gamemode={"Wingman"}
				hasRankChanges={cell.childElementCount > 1}
				isRankUp={cell.lastElementChild?.classList.contains("glyphicon-chevron-up")}
			/>,
		);
	}, []);

	const updateCompetitiveRankCell = useCallback((cell: HTMLTableCellElement, child: HTMLSpanElement | null) => {
		const backgroundImage = child ? (getComputedStyle(child).backgroundImage as `url("https://static.csstats.gg/images/ranks/${number}.png")`) : "";
		const rankNumber = backgroundImage.match(/ranks\/(\d+)\.png/)?.[1] || "-1";

		createRoot(cell).render(
			<CompetitiveOrWingmanRankIcon
				rankNumber={parseInt(rankNumber, 10)}
				gamemode={"Competitive"}
				hasRankChanges={cell.childElementCount > 1}
				isRankUp={cell.lastElementChild?.classList.contains("glyphicon-chevron-up")}
			/>,
		);
	}, []);

	const updateFaceItRankCell = useCallback((cell: HTMLTableCellElement, child: HTMLImageElement) => {
		const imageUrl = child.src as `https://static.csstats.gg/images/ranks/faceit/level${number}.png`;
		const rankNumber = imageUrl.match(/faceit\/level(\d+)\.png/)?.[1];
		if (!rankNumber) return;

		createRoot(cell).render(<FaceitRankIcon rankNumber={parseInt(rankNumber, 10)} />);
	}, []);

	const updateAnyRankCell = useCallback(
		(cell: HTMLTableCellElement) => {
			const child = cell.firstElementChild;
			if (!child) {
				updateCompetitiveRankCell(cell, null);
				return;
			}

			switch (child.tagName) {
				case "SPAN":
					updateCompetitiveRankCell(cell, child as HTMLSpanElement);
					break;

				case "IMG":
					updateWingmanRankCell(cell, child as HTMLImageElement);
					break;

				case "DIV":
					if (child.firstElementChild instanceof HTMLImageElement) {
						updateFaceItRankCell(cell, child.firstElementChild);
					}
					break;

				default:
					return;
			}
		},
		[updateCompetitiveRankCell, updateWingmanRankCell, updateFaceItRankCell],
	);

	const updateTable = useCallback(() => {
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
	}, [updateMapCell, updateAnyRankCell]);

	useEffect(() => {
		if (loading) return;

		const container = document.getElementById("match-list-outer");
		if (!container) return;

		table.current = container.querySelector("table");
		if (!table.current) return;

		updateTable();
	}, [loading, updateTable]);

	return null;
}
