import { getRankName, getRankPicture } from "@/utils/ranks";
import type { CSGameMode } from "@/utils/types";

interface props {
	rankNumber: number;
	gamemode: CSGameMode;
	hasRankChanges?: boolean;
	isRankUp?: boolean;
}

export default function CompetitiveOrWingmanRankIcon({ rankNumber, gamemode, hasRankChanges, isRankUp }: props) {
	if (!hasRankChanges)
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					gap: "0.5rem",
				}}
			>
				<img width="55" alt={getRankName(rankNumber, gamemode)} src={getRankPicture(rankNumber, gamemode)} title={getRankName(rankNumber, gamemode)} />
			</div>
		);

	return (
		<div
			style={{
				display: "flex",
				flexFlow: "row",
				justifyContent: "center",
				alignItems: "flex-start",
				gap: ".25rem",
			}}
		>
			<img
				width="55"
				alt={getRankName(rankNumber + (isRankUp ? -1 : 1), gamemode)}
				src={getRankPicture(rankNumber + (isRankUp ? -1 : 1), gamemode)}
				title={getRankName(rankNumber + (isRankUp ? -1 : 1), gamemode)}
				style={{ margin: "auto" }}
			/>

			<div
				style={{
					display: "flex",
					flexFlow: "column",
					alignItems: "center",
					justifyContent: "center",
					lineHeight: ".8em",
					width: "23.2px",
					height: "22.55px",
				}}
			>
				<span className="glyphicon glyphicon-arrow-right" style={{ fontSize: "12px", marginBottom: "3px" }} />
			</div>

			<img width="55" alt={getRankName(rankNumber, gamemode)} src={getRankPicture(rankNumber, gamemode)} style={{ margin: "auto" }} title={getRankName(rankNumber, gamemode)} />
		</div>
	);
}
