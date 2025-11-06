import Tile from "@/components/tile/tile";
import { Chart } from 'react-chartjs-2';
import { options } from "@/utils/chart";

import 'chart.js/auto';
import './grid.css';

export default function KDStats() {
	const { user: { stats }, loading } = usePlayerData();

	const [kpdDelta, setKpdDelta] = useState(0);
	const [kpdDeltaStatus, setKpdDeltaStatus] = useState<'up' | 'same' | 'down'>('same');
	
	const { baseKpd, kpd1, kpd2, isMaxed, isOverMaxed } = useMemo(() => {
		const maxKpd = 3.0;
		const baseKpd = stats?.overall?.kpd ?? 0;

		const isOverMaxed = baseKpd > maxKpd;
		const isMaxed = baseKpd > (maxKpd / 2);

		let kpd1 = 0;
		let kpd2 = 0;

		if (isOverMaxed) {
			kpd1 = 100;
			kpd2 = 0;
		} else if (isMaxed) {
			kpd1 = ((baseKpd - (maxKpd / 2)) / (maxKpd / 2)) * 100;
			kpd2 = 100 - kpd1;
		} else {
			kpd1 = (baseKpd / (maxKpd / 2)) * 100;
			kpd2 = 100 - kpd1;
		}

		return { baseKpd, kpd1, kpd2, isMaxed, isOverMaxed };
	}, [stats?.overall?.kpd]);

	useEffect(() => {
		if (loading) return;

		const topContainer = document.getElementById('kpd-delta');
		const container    = topContainer && topContainer.querySelector('span');
		const element      = container    && container.querySelector('span');

		if (!element) return;

		const className = element.className
			.split(' ')
			.filter((el) => el.startsWith('stat-'))[0] as `stat-${string}`;

		switch (className) {
			case 'stat-up':
				setKpdDeltaStatus('up');
				break;
			case 'stat-same':
				setKpdDeltaStatus('same');
				setKpdDelta(0);
				break;
			case 'stat-down':
				setKpdDeltaStatus('down');
				break;
		}

		if (className !== 'stat-same') {
			setKpdDelta(Math.abs(parseFloat(element.getAttribute('data-delta') || '0')));
		}

	}, [loading]);

	return (
		<Tile 
			width={266}
			height={266}
			className="relative"
			content={(
				<div className="col nogap">
					<div className="row nowrap space-between">
						<span className="text">
							K/D
						</span>
					</div>
					<div className="text-over-chart col center-y center-x">
						{baseKpd}
						<div className="row text">
							{kpdDeltaStatus === 'up'   && (<span>▲</span>)}
							{kpdDeltaStatus === 'same' && (<span>No variation</span>)}
							{kpdDeltaStatus === 'down' && (<span>▼</span>)}
							{kpdDelta !== 0 && (<span>{kpdDelta}</span>)}
						</div>
					</div>
					<Chart
						type="doughnut"
						data={{
							datasets: [{								
								data: [kpd1, kpd2],
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