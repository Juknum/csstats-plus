import { useEffect, useState } from "react";
import Tile from "@/components/tile/tile";
import { usePlayerData } from "@/hooks/usePlayerData";
import type { CS2Map } from "@/utils/constants";
import { getMapIcon, getMapName } from "@/utils/maps";
import type { Stats } from "@/utils/types";

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
				<div className="col full-width">
					<div className="row nowrap space-between">
						<span className="text">MOST PLAYED</span>
					</div>
					<div className="col nogap" style={{ overflowY: "scroll" }}>
						{mostPlayed.map(({ map, played }) => (
							<div key={map} className="row space-between center-y underlined">
								<img src={getMapIcon(map)} height={20} width={20} alt={map} />
								<span className="text-light full-width align-left text-capitalize">{getMapName(map)}</span>
								<span className="text-light text-gray">{played}</span>
								<div className="row nogap nowrap full-width" style={{ width: "70px" }}>
									<div
										style={{
											height: "3px",
											backgroundColor: "#3A74FA",
											width: `${(played / totalPlayed) * 100}%`,
										}}
									></div>
									<div
										style={{
											height: "3px",
											backgroundColor: "transparent",
											width: `${((totalPlayed - played) / totalPlayed) * 100}%`,
										}}
									></div>
								</div>
								<span className="text-light text-gray">{((played / totalPlayed) * 100).toFixed(0)}%</span>
							</div>
						))}
					</div>
				</div>
			}
		/>
	);
}
