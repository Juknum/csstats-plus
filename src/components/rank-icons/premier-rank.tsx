import { getRankPicture, slicePremierRank } from "@/utils/ranks";

export function PremierRankIcon({ rankNumber }: { rankNumber: number }) {
	const [thousand, hundred, color] = slicePremierRank(rankNumber);

	return (
		<div
			className={`cs2rating ${color}`}
			style={{ backgroundImage: `url(${getRankPicture(rankNumber, 'Premier')})` }}
		>
			<span className="cs2rating-big">
				{thousand === 0 ? '---' : thousand}
				<small>{thousand === 0 ? '' : `,${hundred}`}</small>
			</span>
		</div>
	)
}