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

		setCurrentSeason((prev) => 
			prev + newIndex <= 1 
			? 1 
			: prev + newIndex >= maxSeason 
				? maxSeason 
				: prev + newIndex
		);
	}

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

	const rankIcons = (rank: RankInfo) => {
		const types: ('current' | 'best')[] = ['current', 'best'];
		if (rank.rank.best === 0) types.pop();

		return (
			<div className="row nowrap full-width space-evenly">
				{types.map((type) => {
					const [thousand, hundred, color] = slicePremierRank(rank.rank[type]);
					
					return (
						<div key={type} className="col center-y">
							{rank.gamemode.type === 'Premier' && (
								<div 
									className={`cs2rating ${color}`}
									style={{ backgroundImage: `url(${getRankPicture(rank.rank[type], rank.gamemode.type)})` }}
								>
									<span className="cs2rating-big">
										{thousand === 0 ? '---' : thousand}
										<small>{thousand === 0 ? '' : `,${hundred}`}</small>
									</span>
								</div>
							)}
							{rank.gamemode.type !== 'Premier' && (
								<img 
									height={rank.gamemode.type === 'FACEIT' ? 40 : 30}
									src={getRankPicture(rank.rank[type], rank.gamemode.type)}
								/>
							)}
							<span className="text-small">
								{(type === 'current' && (rank.game === 'CS:GO' || ranks
										.filter((r) => r.gamemode.type === rank.gamemode.type)
										.sort((a, b) => (b.gamemode.season ?? 0) - (a.gamemode.season ?? 0))[0].gamemode.season !== rank.gamemode.season
									)
										? 'last'
										: type
									).toUpperCase()
								}
							</span>
						</div>
					);
				})}
			</div>
		)
	};

	const ranksTitle = (rank: RankInfo) => {
		return (
			<div className="row nowrap space-between">
				<span className="text">
					{rank.game === 'CS:GO' ? 'CS:GO' : rank.gamemode.type.toUpperCase()}&nbsp;
					{rank.gamemode.season !== null ? `- S${rank.gamemode.season}` : ''}
				</span>
				<div className="col nogap align-right">
					<span className="text-small">{rank.date.toUpperCase()}</span>
					{!Number.isNaN(rank.wins) && (<span className="text-small">{rank.wins} WINS</span>)}
				</div>
			</div>
		)
	};

	const [showCommunityMaps, setShowCommunityMaps] = useState(false);
	const canShowCommunityMaps = useMemo(() => competitiveRanks.some((cr) => !CS2_MAPS.includes(cr.map as any)), [competitiveRanks]) 

	return (
		<div className="row center-x header-container">
			<div className="row header-contained">
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

				<div className="row full-width align-left header-ranks">
					<div className="col wrap" style={{ maxHeight: 'calc(120px * 2 + 10px)' }}>
						{currPremierRank && (
							<Tile
								title={ranksTitle(currPremierRank)}
								content={(
									<>
										{currSeason - 1 >= 1 && (
											<button 
												onClick={(e) => handleSeasonSwitch(e, -1)}
												className="premier-season-btn clickable"
												style={{ left: '10px', transform: 'rotate(90deg)' }}
											/>
										)}
										{rankIcons(currPremierRank)}
										{currSeason + 1 <= maxSeason && (
											<button 
												onClick={(e) => handleSeasonSwitch(e, 1)}
												className="premier-season-btn clickable"
												style={{ right: '10px', transform: 'rotate(-90deg)' }}
											/>
										)}
									</>
								)}
							/>
						)}
						{wingmanRank && (
							<Tile 
								title={ranksTitle(wingmanRank)}
								content={rankIcons(wingmanRank)}
							/>
						)}
						{faceitRank && (
							<Tile
								title={ranksTitle(faceitRank)}
								content={rankIcons(faceitRank)}
							/>
						)}
						{csgoRank && (
							<Tile
								title={ranksTitle(csgoRank)}
								content={rankIcons(csgoRank)}
							/>
						)}
					</div>

					<div className="col full-width full-height header-competitive-ranks">
						{competitiveRanks && (
							<Tile
								className="full-width full-height"
								title={(
									<div className="row nowrap space-between">
										<span className="text">
											COMPETITIVE&nbsp;
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
														checked={showCommunityMaps} 
														onClick={() => setShowCommunityMaps(!showCommunityMaps)} 
													/>
												</div>
											)}
											{!canShowCommunityMaps && (
												<span className="text-small text-italic">No Community Maps played</span>
											)}
										</div>
									</div>
								)}
								content={(
									<div className="row nowrap" style={{ '--gap': '7px' }}>
										<div className="col" style={{ '--gap': '5px', height: '180px' }}>
											<span style={{ height: '55px' }} />
											<span className="text-small text-competitive">WINS</span>
											<span className="text-small text-competitive">PLAYED</span>
											<span className="text-small text-competitive">LATEST</span>
											<span className="text-small text-competitive">BEST</span>
										</div>
										<div className="row nowrap tile-scrollable" style={{ '--gap': '2.5px' }}>
											{competitiveRanks
												.filter((cr) => !showCommunityMaps ? CS2_MAPS.includes(cr.map as any) : !CS2_MAPS.includes(cr.map as any))
												.map((cr) => (
													<div 
														key={cr.map} 
														className="col center-y hoverable clickable" 
														style={{ '--gap': '5px' }}
														onClick={() => window.alert('Not yet implemented')}
													>
														<img height="55" src={getMapIcon(cr.map!)} />
														<span className="text-center text-small text-competitive">{cr.wins}</span>
														<span className="text-center text-small text-competitive">{cr.date.replaceAll('Mon ', '').replaceAll('Tue ', '').replaceAll('Wed ', '').replaceAll('Thu ', '').replaceAll('Fri ', '').replaceAll('Sat ', '').replaceAll('Sun ', '')}</span>
														<img width="55" src={getRankPicture(cr.rank.current, cr.gamemode.type)} />
														{cr.rank.best !== 0 && (<img width="55" src={getRankPicture(cr.rank.best, cr.gamemode.type)} />)}
													</div>
												)
											)}
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