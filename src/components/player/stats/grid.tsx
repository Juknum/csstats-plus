import Tile from "@/components/tile/tile";
import { usePlayerData } from "@/hooks/usePlayerData";
import AverageDamagesStats from "./adr";
import ClutchStats from "./clutch";
import EntriesStats from "./entries";
import HeadShotsStats from "./headShots";
import HLTVStats from "./htlv";
import KDStats from "./kd";
import MostKillsStats from "./kills";
import MatchesStats from "./matches";
import MostPlayedStats from "./played";
import MostSuccessStats from "./success";
import WinRateStats from "./winRate";

import "@/components/common.css";

export default function StatsGrid() {
	const {
		user: { stats },
		isLoginRequired,
		loading,
	} = usePlayerData();

	if (isLoginRequired) return null;

	return (
		<div className="flex flex-col max-w-[1680px] my-[10px] mx-auto gap-[10px] px-2 sm:px-4 w-full box-border">
			<div className="flex flex-row flex-wrap w-full justify-center xl:justify-start gap-[10px]">
				{(stats || loading) && (
					<>
						{/* Column 1: K/D & HLTV Rating (Top), Clutch success (Bottom) */}
						<div className="flex flex-col gap-[10px] w-full sm:w-auto max-w-full items-center sm:items-start shrink-0">
							<div className="flex flex-row flex-nowrap justify-between w-full gap-[10px]">
								<KDStats />
								<HLTVStats />
							</div>
							<ClutchStats />
						</div>

						{/* Column 2: Matches (Top), Entries Success (Bottom) */}
						<div className="flex flex-col gap-[10px] w-full sm:w-auto max-w-full items-center sm:items-start shrink-0">
							<MatchesStats />
							<EntriesStats />
						</div>

						{/* Column 3: Win rate (Row 1), HS% (Row 2), ADR (Row 3) */}
						<div className="flex flex-col gap-[10px] w-full sm:w-auto max-w-full items-center sm:items-start shrink-0">
							<WinRateStats />
							<HeadShotsStats />
							<AverageDamagesStats />
						</div>

						{/* Column 4: Most played (Row 1), Most success (Row 2), Most kills (Row 3) */}
						<div className="flex flex-col gap-[10px] w-full sm:w-auto max-w-full items-center sm:items-start shrink-0">
							<MostPlayedStats />
							<MostSuccessStats />
							<MostKillsStats />
						</div>
					</>
				)}

				{!loading && !stats && (
					<Tile
						width={800}
						content={
							<div style={{ lineHeight: 2, height: 40, width: "100%" }} className="text-[20px] text-white text-center font-bold">
								No statistics available for this player.
							</div>
						}
					/>
				)}
			</div>
		</div>
	);
}
