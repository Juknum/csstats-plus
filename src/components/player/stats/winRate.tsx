import { useEffect, useMemo, useState } from "react";
import Tile from "@/components/tile/tile";
import { usePlayerData } from "@/hooks/usePlayerData";
import DeltaIndicator from "./deltaIndicator";

export default function WinRateStats() {
	const {
		user: { stats },
		loading,
	} = usePlayerData();

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
	}, [loading, stats]);

	const winRate = useMemo(() => ((won / (played || 1)) * 100).toFixed(0), [won, played]);

	return (
		<Tile
			isLoading={loading}
			width={266}
			height={155}
			content={
				<div className="flex flex-col w-full justify-between gap-[10px]">
					<div className="flex flex-row flex-nowrap justify-between gap-[10px]">
						<span className="text-[13px] leading-[13px] h-[13px] text-white font-bold">WIN RATE</span>
						<div className="flex flex-col gap-0 items-end">
							<div className="flex flex-row items-end gap-[10px]">
								<DeltaIndicator deltaKey="adr" className="text-[#aaaaaa]" style={{ marginBottom: "5px" }} showZero={false} />
								<span className="text-[30px] text-white font-bold">{winRate}%</span>
								<img height={35} width={35} src="https://static.csstats.gg/images/winrate-icon.png" alt="win-rate-icon" />
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-0">
						<div className="flex flex-row justify-between border-b border-white/20 py-1 gap-[10px]">
							<span className="text-[13px] leading-[13px] h-[13px] text-white/75 font-normal">PLAYED</span>
							<span className="text-[13px] leading-[13px] h-[13px] text-white/75 font-normal">{played}</span>
						</div>
						<div className="flex flex-row justify-between border-b border-white/20 py-1 gap-[10px]">
							<span className="text-[13px] leading-[13px] h-[13px] text-white/75 font-normal">WON</span>
							<span className="text-[13px] leading-[13px] h-[13px] text-white/75 font-normal">{won}</span>
						</div>
						<div className="flex flex-row justify-between border-b border-white/20 py-1 gap-[10px]">
							<span className="text-[13px] leading-[13px] h-[13px] text-white/75 font-normal">LOST</span>
							<span className="text-[13px] leading-[13px] h-[13px] text-white/75 font-normal">{lost}</span>
						</div>
						<div className="flex flex-row justify-between border-b border-white/20 py-1 gap-[10px]">
							<span className="text-[13px] leading-[13px] h-[13px] text-white/75 font-normal">DRAW</span>
							<span className="text-[13px] leading-[13px] h-[13px] text-white/75 font-normal">{draw}</span>
						</div>
					</div>
				</div>
			}
		/>
	);
}
