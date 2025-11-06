import Tile from "@/components/tile/tile";

export default function ClutchStats() {
	return (
		<Tile 
			width={273*2 + 10}
			height={153.5}
			content={(
				<div className="col nogap">
					<div className="row nowrap space-between">
						<span className="text">
							CLUTCH SUCCESS
						</span>
					</div>
				</div>
			)} 
		/>
	);
}