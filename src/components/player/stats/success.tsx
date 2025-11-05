import Tile from "@/components/tile/tile";

export default function MostSuccessStats() {
	return (
		<Tile 
			width={266}
			height={128}
			content={(
				<div className="col nogap">
					<div className="row nowrap space-between">
						<span className="text">
							MOST SUCCESS
						</span>
					</div>
				</div>
			)} 
		/>
	);
}