import { useEffect, useMemo, useState } from "react";

import Tile from "@/components/tile/tile";
import { usePlayerData } from "@/hooks/usePlayerData";

import DeltaIndicator from "./deltaIndicator";

export default function HeadShotsStats() {
	const { user: { stats }, loading} = usePlayerData();

	const [kills, setKills] = useState(0);
	const [deaths, setDeaths] = useState(0);
	const [assists, setAssists] = useState(0);
	const [headShots, setHeadShots] = useState(0);

	useEffect(() => {
		if (loading || stats === false) return;

		setKills(stats.totals.overall.K ?? 0);
		setDeaths(stats.totals.overall.D ?? 0);
		setAssists(stats.totals.overall.A ?? 0);
		setHeadShots(stats.totals.overall.HS ?? 0);
	}, [loading]);

	const headShotsRate = useMemo(() => ((headShots / (kills || 1)) * 100).toFixed(0), [headShots, kills]);

	return (
		<Tile 
			isLoading={loading}
			width={266}
			height={155}
			content={(
				<div className="col full-width space-between">
					<div className="row nowrap space-between">
						<span className="text">
							HS%
						</span>
						<div className="col nogap align-right">
							<div className="row align-right" >
								<DeltaIndicator deltaKey="adr" className="text-gray" style={{ marginBottom: '5px' }} showZero={false} />
								<span className="text-big">
									{headShotsRate}%
								</span>
								<img height={35} width={35} src="https://static.csstats.gg/images/headshot-icon.png" alt="hs-icon" />
							</div>
						</div>
					</div>
					<div className="col nogap">
						<div className="row space-between underlined">
							<span className="text-light">KILLS</span>
							<span className="text-light">{ kills }</span>
						</div>
						<div className="row space-between underlined">
							<span className="text-light">DEATHS</span>
							<span className="text-light">{ deaths }</span>
						</div>
						<div className="row space-between underlined">
							<span className="text-light">ASSISTS</span>
							<span className="text-light">{ assists }</span>
						</div>
						<div className="row space-between underlined">
							<span className="text-light">HEADSHOTS</span>
							<span className="text-light">{ headShots }</span>
						</div>
					</div>
				</div>
			)} 
		/>
	);
}