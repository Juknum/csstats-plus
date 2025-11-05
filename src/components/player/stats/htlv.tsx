import Tile from "@/components/tile/tile";
import { Chart } from 'react-chartjs-2';
import { options } from "@/utils/chart";

import 'chart.js/auto';
import './grid.css';

export default function HLTVStats() {
	const { user: { stats } } = usePlayerData();

	const offset = 0.4;
	const maxRating = 1.8;

	const baseRating = stats?.overall?.rating ?? 0;

	let rating1 = baseRating - offset;
	if (rating1 > maxRating) rating1 = maxRating;

	rating1 = (rating1 / (maxRating / 2)) * 100; // normalize
	let rating2 = 100 - rating1;

	let isMaxed = false;
	if (baseRating > ((maxRating / 2) + offset)) {
		isMaxed = true;
		rating1 = rating1 - 100;
		rating2 = 100 - rating1;
	}

	let isOverMaxed = false;
	if (baseRating > maxRating) {
		isOverMaxed = true;
	}

	// TODO: re-add the up/down arrow indicators for rating changes

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
					<div className="text-over-chart">
						{baseRating}
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