import { useState, useEffect, useMemo } from "react";

import Tile from "@/components/tile/tile";
import { usePlayerData } from "@/hooks/usePlayerData";

import DeltaIndicator from "./deltaIndicator";

export default function WinRateStats() {
	const { user: { stats }, loading} = usePlayerData();

	const [played, setPlayed] = useState(0);
	const [won, setWon] = useState(0);
	const [lost, setLost] = useState(0);
	const [draw, setDraw] = useState(0);

	useEffect(() => {
		if (loading || stats === false) return;

		setPlayed(stats.totals.overall.games ?? 0);
		setWon(stats.totals.overall.wins ?? 0);
		setLost(stats.totals.overall.losses ?? 0);
		setDraw(stats.totals.overall.draws ?? 0);
	}, [loading]);

	const winRate = useMemo(() => ((won / (played || 1)) * 100).toFixed(0), [won, played]);

	return (
		<Tile 
			isLoading={loading}
			width={266}
			height={155}
			content={(
				<div className="col full-width space-between">
					<div className="row nowrap space-between">
						<span className="text">
							WIN RATE
						</span>
						<div className="col nogap align-right">
							<div className="row align-right" >
								<DeltaIndicator deltaKey="adr" className="text-gray" style={{ marginBottom: '5px' }} showZero={false} />
								<span className="text-big">
									{winRate}%
								</span>
								<img height={35} width={35} src="https://static.csstats.gg/images/winrate-icon.png" alt="win-rate-icon" />
							</div>
						</div>
					</div>
					<div className="col nogap">
						<div className="row space-between underlined">
							<span className="text-light">PLAYED</span>
							<span className="text-light">{ played }</span>
						</div>
						<div className="row space-between underlined">
							<span className="text-light">WON</span>
							<span className="text-light">{ won }</span>
						</div>
						<div className="row space-between underlined">
							<span className="text-light">LOST</span>
							<span className="text-light">{ lost }</span>
						</div>
						<div className="row space-between underlined">
							<span className="text-light">DRAW</span>
							<span className="text-light">{ draw }</span>
						</div>
					</div>
				</div>
			)} 
		/>
	);
}