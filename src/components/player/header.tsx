import { usePlayerData } from '@/hooks/usePlayerData';
import Tile from '../tile/tile';
import { RankInfo } from '@/utils/types';
import { getRankPicture } from '@/utils/ranks';
import { getMapIcon } from '@/utils/maps';
import '../common.css';
import './header.css';

export default function PlayerHeader() {
	const { user, user: { ranks }, loading } = usePlayerData();

	const premierRanks = useMemo(() => {
		if (!ranks) return [];
		
		return ranks
			.filter((r) => r.gamemode.type === 'Premier')
			.sort((a, b) => (b.gamemode.season ?? 0) - (a.gamemode.season ?? 0));

	}, [ranks]);

	const [currSeason, setCurrentSeason] = useState<number>(0);
	const maxSeason = useMemo(() => premierRanks[0].gamemode.season ?? 0, [premierRanks]);
	const currPremierRank = useMemo(() => premierRanks.find((r) => r.gamemode.season === currSeason), [currSeason]);

	useEffect(() => {
		if (premierRanks.length === 0) return;
		setCurrentSeason(premierRanks[0].gamemode.season ?? 0);
	}, [premierRanks]);

	const handleSeasonSwitch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, newIndex: -1 | 1) => {
		e.preventDefault();

		const findNextAvailableSeason = (startSeason: number, direction: -1 | 1): number | null => {
			let nextSeason = startSeason + direction;
			const seasons = premierRanks.map(r => r.gamemode.season ?? 0);
			const minSeason = Math.min(...seasons);
			const maxSeason = Math.max(...seasons);

			while (nextSeason >= minSeason && nextSeason <= maxSeason) {
				if (seasons.includes(nextSeason)) {
					return nextSeason;
				}
				nextSeason += direction;
			}
			return null;
		};

		setCurrentSeason(prev => {
			const nextSeason = findNextAvailableSeason(prev, newIndex);
			return nextSeason !== null ? nextSeason : prev;
		});
	}

	const isLastPremierSeason = useMemo(() => {
		if (!currPremierRank) return true;
		
		const seasons = premierRanks.map(r => r.gamemode.season ?? 0);
		const maxSeason = Math.max(...seasons);

		return currPremierRank.gamemode.season === maxSeason;
	}, [currPremierRank, premierRanks]);

	const isFirstPremierSeason = useMemo(() => {
		if (!currPremierRank) return true;

		const seasons = premierRanks.map(r => r.gamemode.season ?? 0);
		const minSeason = Math.min(...seasons);

		return currPremierRank.gamemode.season === minSeason;
	}, [currPremierRank, premierRanks]);

	const wingmanRank = useMemo(() => {
		if (!ranks) return null;
		return ranks.filter((r) => r.gamemode.type === 'Wingman')[0];
	}, [ranks]);

	const faceitRank = useMemo(() => {
		if (!ranks) return null;
		return ranks.filter((r) => r.gamemode.type === 'FACEIT')[0];
	}, [ranks]);

	const csgoRank = useMemo(() => {
		if (!ranks) return null;
		return ranks.filter((r) => r.gamemode.type === 'Competitive' && r.game === 'CS:GO')[0];
	}, [ranks]);

	const competitiveRanks = useMemo(() => {
		if (!ranks) return [];
		return ranks.filter((r) => r.gamemode.type === 'Competitive' && r.game === 'CS2');
	}, [ranks]);

	const setUrl = (params: [string, string][], csgo: boolean = false) => {
		// /csgo?platforms=Valve&date=7d&maps=de_mirage&modes=ESEA&groups=ESEA%20S47&vs=5v5
		// ?platforms=Valve&date=7d&maps=de_mirage&modes=ESEA&groups=ESEA%20S47&vs=5v5

		const url = new URL(window.location.href);
		if (url.pathname.includes('/csgo')) url.pathname = url.pathname.replace(/\/csgo/, '');

		url.searchParams.keys().forEach((key) => url.searchParams.delete(key));
		url.searchParams.keys().forEach((key) => url.searchParams.delete(key));
		params.forEach(([key, val]) => url.searchParams.append(key, val));

		if (csgo) url.pathname += '/csgo';

		window.history.pushState({}, '', url.toString());
		window.location.reload();
	}

	const rankedTile = (rank: RankInfo, clickParams: [string, string][]) => {
		const types: ('current' | 'best')[] = ['current', 'best'];

		if (rank.rank.best === 0) types.pop();

		return (
			<Tile
				height={63}
				width={290}
				className="rank-tile-hoverable"
				onClick={() => setUrl(clickParams, rank.game ===  'CS:GO')}
				content={
					<div className="row space-between full-width">
						<div className="col nogap align-left">
							<div className="text">
								{rank.game === 'CS:GO' ? 'CS:GO' : rank.gamemode.type.toUpperCase()}&nbsp;
								{rank.gamemode.season !== null ? `- S${rank.gamemode.season}` : ''}
							</div>
							<div className="text-small text-gray">{rank.date.toUpperCase()}</div>
							{!Number.isNaN(rank.wins) && <div className="text-small text-gray">{rank.wins} WINS</div>}
						</div>

						<div className="row space-between">
							{types.map((type) => {

								if (rank.gamemode.type === 'Premier') {
									const [thousand, hundred, color] = slicePremierRank(rank.rank[type]);
									
									return (
										<div key={type} className="col" style={{ '--gap': '4px' }}>
											<div
												className={`cs2rating ${color}`}
												style={{ backgroundImage: `url(${getRankPicture(rank.rank[type], rank.gamemode.type)})` }}
											>
												<span className="cs2rating-big">
													{thousand === 0 ? '---' : thousand}
													<small>{thousand === 0 ? '' : `,${hundred}`}</small>
												</span>
											</div>
											<span
												className="text-small text-gray text-center"
												style={{ width: '70px' }}
											>
												{type === 'current' && rank.gamemode.season !== maxSeason ? 'LAST' : type.toUpperCase()}
											</span>
										</div>
									)
								}

								return (
									<div key={type} className="col" style={{ '--gap': '4px' }}>
										<img
											height={25}
											src={getRankPicture(rank.rank[type], rank.gamemode.type)}
										/>
										<span
											className="text-small text-gray text-center"
											style={{ width: '70px' }}
										>
											{type === 'current' && rank.game === 'CS:GO' ? 'LAST' : type.toUpperCase()}
										</span>
									</div>
								)
							})}
						</div>
					</div>
				}
			/>
		)
	}

	const [showCommunityMaps, setShowCommunityMaps] = useState(false);
	const canShowCommunityMaps = useMemo(() => competitiveRanks.some((cr) => !CS2_MAPS.includes(cr.map as any)), [competitiveRanks]) 

	return (
		<div className="row center-x header-container">
			<div className="row header-contained" style={{ '--gap': '20px' }}>
				<div className="col">
					<img 
						className="player-avatar"
						width="120"
						height="120"
						src={user.img ?? ''}
						alt="avatar"
					/>
					<span className="username">{user.name}</span>
					<div className="row center-x center-y full-width">
						{user.profiles?.discordBooster && (
							<img src={user.profiles?.discordBooster} width="18" height="14" data-toggle="tooltip" data-original-title="Discord Server Booster" />
						)}
						{user.profiles?.steam && (
							<a href={user.profiles.steam} target="_blank" rel="noopener noreferrer">
								<img src="https://steamcommunity.com/favicon.ico" width="18" height="18" />
							</a>
						)}
						{user.profiles?.faceit && (
							<a href={user.profiles.faceit} target="_blank" rel="noopener noreferrer">
								<img src="https://static.csstats.gg/images/faceit-pheasant.png" width="18" height="18" />
							</a>
						)}
					</div>
				</div>

				<div className="row full-width header-ranks wrap" style={{ '--gap': '20px' }}>
					<div className="col center-y">
						{faceitRank && (
							<Tile 
								className="center-x center-y rank-faceit-hoverable" 
								onClick={() => setUrl([['platforms', 'FACEIT']])}
								height={63} width={63} 
								content={
								<img width="40" height="40" src={getRankPicture(faceitRank.rank['current'], faceitRank.gamemode.type)}/>
							}/>
						)}
						<img width="58" src="https://static.csstats.gg/images/faceit.png" />
					</div>

					<div className="col align-right">
						{currPremierRank && (
							<div className="row relative">
								<Tile
									height={63}
									width={30}
									content={<>
										<button
											onClick={(e) => handleSeasonSwitch(e, 1)}
											className={`premier-season-btn clickable text-small ${isLastPremierSeason ? 'btn-off' : 'btn-on'}`}
											style={{ top: '0px', right: '0px' }}
										>
											▲
										</button>
										<button
											onClick={(e) => handleSeasonSwitch(e, -1)}
											className={`premier-season-btn clickable text-small ${isFirstPremierSeason ? 'btn-off' : 'btn-on'}`}
											style={{ bottom: '0px', right: '0px' }}
										>
											▼
										</button>
									</>}
								/>
								{ rankedTile(currPremierRank, [['modes', currPremierRank.gamemode.season === 1 ? 'Premier' : `Premier - Season ${currPremierRank.gamemode.season}`]]) }
							</div>
						)}

						{csgoRank && (
							<div className="row">
								{currPremierRank && (
									<Tile height={63} width={30} content={null} />
								)}
								{ rankedTile(csgoRank, [['platforms', 'Valve']]) }
							</div>
						)}
						{wingmanRank && (
							<div className="row">
								{currPremierRank && (
									<Tile height={63} width={30} content={null}/>
								)}
								{ rankedTile(wingmanRank, [['vs', '2v2']]) }
							</div>
						)}
						
					</div>

					<div className="col full-width full-height header-competitive-ranks">
						{competitiveRanks && (
							<Tile
								height={209}
								className="col full-width"
								content={(
									<div className="col nogap">
										<div className="row nowrap space-between">
											<span className="text">
												COMPETITIVE
											</span>
											<div className="col nogap align-right">
												<span className="text-small">{competitiveRanks.reduce((prev, curr) => prev + curr.wins, 0)} WINS TOTAL</span>

												{canShowCommunityMaps && (
													<div className="row nowrap" style={{ '--gap': '5px' }}>
														<label className="text-small clickable" htmlFor="checkbox">Show Community Maps</label>
														<input 
															id="checkbox" 
															type="checkbox" 
															className="clickable" 
															defaultChecked={showCommunityMaps} 
															onClick={() => setShowCommunityMaps(!showCommunityMaps)} 
														/>
													</div>
												)}
												{!canShowCommunityMaps && (
													<span className="text-small text-italic">No Community Maps played</span>
												)}
											</div>
										</div>
										<div className="row nowrap" style={{ '--gap': '7px' }}>
											<div className="col" style={{ '--gap': '5px', height: '180px' }}>
												<span style={{ height: '40px' }} />
												<span className="text-small text-competitive text-gray">WINS</span>
												<span className="text-small text-competitive text-gray">PLAYED</span>
												<span className="text-small text-competitive text-gray">LATEST</span>
												<span className="text-small text-competitive text-gray">BEST</span>
											</div>
											<div className="row nowrap tile-scrollable" style={{ '--gap': '2.5px' }}>
												{competitiveRanks
													.filter((cr) => !showCommunityMaps ? CS2_MAPS.includes(cr.map as any) : !CS2_MAPS.includes(cr.map as any))
													.map((cr) => (
														<div 
															key={cr.map} 
															className="col center-y rank-competitive-hoverable clickable" 
															style={{ '--gap': '5px' }}
															onClick={() => setUrl([['maps', cr.map!], ['modes', 'Competitive']])}
														>
															<img height="40" src={getMapIcon(cr.map!)} />
															<span className="text-center text-small text-competitive text-gray">{cr.wins}</span>
															<span className="text-center text-small text-competitive text-gray">
																{cr.date.replace(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) /, '').toUpperCase()}
															</span>
															<img width="55" src={getRankPicture(cr.rank.current, cr.gamemode.type)} />
															{cr.rank.best !== 0 && (<img width="55" src={getRankPicture(cr.rank.best, cr.gamemode.type)} />)}
														</div>
													)
												)}
											</div>
										</div>
									</div>
								)}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}