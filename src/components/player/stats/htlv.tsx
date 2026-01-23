import { useMemo } from "react";
import { Chart } from "react-chartjs-2";
import Tile from "@/components/tile/tile";
import { usePlayerData } from "@/hooks/usePlayerData";
import { options } from "@/utils/chart";
import DeltaIndicator from "./deltaIndicator";

import "chart.js/auto";

export default function HLTVStats() {
	const {
		user: { stats },
		loading,
	} = usePlayerData();

	const { baseRating, rating1, rating2, isMaxed, isOverMaxed } = useMemo(() => {
		if (loading || !stats)
			return {
				baseRating: 0,
				rating1: 0,
				rating2: 100,
				isMaxed: false,
				isOverMaxed: false,
			};

		const offset = 0.4;
		const maxHLTVRating = 1.8;
		const baseRating = stats?.overall?.rating ?? 0;

		let rating1 = baseRating - offset;
		if (rating1 > maxHLTVRating) rating1 = maxHLTVRating;

		rating1 = (rating1 / (maxHLTVRating / 2)) * 100; // normalize
		let rating2 = 100 - rating1;

		let isMaxed = false;
		if (baseRating > maxHLTVRating / 2 + offset) {
			isMaxed = true;
			rating1 = rating1 - 100;
			rating2 = 100 - rating1;
		}

		const isOverMaxed = baseRating > maxHLTVRating;

		return {
			baseRating,
			rating1,
			rating2,
			isMaxed,
			isOverMaxed,
		};
	}, [stats, loading]);

	return (
		<Tile
			isLoading={loading}
			width={273}
			height={273}
			content={
				<div className="col nogap">
					<div className="row nowrap space-between">
						<span className="text">HLTV RATING</span>
					</div>
					<div className="text-over-chart col center-y center-x">
						{baseRating}
						<div className="row text">
							<DeltaIndicator deltaKey="rating" />
						</div>
					</div>
					<Chart
						type="doughnut"
						data={{
							datasets: [
								{
									data: [rating1, rating2],
									borderWidth: 0,
									animation: false,
									weight: 1,
									backgroundColor: isOverMaxed
										? ["rgb(250, 173, 58)"]
										: isMaxed
											? ["rgb(125, 205, 78)", "rgba(125, 205, 78, .2)"]
											: ["rgb(125, 205, 78)", "rgba(202, 81,  81, .2)"],
								},
							],
						}}
						options={{
							...options,
							cutout: "95%",
						}}
					/>
				</div>
			}
		/>
	);
}
