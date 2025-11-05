import Tile from "@/components/tile/tile";
import { Chart } from 'react-chartjs-2';
import { options } from "@/utils/chart";

import 'chart.js/auto';
import './grid.css';

export default function KDStats() {
	const { user: { stats } } = usePlayerData();

	const maxKpd = 3.0;
	const baseKpd = stats?.overall?.kpd ?? 0;

	let kpd1 = baseKpd;
	if (kpd1 > maxKpd) kpd1 = maxKpd;

	kpd1 = (kpd1 / (maxKpd / 2)) * 100; // normalize

	let kpd2 = 100 - kpd1;
	if (kpd2 < 0) kpd2 = 0;

	let isMaxed = false;
	if (baseKpd > (maxKpd / 2)) {
		isMaxed = true;
		kpd1 = kpd1 - 100;
		kpd2 = 100 - kpd1;
	}

	let isOverMaxed = false;
	if (baseKpd > maxKpd) {
		isOverMaxed = true;
	}

	// TODO: re-add the up/down arrow indicators for kd changes

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
					<div className="text-over-chart">
						{baseKpd}
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