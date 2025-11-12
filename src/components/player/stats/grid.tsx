import MatchesStats from "./matches";

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

export default function StatsGrid() {
	return (
		<div className="col grid-container">
			<div className="row wrap full-width">
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
			</div>
		</div>
	)
}