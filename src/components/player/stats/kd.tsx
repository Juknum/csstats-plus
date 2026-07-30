import { useMemo } from "react";
import { Chart } from "react-chartjs-2";

import Tile from "@/components/tile/tile";
import { usePlayerData } from "@/hooks/usePlayerData";
import { options } from "@/utils/chart";

import DeltaIndicator from "./deltaIndicator";

import "chart.js/auto";

export default function KDStats() {
	const {
		user: { stats },
		loading,
	} = usePlayerData();

	const { baseKpd, kpd1, kpd2, isMaxed, isOverMaxed } = useMemo(() => {
		const maxKpd = 3.0;
		const baseKpd = stats !== false ? (stats?.overall?.kpd ?? 0) : 0;

		const isOverMaxed = baseKpd > maxKpd;
		const isMaxed = baseKpd > maxKpd / 2;

		let kpd1 = 0;
		let kpd2 = 0;

		if (isOverMaxed) {
			kpd1 = 100;
			kpd2 = 0;
		} else if (isMaxed) {
			kpd1 = ((baseKpd - maxKpd / 2) / (maxKpd / 2)) * 100;
			kpd2 = 100 - kpd1;
		} else {
			kpd1 = (baseKpd / (maxKpd / 2)) * 100;
			kpd2 = 100 - kpd1;
		}

		return { baseKpd, kpd1, kpd2, isMaxed, isOverMaxed };
	}, [stats]);

	return (
		<Tile
			isLoading={loading}
			width={273}
			height={273}
			className="relative tile-square aspect-square flex-1 min-w-0"
			content={
				<div className="flex flex-col gap-0 w-full h-full relative">
					<div className="flex flex-row flex-nowrap justify-between gap-[10px] z-10">
						<span className="text-[13px] leading-[13px] h-[13px] text-white font-bold">K/D</span>
					</div>
					<div className="absolute top-[calc(50%+13px)] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[30px] sm:text-[50px] text-white flex flex-col items-center justify-center z-10">
						{baseKpd}
						<DeltaIndicator deltaKey="kpd" />
					</div>
					<div className="w-full flex-1 min-h-0 relative flex items-center justify-center">
						<Chart
							type="doughnut"
							data={{
								datasets: [
									{
										data: [kpd1, kpd2],
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
								responsive: true,
								maintainAspectRatio: false,
								cutout: "95%",
							}}
						/>
					</div>
				</div>
			}
		/>
	);
}
