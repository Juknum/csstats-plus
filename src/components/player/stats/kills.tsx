import { useState, useEffect } from "react";

import Tile from "@/components/tile/tile";
import { usePlayerData } from "@/hooks/usePlayerData";
import { Stats } from "@/utils/types";
import { getWeaponIcon } from "@/utils/weapons";

export default function MostKillsStats() {
	const { user: { stats }, loading } = usePlayerData();

	const [totalKills, setKills] = useState(0);
	const [mostKills, setMostKills] = useState<(Stats['weapons']['overall'][string] & { weapon: string })[]>([]);

	useEffect(() => {
		if (loading || !stats) return;

		setKills(Object.values(stats.weapons.overall).reduce((acc, weapon) => acc + weapon.kills, 0));

		setMostKills([
				...(Object.entries(stats.weapons.overall) as [string, Stats['weapons']['overall'][string]][])
				.map(([weapon, data]) => ({
					weapon,
					...data
				}))
			]
			.filter((w) => w.kills > 0)
			.sort((a, b) => b.kills - a.kills)
		);
		
	}, [loading, stats]);

	return (
		<Tile 
			width={266}
			height={(436.5 - 20) / 3}
			content={(
				<div className="col full-width">
					<div className="row nowrap space-between">
						<span className="text">
							MOST KILLS
						</span>
					</div>
					<div className="col nogap" style={{ overflowY: 'scroll' }}>
						{mostKills.map(({ weapon, kills }) => (
							<div key={weapon} className="row space-between center-y underlined">
								<div className="full-width">
									<img src={getWeaponIcon(weapon)} height={20}/>
								</div>
								<span className="text-light text-gray">{kills}</span>
								<div className="row nogap nowrap full-width" style={{ width: '70px' }}>
									<div style={{ height: '3px', backgroundColor: "#3A74FA",   width: `${(kills / totalKills * 100)}%` }}></div>
									<div style={{ height: '3px', backgroundColor: "transparent", width: `${((totalKills - kills) / totalKills * 100)}%` }}></div>
								</div>
								<span className="text-light text-gray">{(kills / totalKills * 100).toFixed(0)}%</span>
							</div>
						))}
					</div>
				</div>
			)} 
		/>
	);
}