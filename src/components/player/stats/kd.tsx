import Tile from "@/components/tile/tile";

export default function KDStats() {
	return (
		<Tile 
			width={266}
			height={266}
			content={(
				<div className="col nogap">
					<div className="row nowrap space-between">
						<span className="text">
							K/D
						</span>
					</div>
				</div>
			)} 
		/>
	);
}