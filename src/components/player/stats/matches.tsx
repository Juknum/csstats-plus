import Tile from "@/components/tile/tile";

export default function MatchesStats() {
	return (
		<Tile 
			width={542}
			height={153.5}
			content={(
				<div className="col nogap">
					<div className="row nowrap space-between">
						<span className="text">
							MATCHES
						</span>
					</div>
				</div>
			)} 
		/>
	);
}