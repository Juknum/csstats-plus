import Tile from "@/components/tile/tile";
import { Chart } from "react-chartjs-2";
import { options } from "@/utils/chart";

import 'chart.js/auto';

export default function EntriesStats() {
	const { loading } = usePlayerData();

	const entryChart = (percentage: number, kind: Types | 'avg') => {
		return (
			<Chart
				type="pie"
				options={{
					...options,
					cutout: '80%'
				}}
				data={{
					datasets: [{
						data: [percentage, 100 - percentage],
						borderWidth: 0,
						animation: false,
						weight: 1,
						backgroundColor: [
							(kind === 'both' || kind === 'avg')
								? '#3A74FA' 
								: kind === 'T' 
									? '#FAAD3A' 
									: '#3AA9FA', 
							'#4B505E'
						],
					}]
				}}
			/>
		)
	}

	type Types = 'both' | 'T' | 'CT';
	const types: Record<Types, string> = {
		both: 'Combined',
		T: 'T Entries',
		CT: 'CT Entries',
	};

	type Kind = 'success' | 'attempts';
	const kind: Record<Kind, string> = {
		success: 'Entry Success',
		attempts: 'Entry Attempts',
	};

	const [values, setValues] = useState<Record<Kind, Record<Types, number>>>();
	const [avg, setAvg] = useState<number>(0);

	useEffect(() => {
		if (loading) return;

		setValues({
			success: {
				both: parseInt(document.getElementById('2-fk-both')?.dataset.chartValue ?? '0'),
				CT: parseInt(document.getElementById('2-fk-ct')?.dataset.chartValue ?? '0'),
				T: parseInt(document.getElementById('2-fk-t')?.dataset.chartValue ?? '0'),
			},
			attempts: {
				both: parseInt(document.getElementById('1-fk-both')?.dataset.chartValue ?? '0'),
				CT: parseInt(document.getElementById('1-fk-ct')?.dataset.chartValue ?? '0'),
				T: parseInt(document.getElementById('1-fk-t')?.dataset.chartValue ?? '0'),
			}
		})

		// OOF - navigating the DOM like this is gross but there's no other way to get this data currently ?
		// unless it can be determined from the stats object
		const spanElement = (document.getElementById('player-overview')
			?.children[1]
			?.children[1]
			?.children[0]
			?.children[1]
			?.children[1]
			?.children[0]
			?.children[1]
		) as HTMLSpanElement | undefined;

		setAvg(parseInt(spanElement?.textContent?.trim().replace('%', '') ?? '0'));
	}, [loading]);

	return (
		<Tile 
			width={542}
			height={273}
			content={(
				<div className="col full-width" style={{ '--gap': '20px' }}>
					<div className="row nowrap space-between">
						<span className="text">
							ENTRIES SUCCESS
						</span>
					</div>
					<div className="row nogap full-height">
						<div className="col nogap full-height full-width space-between" style={{ maxWidth: '70%' }}>
							<div className="row full-width" style={{ marginLeft: 65 }}>
								{Object.values(types).map((label, index) => (
									<span key={index + label} className="text-light text-center" style={{ width: 90 }}>
										{label}
									</span>
								))}
							</div>
							{(Object.entries(kind) as [Kind, string][]).map(([kindKey, value]) => (
								<div key={kindKey} className="row center-y full-height full-width">
									<span className="text-light"  style={{ width: 55, marginBottom: 13 }}>{value}</span>
									{(Object.keys(types) as Types[]).map((typeKey) => (
										<div key={typeKey} className="col nogap center-x center-y relative">
											<div style={{ width: 90, height: 90 }}>
												{entryChart(values ? values[kindKey][typeKey] : 0, typeKey)}
											</div>
											<span className="text-light absolute">
												{values ? values[kindKey][typeKey] : 0}%
											</span>
										</div>
									))}
								</div>
							))}
						</div>
						<div className="col full-width center-x center-y relative border-left" style={{ maxWidth: '30%' }}>
							<div style={{ width: 130, height: 130 }}>
								{entryChart(avg, 'avg')}
							</div>
							<span className="text-light absolute" style={{ top: '40%', height: '24px', lineHeight: '24px', fontSize: 24 }}>
								{avg}%
							</span>
							<span className="text-light">
								per Round
							</span>
						</div>
					</div>
				</div>
			)} 
		/>
	);
}