import { useEffect, useMemo, useState } from "react";
import Tile from "@/components/tile/tile";
import { usePlayerData } from "@/hooks/usePlayerData";
import DeltaIndicator from "./deltaIndicator";

export default function HeadShotsStats() {
	const {
		user: { stats },
		loading,
	} = usePlayerData();

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
	}, [loading, stats]);

	const headShotsRate = useMemo(() => ((headShots / (kills || 1)) * 100).toFixed(0), [headShots, kills]);

	return (
		<Tile
			isLoading={loading}
			width={266}
			height={155}
			content={
				<div className="flex flex-col w-full justify-between gap-[10px]">
					<div className="flex flex-row flex-nowrap justify-between gap-[10px]">
						<span className="text-[13px] leading-[13px] h-[13px] text-white font-bold">HS%</span>
						<div className="flex flex-col gap-0 items-end">
							<div className="flex flex-row items-end gap-[10px]">
								<DeltaIndicator deltaKey="adr" className="text-[#aaaaaa]" style={{ marginBottom: "5px" }} showZero={false} />
								<span className="text-[30px] text-white font-bold">{headShotsRate}%</span>
								<img height={35} width={35} src="https://static.csstats.gg/images/headshot-icon.png" alt="hs-icon" />
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-0">
						<div className="flex flex-row justify-between border-b border-white/20 py-1 gap-[10px]">
							<span className="text-[13px] leading-[13px] h-[13px] text-white/75 font-normal">KILLS</span>
							<span className="text-[13px] leading-[13px] h-[13px] text-white/75 font-normal">{kills}</span>
						</div>
						<div className="flex flex-row justify-between border-b border-white/20 py-1 gap-[10px]">
							<span className="text-[13px] leading-[13px] h-[13px] text-white/75 font-normal">DEATHS</span>
							<span className="text-[13px] leading-[13px] h-[13px] text-white/75 font-normal">{deaths}</span>
						</div>
						<div className="flex flex-row justify-between border-b border-white/20 py-1 gap-[10px]">
							<span className="text-[13px] leading-[13px] h-[13px] text-white/75 font-normal">ASSISTS</span>
							<span className="text-[13px] leading-[13px] h-[13px] text-white/75 font-normal">{assists}</span>
						</div>
						<div className="flex flex-row justify-between border-b border-white/20 py-1 gap-[10px]">
							<span className="text-[13px] leading-[13px] h-[13px] text-white/75 font-normal">HEADSHOTS</span>
							<span className="text-[13px] leading-[13px] h-[13px] text-white/75 font-normal">{headShots}</span>
						</div>
					</div>
				</div>
			}
		/>
	);
}
