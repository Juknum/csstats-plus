import Tile from "@/components/tile/tile";
import { Chart } from 'react-chartjs-2';
import { options } from "@/utils/chart";

import 'chart.js/auto';
import DeltaIndicator from "./deltaIndicator";

export default function KDStats() {
	const { user: { stats } } = usePlayerData();

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

	return (
		<Tile 
			width={273}
			height={273}
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
						<DeltaIndicator deltaKey="kpd" />
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