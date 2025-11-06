import Tile from "@/components/tile/tile";
import { Chart } from 'react-chartjs-2';
import { options } from "@/utils/chart";

import 'chart.js/auto';
import './grid.css';

export default function HLTVStats() {
	const { user: { stats }, loading } = usePlayerData();

	const [HLTVDelta, setHLTVDelta] = useState(0);
	const [HLTVDeltaStatus, setHLTVDeltaStatus] = useState<'up' | 'same' | 'down'>('same');
	
	const { baseRating, rating1, rating2, isMaxed, isOverMaxed } = useMemo(() => {
		const offset = 0.4;
		const maxHLTVRating = 1.8;
		const baseRating = stats?.overall?.rating ?? 0;

		let rating1 = baseRating - offset;
		if (rating1 > maxHLTVRating) rating1 = maxHLTVRating;

		rating1 = (rating1 / (maxHLTVRating / 2)) * 100; // normalize
		let rating2 = 100 - rating1;

		let isMaxed = false;
		if (baseRating > ((maxHLTVRating / 2) + offset)) {
			isMaxed = true;
			rating1 = rating1 - 100;
			rating2 = 100 - rating1;
		}

		const isOverMaxed = baseRating > maxHLTVRating;

		return {
			baseRating,
			rating1,
			rating2,
			isMaxed,
			isOverMaxed
		};
	}, [stats?.overall?.rating]);

	useEffect(() => {
		if (loading) return;

		const topContainer = document.getElementById('rating-delta');
		const container    = topContainer && topContainer.querySelector('span');
		const element      = container    && container.querySelector('span');

		if (!element) return;

		const className = element.className
			.split(' ')
			.filter((el) => el.startsWith('stat-'))[0] as `stat-${string}`;

		switch (className) {
			case 'stat-up':
				setHLTVDeltaStatus('up');
				break;
			case 'stat-same':
				setHLTVDeltaStatus('same');
				setHLTVDelta(0);
				break;
			case 'stat-down':
				setHLTVDeltaStatus('down');
				break;
		}

		if (className !== 'stat-same') {
			setHLTVDelta(Math.abs(parseFloat(element.getAttribute('data-delta') || '0')));
		}

	}, [loading]);

	return (
		<Tile 
			width={266}
			height={266}
			content={(
				<div className="col nogap">
					<div className="row nowrap space-between">
						<span className="text">
							HLTV RATING
						</span>
					</div>
					<div className="text-over-chart col center-y center-x">
						{baseRating}
						<div className="row text">
							{HLTVDeltaStatus === 'up'   && (<span>▲</span>)}
							{HLTVDeltaStatus === 'same' && (<span>No variation</span>)}
							{HLTVDeltaStatus === 'down' && (<span>▼</span>)}
							{HLTVDelta !== 0 && (<span>{HLTVDelta}</span>)}
						</div>
					</div>
					<Chart
						type="doughnut"
						data={{
							datasets: [{
								data: [rating1, rating2],
								borderWidth: 0,
								animation: false,
								weight: 1,
								backgroundColor:
									isOverMaxed ? [
										'rgb(250, 173, 58)',
									]
									: 
									isMaxed ? [
										'rgb(125, 205, 78)',
										'rgba(125, 205, 78, .2)',
									]
									:
									[
										'rgb(125, 205, 78)',
										'rgba(202, 81,  81, .2)',
									],
							}]
						}}
						options={{
							...options,
							cutout: '95%'
						}}
					/>
				</div>
			)} 
		/>
	);
}