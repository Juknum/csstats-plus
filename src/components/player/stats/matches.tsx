import Tile from "@/components/tile/tile";

export default function MatchesStats() {
	const { user: { stats }, loading } = usePlayerData();
	const [past10Matches, setPast10Matches] = useState<(Stats['past10'][number] & { id: number })[]>([]);

	useEffect(() => {
		if (loading || !stats) return;
		
		const last10MatchesIds = stats.matches.slice(-10);
		const past10Matches    = stats.past10.map((match, index) => ({ ...match, id: last10MatchesIds[index] }));
		setPast10Matches(past10Matches);

	}, [stats, loading]);

	const openMatchDetails = (matchId: number) => {
		window.open(`/match/${matchId}`, '_blank');
	};

	return (
		<Tile 
			width={542}
			height={153.5}
			content={(
				<div className="col full-width">
					<div className="row nowrap space-between">
						<span className="text">
							MATCHES
						</span>
					</div>
					<div className="row nogap full-width full-height">
						{past10Matches.map((match, index) => (
							<div 
								key={match.id} 
								className="col space-evenly nowrap full-height full-width center-x center-y match-hoverable"
								onClick={() => openMatchDetails(match.id)}
							>
								<img src={getMapIcon(match.map)} alt={match.map} height={35} width={35} />
								<div className="row nogap relative full-width center-x center-y">
									<span className="absolute" style={{
											backgroundColor: '#4B505E',
											zIndex: -1,
											height: '2px',
											left: 0,
											width: past10Matches.length !== (index + 1) ? '100%' : '50%'
										}}
									/>
									<span style={{ 
											backgroundColor: (match.result === 'lose' ? '#C72D2E' : (match.result === 'win' ? '#97E668' : '#3A74FA')), 
											borderRadius: '12px', 
											width: '12px', 
											height: '12px' 
										}}
									/>
								</div>
								<span className="text-light">{match.score}</span>
							</div>
						))}
					</div>
				</div>
			)} 
		/>
	);
}