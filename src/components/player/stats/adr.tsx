import { useEffect, useMemo, useState } from "react";

import Tile from "@/components/tile/tile";
import { usePlayerData } from "@/hooks/usePlayerData";

import DeltaIndicator from "./deltaIndicator";

export default function AverageDamagesStats() {
	const {
		user: { stats },
		loading,
	} = usePlayerData();

	const [dmg, setDmg] = useState(0);
	const [rounds, setRounds] = useState(0);

	useEffect(() => {
		if (loading || stats === false) return;

		setDmg(stats.totals.overall.dmg ?? 0);
		setRounds(stats.totals.overall.rounds ?? 0);
	}, [loading, stats]);

	const adr = useMemo(() => (dmg / (rounds || 1)).toFixed(0), [dmg, rounds]);

	return (
		<Tile
			isLoading={loading}
			width={266}
			height={111}
			content={
				<div className="flex flex-col w-full justify-between gap-[10px]">
					<div className="flex flex-row flex-nowrap justify-between gap-[10px]">
						<span className="text-[13px] leading-[13px] h-[13px] text-white font-bold">ADR</span>
						<div className="flex flex-col gap-0 items-end">
							<div className="flex flex-row items-end gap-[10px]">
								<DeltaIndicator deltaKey="adr" className="text-[#aaaaaa]" style={{ marginBottom: "5px" }} showZero={false} />
								<span className="text-[30px] text-white font-bold">{adr}</span>
								<img height={35} width={35} src="https://static.csstats.gg/images/damage-icon.png" alt="adr-icon" />
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-0">
						<div className="flex flex-row justify-between border-b border-white/20 py-1 gap-[10px]">
							<span className="text-[13px] leading-[13px] h-[13px] text-white/75 font-normal">DAMAGES</span>
							<span className="text-[13px] leading-[13px] h-[13px] text-white/75 font-normal">{dmg}</span>
						</div>
						<div className="flex flex-row justify-between border-b border-white/20 py-1 gap-[10px]">
							<span className="text-[13px] leading-[13px] h-[13px] text-white/75 font-normal">ROUNDS</span>
							<span className="text-[13px] leading-[13px] h-[13px] text-white/75 font-normal">{rounds}</span>
						</div>
					</div>
				</div>
			}
		/>
	);
}
