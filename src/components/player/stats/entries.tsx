import { useEffect, useState } from "react";
import { Chart } from "react-chartjs-2";
import Tile from "@/components/tile/tile";
import { usePlayerData } from "@/hooks/usePlayerData";
import { options } from "@/utils/chart";

import "chart.js/auto";

export default function EntriesStats() {
	const { loading } = usePlayerData();

	type Types = "both" | "T" | "CT";
	const types: Record<Types, string> = {
		both: "Combined",
		T: "T Entries",
		CT: "CT Entries",
	};

	type Kind = "success" | "attempts";
	const kindLabel: Record<Kind, string> = {
		success: "Success",
		attempts: "Attempts",
	};

	const entryChart = (percentage: number, kind: Types | "avg") => {
		return (
			<Chart
				type="pie"
				options={{
					...options,
					responsive: true,
					maintainAspectRatio: false,
					cutout: "80%",
				}}
				data={{
					datasets: [
						{
							data: [percentage, 100 - percentage],
							borderWidth: 0,
							animation: false,
							weight: 1,
							backgroundColor: [kind === "both" || kind === "avg" ? "#3A74FA" : kind === "T" ? "#FAAD3A" : "#3AA9FA", "#4B505E"],
						},
					],
				}}
			/>
		);
	};

	const [values, setValues] = useState<Record<Kind, Record<Types, number>>>();
	const [avg, setAvg] = useState<number>(0);

	useEffect(() => {
		if (loading) return;

		setValues({
			success: {
				both: parseInt(document.getElementById("2-fk-both")?.dataset.chartValue ?? "0", 10),
				CT: parseInt(document.getElementById("2-fk-ct")?.dataset.chartValue ?? "0", 10),
				T: parseInt(document.getElementById("2-fk-t")?.dataset.chartValue ?? "0", 10),
			},
			attempts: {
				both: parseInt(document.getElementById("1-fk-both")?.dataset.chartValue ?? "0", 10),
				CT: parseInt(document.getElementById("1-fk-ct")?.dataset.chartValue ?? "0", 10),
				T: parseInt(document.getElementById("1-fk-t")?.dataset.chartValue ?? "0", 10),
			},
		});

		const spanElement = document.getElementById("player-overview")?.children[1]?.children[1]?.children[0]?.children[1]?.children[1]?.children[0]?.children[1] as
			| HTMLSpanElement
			| undefined;

		setAvg(parseInt(spanElement?.textContent?.trim().replace("%", "") ?? "0", 10));
	}, [loading]);

	return (
		<Tile
			isLoading={loading}
			width={542}
			height={277}
			className="entries-tile overflow-hidden"
			content={
				<div className="flex flex-col w-full gap-[15px] overflow-hidden">
					<div className="flex flex-row flex-nowrap justify-between gap-[10px] shrink-0">
						<span className="text-[13px] leading-[13px] h-[13px] text-white font-bold">ENTRIES SUCCESS</span>
					</div>
					<div className="flex flex-col sm:flex-row gap-4 w-full h-full justify-between items-center overflow-hidden">
						{/* Left / Main Stats Grid */}
						<div className="flex flex-col gap-2 w-full sm:flex-1">
							{/* Column Headers */}
							<div className="grid grid-cols-[60px_1fr_1fr_1fr] sm:grid-cols-[70px_1fr_1fr_1fr] items-center gap-1 text-center text-[11px] sm:text-[12px] text-white/75 font-medium">
								<span />
								{Object.values(types).map((label) => (
									<span key={label} className="truncate">
										{label}
									</span>
								))}
							</div>

							{/* Entry Rows */}
							{(Object.entries(kindLabel) as [Kind, string][]).map(([kindKey, value]) => (
								<div key={kindKey} className="grid grid-cols-[60px_1fr_1fr_1fr] sm:grid-cols-[70px_1fr_1fr_1fr] items-center gap-1">
									<span className="text-[11px] sm:text-[13px] text-white/75 font-normal truncate">{value}</span>
									{(Object.keys(types) as Types[]).map((typeKey) => (
										<div key={typeKey} className="flex flex-col gap-0 justify-center items-center relative py-1">
											<div className="w-[65px] h-[65px] sm:w-[75px] sm:h-[75px] relative flex items-center justify-center">
												{entryChart(values ? values[kindKey][typeKey] : 0, typeKey)}
												<span className="text-[11px] sm:text-[12px] text-white/90 font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
													{values ? values[kindKey][typeKey] : 0}%
												</span>
											</div>
										</div>
									))}
								</div>
							))}
						</div>

						{/* Right / Bottom "per Round" Average chart */}
						<div className="flex flex-col justify-center items-center relative border-t sm:border-t-0 sm:border-l border-[#4b505e]/50 pt-3 sm:pt-0 sm:pl-3 gap-1 w-full sm:w-[130px] shrink-0">
							<div className="w-[100px] h-[100px] sm:w-[110px] sm:h-[110px] relative flex items-center justify-center">
								{entryChart(avg, "avg")}
								<span className="text-[20px] sm:text-[22px] text-white/90 font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">{avg}%</span>
							</div>
							<span className="text-[11px] sm:text-[13px] text-white/75 font-normal">per Round</span>
						</div>
					</div>
				</div>
			}
		/>
	);
}
