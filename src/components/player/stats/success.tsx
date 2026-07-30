import { useEffect, useState } from "react";
import { MapIcon } from "@/components/map-icon";
import Tile from "@/components/tile/tile";
import { usePlayerData } from "@/hooks/usePlayerData";
import type { CS2Map } from "@/utils/constants";
import { getMapName } from "@/utils/maps";
import type { Stats } from "@/utils/types";

export default function MostSuccessStats() {
	const {
		user: { stats },
		loading,
	} = usePlayerData();

	const [mostSuccessful, setMostSuccessful] = useState<(Stats["maps"]["overall"][CS2Map] & { map: CS2Map })[]>([]);

	useEffect(() => {
		if (loading || !stats) return;
		setMostSuccessful(
			[
				...(Object.entries(stats.maps.overall) as [CS2Map, Stats["maps"]["overall"][CS2Map]][]).map(([map, data]) => ({
					map,
					...data,
				})),
			].sort((a, b) => b.won / b.played - a.won / a.played),
		);
	}, [loading, stats]);

	return (
		<Tile
			isLoading={loading}
			width={266}
			height={(436.5 - 20) / 3}
			content={
				<div className="flex flex-col w-full gap-[10px]">
					<div className="flex flex-row flex-nowrap justify-between gap-[10px]">
						<span className="text-[13px] leading-[13px] h-[13px] text-white font-bold">MOST SUCCESS</span>
					</div>
					<div className="flex flex-col gap-0 overflow-y-auto">
						{mostSuccessful.map(({ map, won, played }) => (
							<div key={map} className="flex flex-row justify-between items-center border-b border-white/20 py-1 gap-[10px]">
								<MapIcon src={map} height={20} width={20} alt={map} />
								<span className="text-[13px] leading-[13px] h-[13px] text-white/75 font-normal w-full text-left capitalize">{getMapName(map)}</span>
								<span className="text-[13px] leading-[13px] h-[13px] text-[#aaaaaa] font-normal">{won}</span>
								<div className="flex flex-row gap-0 flex-nowrap w-full" style={{ maxWidth: "70px" }}>
									<div
										style={{
											height: "3px",
											backgroundColor: (won / played) * 100 > 90 && played > 5 ? "orange" : "rgb(125, 205, 78)",
											width: `${(won / played) * 100}%`,
										}}
									/>
									<div
										style={{
											height: "3px",
											backgroundColor: "rgba(202, 81,  81, .2)",
											width: `${((played - won) / played) * 100}%`,
										}}
									/>
								</div>
								<span className="text-[13px] leading-[13px] h-[13px] text-[#aaaaaa] font-normal">{((won / played) * 100).toFixed(0)}%</span>
							</div>
						))}
					</div>
				</div>
			}
		/>
	);
}
