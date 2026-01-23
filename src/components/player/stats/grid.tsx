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
		loading,
	} = usePlayerData();

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
							<div style={{ lineHeight: 2, height: 40, width: "100%" }} className="text text-medium text-center">
								No statistics available for this player.
							</div>
						}
					/>
				)}
			</div>
		</div>
	);
}
