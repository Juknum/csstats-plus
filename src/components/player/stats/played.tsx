import { useEffect, useState } from "react";
import Tile from "@/components/tile/tile";
import { usePlayerData } from "@/hooks/usePlayerData";
import type { CS2Map } from "@/utils/constants";
import { getMapName } from "@/utils/maps";
import type { Stats } from "@/utils/types";
import { MapIcon } from "@/components/map-icon";

export default function MostPlayedStats() {
	const {
		user: { stats },
		loading,
	} = usePlayerData();

	const [totalPlayed, setPlayed] = useState(0);
	const [mostPlayed, setMostPlayed] = useState<(Stats["maps"]["overall"][CS2Map] & { map: CS2Map })[]>([]);

	useEffect(() => {
		if (loading || !stats) return;

		setPlayed(Object.values(stats.maps.overall).reduce((acc, map) => acc + map.played, 0));

		setMostPlayed(
			[
				...(Object.entries(stats.maps.overall) as [CS2Map, Stats["maps"]["overall"][CS2Map]][]).map(([map, data]) => ({
					map,
					...data,
				})),
			].sort((a, b) => b.played - a.played),
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
						<span className="text-[13px] leading-[13px] h-[13px] text-white font-bold">MOST PLAYED</span>
					</div>
					<div className="flex flex-col gap-0 overflow-y-auto">
						{mostPlayed.map(({ map, played }) => (
							<div key={map} className="flex flex-row justify-between items-center border-b border-white/20 py-1 gap-[10px]">
								<MapIcon src={map} height={20} width={20} alt={map} />
								<span className="text-[13px] leading-[13px] h-[13px] text-white/75 font-normal w-full text-left capitalize">{getMapName(map)}</span>
								<span className="text-[13px] leading-[13px] h-[13px] text-[#aaaaaa] font-normal">{played}</span>
								<div className="flex flex-row gap-0 flex-nowrap w-full" style={{ width: "70px" }}>
									<div
										style={{
											height: "3px",
											backgroundColor: "#3A74FA",
											width: `${(played / totalPlayed) * 100}%`,
										}}
									/>
									<div
										style={{
											height: "3px",
											backgroundColor: "transparent",
											width: `${((totalPlayed - played) / totalPlayed) * 100}%`,
										}}
									/>
								</div>
								<span className="text-[13px] leading-[13px] h-[13px] text-[#aaaaaa] font-normal">{((played / totalPlayed) * 100).toFixed(0)}%</span>
							</div>
						))}
					</div>
				</div>
			}
		/>
	);
}
