import { getRankName, getRankPicture } from "@/utils/ranks";

export default function FaceitRankIcon({ rankNumber }: { rankNumber: number }) {
	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
			<img 
				height="22.34" 
				src={getRankPicture(rankNumber, 'FACEIT')} 
				title={getRankName(rankNumber, 'FACEIT')}
			/>
		</div>
	)
}