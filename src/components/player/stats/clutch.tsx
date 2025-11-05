import Tile from "@/components/tile/tile";

export default function ClutchStats() {
	return (
		<Tile 
			width={542}
			height={128}
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