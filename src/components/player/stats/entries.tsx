import Tile from "@/components/tile/tile";

export default function EntriesStats() {
	return (
		<Tile 
			width={542}
			height={273}
			content={(
				<div className="col nogap">
					<div className="row nowrap space-between">
						<span className="text">
							ENTRIES SUCCESS
						</span>
					</div>
				</div>
			)} 
		/>
	);
}