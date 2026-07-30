import { Chart } from "react-chartjs-2";
import Tile from "@/components/tile/tile";
import { usePlayerData } from "@/hooks/usePlayerData";
import { options } from "@/utils/chart";

import "chart.js/auto";

export default function ClutchStats() {
	const {
		user: { stats },
		loading,
	} = usePlayerData();
	const versus = ["1v1", "1v2", "1v3", "1v4", "1v5"] as const;

	const clutchChart = (percentage: number, is1vX: boolean) => {
		return (
			<Chart
				type="pie"
				style={{ position: "absolute" }}
				height={is1vX ? 100 : 75}
				width={is1vX ? 100 : 75}
				options={{
					...options,
					cutout: "80%",
				}}
				data={{
					datasets: [
						{
							data: [percentage, 100 - percentage],
							borderWidth: 0,
							animation: false,
							weight: 1,
							backgroundColor: ["#3A74FA", "#4B505E"],
						},
					],
				}}
			/>
		);
	};

	return (
		<Tile
			isLoading={loading}
			width={273 * 2 + 10}
			height={153.5 + 4}
			content={
				<div className="flex flex-col gap-0 w-full">
					<div className="flex flex-row flex-nowrap justify-between gap-[10px]">
						<span className="text-[13px] leading-[13px] h-[13px] text-white font-bold">CLUTCH SUCCESS</span>
					</div>
					<div className="flex flex-row gap-0 justify-between w-full h-full overflow-x-auto">
						<div className="flex flex-row w-full justify-evenly gap-[10px]" style={{ maxWidth: "calc(100% - 120px - 10px)" }}>
							{versus.map((type) => (
								<div key={type} className="flex flex-col items-center justify-center h-full relative gap-[10px]" style={{ width: "80px" }}>
									{clutchChart(!loading && stats ? stats.overall[type] : 0, false)}
									<span className="text-[13px] leading-[13px] h-[13px] text-white/75 font-normal absolute">{!loading && stats ? `${stats.overall[type]}%` : "-"}</span>
									<span className="text-[13px] leading-[13px] h-[13px] text-white/75 font-normal absolute" style={{ top: "20px" }}>
										{type}
									</span>
									<span className="text-[9px] leading-[14px] h-[14px] text-right text-[#aaaaaa] absolute" style={{ bottom: "20px" }}>
										W: {!loading && stats ? stats.totals.overall[type] : "-"} / L: {!loading && stats ? stats.totals.overall[`${type}_lost`] : "-"}
									</span>
								</div>
							))}
						</div>
						<div className="border-l border-[#4b505e] pl-[10px] flex flex-col justify-center items-center h-full relative gap-[10px]" style={{ width: "120px" }}>
							{clutchChart(!loading && stats ? stats.overall["1vX"] : 0, true)}
							<span
								className="text-[13px] leading-[13px] h-[13px] text-white/75 font-normal absolute"
								style={{
									fontSize: "18px",
								}}
							>
								{!loading && stats ? `${stats.overall["1vX"]}%` : "-"}
							</span>
							<span className="text-[13px] leading-[13px] h-[13px] text-white/75 font-normal absolute" style={{ top: "0px" }}>
								Average
							</span>
							<span className="text-[9px] leading-[14px] h-[14px] text-right text-[#aaaaaa] absolute" style={{ bottom: "0px" }}>
								W: {!loading && stats ? versus.reduce((acc, type) => acc + stats.totals.overall[type], 0) : "-"} / L:{" "}
								{!loading && stats ? versus.reduce((acc, type) => acc + stats.totals.overall[`${type}_lost`], 0) : "-"}
							</span>
						</div>
					</div>
				</div>
			}
		/>
	);
}
