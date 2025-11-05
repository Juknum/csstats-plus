import Tile from "@/components/tile/tile";

export default function WinRateStats() {
	return (
		<Tile 
			width={266}
			height={128}
			content={(
				<div className="col nogap">
					<div className="row nowrap space-between">
						<span className="text">
							WIN RATE
						</span>
					</div>
				</div>
			)} 
		/>
	);
}