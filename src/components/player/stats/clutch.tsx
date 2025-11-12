import Tile from "@/components/tile/tile";
import { Chart } from 'react-chartjs-2';
import { options } from "@/utils/chart";

import 'chart.js/auto';

export default function ClutchStats() {
	const { user: { stats }, loading } = usePlayerData();
	const versus = ['1v1', '1v2', '1v3', '1v4', '1v5'] as const;

	const clutchChart = (percentage: number, is1vX: boolean) => {
		return (
			<Chart
				type="pie"
				style={{ position: 'absolute' }}
				height={is1vX ? 100 : 75}
				width={is1vX ? 100 : 75}
				options={{
					...options,
					cutout: '80%',
				}}
				data={{
					datasets: [{
						data: [percentage, 100 - percentage],
						borderWidth: 0,
						animation: false,
						weight: 1,
						backgroundColor: ['#3A74FA', '#4B505E'],
					}]
				}}
			/>
		)
	}

	return (
		<Tile 
			width={273*2 + 10}
			height={153.5}
			content={(
				<div className="col nogap full-width">
					<div className="row nowrap space-between">
						<span className="text">
							CLUTCH SUCCESS
						</span>
					</div>
					<div className="row nogap space-between full-width full-height">
						<div className="row full-width space-evenly" style={{ maxWidth: 'calc(100% - 120px - 10px)' }}>
							{versus.map((type) => (
								<div
									key={type} 
									className="col center-y center-x full-height relative"
									style={{ width: '80px' }}
								>
									{clutchChart(!loading && stats ? stats.overall[type] : 0, false)}
									<span className="text-light absolute">
										{!loading && stats ? `${stats.overall[type]}%` : '-'}
									</span>
									<span className="text-light absolute" style={{ top: '20px' }}>
										{type}
									</span>
									<span className="text-small text-gray absolute" style={{ bottom: '20px' }}>
										W: {!loading && stats ? stats.totals.overall[type] : '-'} / 
										L: {!loading && stats ? stats.totals.overall[`${type}_lost`] : '-'}
									</span>
								</div>
							))}
						</div>
						<div 
							className="border-left col center-x center-y full-height relative"
							style={{ width: '120px' }}
						>
							{clutchChart(!loading && stats ? stats.overall['1vX'] : 0, true)}
							<span 
								className="text-light absolute"
								style={{
									fontSize: '18px',
								}}
							>
								{!loading && stats ? `${stats.overall['1vX']}%` : '-'}
							</span>
							<span className="text-light absolute" style={{ top: '0px' }}>
								Average
							</span>
							<span className="text-small text-gray absolute" style={{ bottom: '0px' }}>
								W: {!loading && stats ? versus.reduce((acc, type) => acc + stats.totals.overall[type], 0) : '-'} / 
								L: {!loading && stats ? versus.reduce((acc, type) => acc + stats.totals.overall[`${type}_lost`], 0) : '-'}
							</span>
						</div>
					</div>
				</div>
			)} 
		/>
	);
}