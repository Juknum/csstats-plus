import { useEffect, useState } from "react";
import Tile from "@/components/tile/tile";
import { usePlayerData } from "@/hooks/usePlayerData";
import type { Stats } from "@/utils/types";
import { getWeaponIcon } from "@/utils/weapons";

export default function MostKillsStats() {
	const {
		user: { stats },
		loading,
	} = usePlayerData();

	const [totalKills, setKills] = useState(0);
	const [mostKills, setMostKills] = useState<(Stats["weapons"]["overall"][string] & { weapon: string })[]>([]);

	useEffect(() => {
		if (loading || !stats) return;

		setKills(Object.values(stats.weapons.overall).reduce((acc, weapon) => acc + weapon.kills, 0));

		setMostKills(
			[
				...(Object.entries(stats.weapons.overall) as [string, Stats["weapons"]["overall"][string]][]).map(([weapon, data]) => ({
					weapon,
					...data,
				})),
			]
				.filter((w) => w.kills > 0)
				.sort((a, b) => b.kills - a.kills),
		);
	}, [loading, stats]);

	return (
		<Tile
			isLoading={loading}
			width={266}
			height={(436.5 - 20) / 3 + 4}
			content={
				<div className="flex flex-col w-full gap-[10px]">
					<div className="flex flex-row flex-nowrap justify-between gap-[10px]">
						<span className="text-[13px] leading-[13px] h-[13px] text-white font-bold">MOST KILLS</span>
					</div>
					<div className="flex flex-col gap-0 overflow-y-auto">
						{mostKills.map(({ weapon, kills }) => (
							<div key={weapon} className="flex flex-row justify-between items-center border-b border-white/20 py-1 gap-[10px]">
								<div className="w-full">
									<img src={getWeaponIcon(weapon)} height={20} alt={weapon} />
								</div>
								<span className="text-[13px] leading-[13px] h-[13px] text-[#aaaaaa] font-normal">{kills}</span>
								<div className="flex flex-row gap-0 flex-nowrap w-full" style={{ width: "70px" }}>
									<div
										style={{
											height: "3px",
											backgroundColor: "#3A74FA",
											width: `${(kills / totalKills) * 100}%`,
										}}
									/>
									<div
										style={{
											height: "3px",
											backgroundColor: "transparent",
											width: `${((totalKills - kills) / totalKills) * 100}%`,
										}}
									/>
								</div>
								<span className="text-[13px] leading-[13px] h-[13px] text-[#aaaaaa] font-normal">{((kills / totalKills) * 100).toFixed(0)}%</span>
							</div>
						))}
					</div>
				</div>
			}
		/>
	);
}
