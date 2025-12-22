import MatchesStats from "./matches";

import { usePlayerData } from "@/hooks/usePlayerData";
import Tile from "@/components/tile/tile";

import MostPlayedStats from "./played";
import MostSuccessStats from "./success";
import KDStats from "./kd";
import HLTVStats from "./htlv";
import ClutchStats from "./clutch";
import MostKillsStats from "./kills";
import HeadShotsStats from "./headShots";
import WinRateStats from "./winRate";
import AverageDamagesStats from "./adr";
import EntriesStats from "./entries";

import "@/components/common.css";

export default function StatsGrid() {
	const { user: { stats }, loading } = usePlayerData();

	return (
		<div className="col grid-container">
			<div className="row wrap full-width">
				{(stats || loading) && (
					<>
						<div className="col">
							<div className="row full-width">
								<KDStats />
								<HLTVStats />
							</div>
							<ClutchStats />
						</div>

						<div className="col">
							<MatchesStats />
							<EntriesStats />
						</div>

						<div className="col">
							<WinRateStats />
							<HeadShotsStats />
							<AverageDamagesStats />
						</div>

						<div className="col">
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
							<div 
								style={{ lineHeight: 2, height: 40, width: "100%" }} 
								className="text text-medium text-center"
							>
								No statistics available for this player.
							</div>
						}
					/>
				)}
			</div>
		</div>
	)
}