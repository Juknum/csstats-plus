import { useEffect, useState } from "react";

import Tile from "@/components/tile/tile";
import { usePlayerData } from "@/hooks/usePlayerData";
import type { CS2Map } from "@/utils/constants";
import { getMapIcon, getMapName } from "@/utils/maps";
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
				<div className="col full-width">
					<div className="row nowrap space-between">
						<span className="text">MOST SUCCESS</span>
					</div>
					<div className="col nogap" style={{ overflowY: "scroll" }}>
						{mostSuccessful.map(({ map, won, played }) => (
							<div key={map} className="row space-between center-y underlined">
								<img src={getMapIcon(map)} height={20} width={20} alt={map} />
								<span className="text-light full-width align-left text-capitalize">{getMapName(map)}</span>
								<span className="text-light text-gray">{won}</span>
								<div className="row nogap nowrap full-width" style={{ maxWidth: "70px" }}>
									<div
										style={{
											height: "3px",
											backgroundColor: (won / played) * 100 > 90 && played > 5 ? "orange" : "rgb(125, 205, 78)",
											width: `${(won / played) * 100}%`,
										}}
									></div>
									<div
										style={{
											height: "3px",
											backgroundColor: "rgba(202, 81,  81, .2)",
											width: `${((played - won) / played) * 100}%`,
										}}
									></div>
								</div>
								<span className="text-light text-gray">{((won / played) * 100).toFixed(0)}%</span>
							</div>
						))}
					</div>
				</div>
			}
		/>
	);
}
