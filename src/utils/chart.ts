export function percentageToRadians(percentage: number) {
	return (percentage * 360) / 100;
}

export const options = {
	events: [],
	plugins: {
		legend: { display: false },
		tooltip: { enabled: false }
	},
  animation: {
    duration: 0
  },
	layout: {
		padding: 2,
	},
};
