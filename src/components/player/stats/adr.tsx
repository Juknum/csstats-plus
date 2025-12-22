import { useEffect, useMemo, useState } from "react";

import Tile from "@/components/tile/tile";
import { usePlayerData } from "@/hooks/usePlayerData";

import DeltaIndicator from "./deltaIndicator";

export default function AverageDamagesStats() {
	const { user: { stats }, loading} = usePlayerData();

	const [dmg, setDmg] = useState(0);
	const [rounds, setRounds] = useState(0);

	useEffect(() => {
		if (loading || stats === false) return;

		setDmg(stats.totals.overall.dmg ?? 0);
		setRounds(stats.totals.overall.rounds ?? 0);
	}, [loading]);

	const adr = useMemo(() => (dmg / (rounds || 1)).toFixed(0), [dmg, rounds]);
	
	return (
		<Tile 
			isLoading={loading}
			width={266}
			content={(
				<div className="col full-width space-between">
					<div className="row nowrap space-between">
						<span className="text">
							ADR
						</span>
						<div className="col nogap align-right">
							<div className="row align-right" >
								<DeltaIndicator deltaKey="adr" className="text-gray" style={{ marginBottom: '5px' }} showZero={false} />
								<span className="text-big">
									{adr}
								</span>
								<img height={35} width={35} src="https://static.csstats.gg/images/damage-icon.png" alt="adr-icon" />
							</div>
						</div>
					</div>
					<div className="col nogap">
						<div className="row space-between underlined">
							<span className="text-light">DAMAGES</span>
							<span className="text-light">{ dmg }</span>
						</div>
						<div className="row space-between underlined">
							<span className="text-light">ROUNDS</span>
							<span className="text-light">{ rounds }</span>
						</div>
					</div>
				</div>
			)} 
		/>
	);
}