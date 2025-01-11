import { CS2Map } from "../utils/constants.js";
import { getMapIcon } from "../utils/maps.js";
import { getLast10Matches } from "../utils/matches.js";

import Chart from 'chart.js/auto';
import { options, percentageToRadians } from "../utils/chart.js";
import { getUserStats } from "../utils/user.js";

export class PlayerStats {

	private readonly PANEL_WIDTH = (1680 - (6 * 10)) / 7;

	constructor () {
		const div = document.getElementById('player-overview');
		if (!div) return;

		this.updateStatsPanels();
	}

	private updateStatsPanels() {
		const container = document.createElement('div');
		container.id = 'player-stats-container';
		container.style.display = 'flex';
		container.style.gap = '10px';
		container.style.justifyContent = 'flex-start';
		container.style.alignItems = 'flex-start';
		container.style.flexWrap = 'wrap';

		document.getElementById('player-overview')!.prepend(container);

		this.updateKDPanel();
		this.updateHLTVPanel();
		this.updateClutchSuccessPanel();
		this.updateWinRatePanel();
		this.updateHSRatePanel();

		this.updateEntrySuccessPanel();
		this.updateMatchesPanels();

		const adr = this.updateADRPanel();
		const them = this.updateMostKillsWithAndHSWeapon();

		const div = document.createElement('div');
		div.style.display = 'flex';
		div.style.flexDirection = 'column';
		div.style.gap = '10px';

		div.append(adr);
		div.append(them);

		document.getElementById('player-stats-container')!.append(div);
	}

	private basePanel(width: number) {
		const div = document.createElement('div');
		div.style.background = 'rgba(0, 0, 0, .3)';
		div.style.position = 'relative';
		div.style.width = width + 'px';
		div.style.backdropFilter = 'blur(10px)';
		div.style.borderRadius = '3px';
		div.style.padding = '10px';
		div.style.display = 'flex';
		div.style.flexDirection = 'column';
		div.style.gap = '10px';

		return div;
	}

	private panelTitle(text: string) {
		const title = document.createElement('span');
		title.style.fontSize = '14px';
		title.style.lineHeight = '14px';
		title.style.height = '14px';
		title.style.textTransform = 'uppercase';
		title.style.color = '#fff';
		title.innerText = text;

		return title;
	}

	private panelIcon(url: string) {
		const icon = document.createElement('img');
		icon.src = url;
		icon.style.width = '30px';
		icon.style.height = '30px';
		icon.style.position = 'absolute';
		icon.style.right = '10px';
		icon.style.top = '10px';

		return icon;
	}

	private updateKDPanel() {
		const div = this.basePanel(this.PANEL_WIDTH);
		const title = this.panelTitle('K/D');

		div.append(title);

		const stats = getUserStats();
		if (!stats) return console.error('Stats not found');

		let maxKpd = 3.0;
		let kpd1 = stats['overall'].kpd;
		if (kpd1 > maxKpd) kpd1 = maxKpd;

		kpd1 = (kpd1 / (maxKpd / 2)) * 100; // normalize
		
		let kpd2 = 100 - kpd1;
		if (kpd2 < 0) kpd2 = 0;

		let maxed = false;
		if (stats['overall'].kpd > (maxKpd / 2)) {
			maxed = true;
			kpd1 = kpd1 - 100;
			kpd2 = 100 - kpd1;
		}

		let overmaxed = false;
		if (stats['overall'].kpd > maxKpd) {
			overmaxed = true;
		}

		const canvas = document.createElement('canvas');
		new Chart(canvas, {
			type: 'doughnut',
			data: {
				datasets: [{
					data: [kpd1, kpd2],
					backgroundColor: overmaxed
					? [
						'rgb(250, 173, 58)',
					] 
					: maxed 
						? [						
							'rgb(125, 205, 78)',
							'rgba(125, 205, 78, .2)',
						] 
						: [
							'rgb(125, 205, 78)',
							'rgba(202, 81,  81, .2)',
						],
					borderWidth: 0,
					animation: false,
					weight: 1
				}]
			},
			options: {
				...options,
				cutout: '96%',
			}
		});

		div.append(canvas);

		const kd = document.getElementById('kpd')!.querySelector('span')!;
		kd.style.position = 'absolute';
		kd.style.fontSize = '45px';
		kd.style.width = `calc(100% - (2 * ${div.style.padding}))`;
		kd.style.textAlign = 'center';
		kd.style.top = '110px';

		div.append(kd);

		const kdDelta = document.getElementById('kpd-delta')!.querySelector('span')!.querySelector('span')!;
		kdDelta.style.position = 'absolute';
		kdDelta.style.fontSize = '14px';
		kdDelta.style.width = `calc(100% - (2 * ${div.style.padding}))`;
		kdDelta.style.textAlign = 'center';
		kdDelta.style.top = '180px';
		kdDelta.style.left = kdDelta.getAttribute('data-delta') === '0' ? 'auto' : 'calc(14px + 5px)'; // glyph width + gap
		kdDelta.style.display = 'flex';
		kdDelta.style.justifyContent = 'center';
		kdDelta.style.alignItems = 'center';
		kdDelta.style.gap = '5px';
		kdDelta.style.flexDirection = 'row-reverse';

		div.append(kdDelta);

		document.getElementById('player-stats-container')!.append(div);
	}

	private updateHLTVPanel() {
		const div = this.basePanel(this.PANEL_WIDTH);
		const title = this.panelTitle('HLTV Rating');

		div.append(title);

		const rating = document.getElementById('rating')!.querySelector('span')!;
		rating.style.position = 'absolute';
		rating.style.fontSize = '45px';
		rating.style.width = `calc(100% - (2 * ${div.style.padding}))`;
		rating.style.textAlign = 'center';
		rating.style.top = '110px';
		
		const stats = getUserStats();
		if (!stats) return console.error('Stats not found');

		const offset = 0.4;
		const maxRating = 1.8;
		let rating1 = stats['overall'].rating - offset;
		if (rating1 > maxRating) rating1 = maxRating;

		rating1 = (rating1 / (maxRating / 2)) * 100; // normalize
		let rating2 = 100 - rating1;

		let maxed = false;
		if (stats['overall'].rating > ((maxRating / 2) + offset)) {
			maxed = true;
			rating1 = rating1 - 100;
			rating2 = 100 - rating1;
		}

		let overmaxed = false;
		if (stats['overall'].rating > maxRating) {
			overmaxed = true;
		}

		const canvas = document.createElement('canvas');
		new Chart(canvas, {
			type: 'doughnut',
			data: {
				datasets: [{
					data: [rating1, rating2],
					backgroundColor: overmaxed 
					? [
						'rgb(250, 173, 58)',
					] 
					: maxed 
						? [						
							'rgb(125, 205, 78)',
							'rgba(125, 205, 78, .2)',
						] 
						: [
							'rgb(125, 205, 78)',
							'rgba(202, 81,  81, .2)',
						],
					borderWidth: 0,
					animation: false,
					weight: 1
				}]
			},
			options: {
				...options,
				cutout: '96%',
			}
		});

		div.append(canvas);
		div.append(rating);
		
		const ratingDelta = document.getElementById('rating-delta')!.querySelector('span')!.querySelector('span')!;
		ratingDelta.style.position = 'absolute';
		ratingDelta.style.fontSize = '14px';
		ratingDelta.style.width = `calc(100% - (2 * ${div.style.padding}))`;
		ratingDelta.style.textAlign = 'center';
		ratingDelta.style.top = '180px';
		ratingDelta.style.left = ratingDelta.getAttribute('data-delta') === '0' ? 'auto' : 'calc(14px + 5px)'; // glyph width + gap
		ratingDelta.style.display = 'flex';
		ratingDelta.style.justifyContent = 'center';
		ratingDelta.style.alignItems = 'center';
		ratingDelta.style.gap = '5px';
		ratingDelta.style.flexDirection = 'row-reverse';

		div.append(ratingDelta);

		document.getElementById('player-stats-container')!.append(div);
	}

	private updateClutchSuccessPanel() {
		const div = this.basePanel(this.PANEL_WIDTH * 3 + 10 * 2);
		const title = this.panelTitle('Clutch Success');

		div.style.justifyContent = 'space-between';
		div.style.height = '255px';
		div.append(title);

		const progressContainer = document.createElement('div');
		progressContainer.style.width = '100%';
		progressContainer.style.height = '5px';
		progressContainer.style.position = 'relative';
		progressContainer.style.marginTop = '40px';
		progressContainer.style.marginBottom = '10px';

		const percentage = (document
			.getElementById('player-overview')!
			.querySelector('.col-sm-8')!
			.querySelector('.col-sm-5')!
			.querySelector('.inner-col-1')!
			.children[0]!
			.children[1]!
			.children[0]!
			.children[1]! as HTMLSpanElement)
			.innerText.trim();

		const percentageText = document.createElement('span');
		percentageText.style.position = 'absolute';
		percentageText.style.top = '-24px';
		percentageText.style.left = '0';
		percentageText.style.fontSize = '24px';
		percentageText.style.lineHeight = '24px';
		percentageText.style.height = '24px';
		percentageText.style.textAlign = 'center';
		percentageText.style.color = '#fff';
		percentageText.innerText = percentage;

		const percentTextAdd = document.createElement('span');
		percentTextAdd.style.fontSize = '14px';
		percentTextAdd.style.lineHeight = '14px';
		percentTextAdd.style.height = '14px';
		percentTextAdd.style.color = 'rgba(255, 255, 255, .5)';
		percentTextAdd.innerText = 'on average';
		percentTextAdd.style.marginLeft = '5px';
		percentageText.append(percentTextAdd);

		const progress = document.createElement('div');
		progress.style.width = '100%';
		progress.style.height = '5px';
		progress.style.borderRadius = '3px';
		progress.style.background = 'rgba(58, 116, 250, .1)';
		progress.style.position = 'absolute';
		progress.style.top = '0';
		progress.style.left = '0';

		const bar = document.createElement('div');
		bar.style.width = percentage;
		bar.style.height = '5px';
		bar.style.borderRadius = '3px 0 0 3px';
		bar.style.background = 'rgb(58, 116, 250)';
		bar.style.position = 'absolute';
		bar.style.top = '0';
		bar.style.left = '0';

		progressContainer.append(percentageText);
		progressContainer.append(progress);
		progressContainer.append(bar);

		div.append(progressContainer);

		const container = document.createElement('div');
		container.style.display = 'flex';
		container.style.justifyContent = 'space-evenly';
		container.style.height = '80%';

		div.append(container);

		['1v1', '1v2', '1v3', '1v4', '1v5'].forEach((clutch) => {
			const column = document.createElement('div');
			column.style.display = 'flex';
			column.style.flexDirection = 'column';
			column.style.justifyContent = 'space-between';
			column.style.width = 'calc((630px - 20px) / 5 - 20px)';
			column.style.alignItems = 'center';

			const clutchTitle = document.createElement('span');
			clutchTitle.style.fontSize = '14px';
			clutchTitle.style.lineHeight = '14px';
			clutchTitle.style.height = '14px';
			clutchTitle.style.textTransform = 'uppercase';
			clutchTitle.innerText = clutch;
			column.append(clutchTitle);

			const divs = document.getElementById(clutch + '-chart-canvas')!.parentElement!.querySelectorAll('div')!;
			const percentage = divs[1].innerText;
			const winLoose = divs[2];

			const canvasContainer = document.createElement('div');
			canvasContainer.style.display = 'flex';
			canvasContainer.style.justifyContent = 'center';
			canvasContainer.style.alignItems = 'center';
			canvasContainer.style.width = '75px';
			canvasContainer.style.height = '75px';

			const canvas = document.createElement('canvas');
			new Chart(canvas, {
				type: 'pie',
				data: {
					datasets: [{
						data: [percentageToRadians(parseFloat(percentage)), percentageToRadians(100 - parseFloat(percentage))],
						backgroundColor: [
							'rgb(58, 116, 250)',
							'rgb(58, 116, 250, .1)',
						],
						borderWidth: 0,
						animation: false,
						weight: 1
					}]
				},
				options,
			});
			canvasContainer.append(canvas);

			column.append(canvasContainer);
			column.append(percentage);
			column.append(winLoose);

			container.append(column);
		});

		document.getElementById('player-stats-container')!.append(div);
	}

	private commonPanel(div: HTMLDivElement, index: number, percentage = true) {
		div.style.height = '255px';

		const value = Array.from(
			document
				.getElementById('player-overview')!
				.querySelector('.col-sm-8')!
				.querySelector('.col-sm-7')!
				.children
			)
			.filter((el) => !el.classList.contains('darkreader'))[index]
			.querySelector('div')!
			.children[1]
			.children[1]
			.querySelector('div')!
			.querySelectorAll('div')[1].style.left;

		const progressContainer = document.createElement('div');
		progressContainer.style.width = '100%';
		progressContainer.style.height = '5px';
		progressContainer.style.position = 'relative';
		progressContainer.style.marginTop = '40px';
		progressContainer.style.marginBottom = '10px';

		const percentageText = document.createElement('span');
		percentageText.style.position = 'absolute';
		percentageText.style.top = '-24px';
		percentageText.style.left = '0';
		percentageText.style.fontSize = '24px';
		percentageText.style.lineHeight = '24px';
		percentageText.style.height = '24px';
		percentageText.style.textAlign = 'center';
		percentageText.style.color = '#fff';
		percentageText.innerText = percentage ? value : Math.round(parseFloat(value.replace('%', ''))).toLocaleString('en-US').split('.')[0];

		const progress = document.createElement('div');
		progress.style.width = '100%';
		progress.style.height = '5px';
		progress.style.borderRadius = '3px';
		progress.style.background = 'rgba(58, 116, 250, .1)';
		progress.style.position = 'absolute';
		progress.style.top = '0';
		progress.style.left = '0';

		const bar = document.createElement('div');
		bar.style.width = value;
		bar.style.height = '5px';
		bar.style.borderRadius = '3px 0 0 3px';
		bar.style.background = 'rgb(58, 116, 250)';
		bar.style.position = 'absolute';
		bar.style.top = '0';
		bar.style.left = '0';

		progressContainer.append(percentageText);
		progressContainer.append(progress);
		progressContainer.append(bar);

		div.append(progressContainer);

		const column = document.createElement('div');
		column.style.display = 'flex';
		column.style.flexDirection = 'column';
		column.style.gap = '10px';

		const dataDiv = Array.from(
			document
				.getElementById('player-overview')!
				.querySelector('.col-sm-8')!
				.querySelector('.col-sm-7')!
				.children
			)
			.filter((el) => !el.classList.contains('darkreader'))[index]
			.querySelector('div')!
			.children[1]
			.children[3]
			.querySelectorAll('.total-stat');

		Array.from(dataDiv)
			.map((div) => {
				const title = div.querySelectorAll('span')[0].innerText;
				const value = div.querySelectorAll('span')[1].innerText;

				return [title, value];
			})
			.forEach(([title, value]) => {

				const row = document.createElement('div');
				row.style.display = 'flex';
				row.style.justifyContent = 'space-between';
				row.style.borderBottom = '1px solid rgba(255, 255, 255, .1)';
				row.style.paddingBottom = '10px';
				row.style.width = '100%';

				const statTitle = document.createElement('span');
				statTitle.style.fontSize = '14px';
				statTitle.style.lineHeight = '14px';
				statTitle.style.height = '14px';
				statTitle.style.textTransform = 'uppercase';
				statTitle.innerText = title;

				const statValue = document.createElement('span');
				statValue.style.fontSize = '14px';
				statValue.style.lineHeight = '14px';
				statValue.style.height = '14px';
				statValue.style.textAlign = 'right';
				statValue.innerText = value;

				row.append(statTitle);
				row.append(statValue);

				column.append(row);
			});

		div.append(column);

		document.getElementById('player-stats-container')!.append(div);
	}

	private updateWinRatePanel() {
		const div = this.basePanel(this.PANEL_WIDTH); 
		const title = this.panelTitle('WIN %');
		const icon = this.panelIcon('https://static.csstats.gg/images/winrate-icon.png');
		
		div.append(title);
		div.append(icon);

		this.commonPanel(div, 3);
	}

	private updateHSRatePanel() {
		const div = this.basePanel(this.PANEL_WIDTH);
		const title = this.panelTitle('HS %');
		const icon = this.panelIcon('https://static.csstats.gg/images/headshot-icon.png');

		div.append(title);
		div.append(icon);

		this.commonPanel(div, 4);
	}

	private updateADRPanel() {
		const div = this.basePanel(this.PANEL_WIDTH * 2 + 10 * 1);
		const title = this.panelTitle('ADR');
		const icon = this.panelIcon('https://static.csstats.gg/images/damage-icon.png');

		div.append(title);
		div.append(icon);

		this.commonPanel(div, 5, false);

		// div.style.flexDirection = 'row';
		div.style.height = '115.18px';

		const divs = div.querySelectorAll('div');
		const progressContainer = divs[0];
		const column = divs[3];

		progressContainer.style.marginTop = '50px';
		column.style.flexDirection = 'row';

		title.style.position = 'absolute';
		title.style.top = '10px';
		title.style.left = '10px';

		return div;
	}

	private updateEntrySuccessPanel() {
		const div = this.basePanel(this.PANEL_WIDTH * 2 + 10 * 1);
		const title = this.panelTitle('Entry Success');

		div.append(title);

		const progressContainer = document.createElement('div');
		progressContainer.style.width = '100%';
		progressContainer.style.height = '5px';
		progressContainer.style.position = 'relative';
		progressContainer.style.marginTop = '40px';
		progressContainer.style.marginBottom = '10px';

		const percentage = (document
			.getElementById('player-overview')!
			.querySelector('.col-sm-8')!
			.querySelector('.col-sm-5')!
			.querySelector('.inner-col-1')!
			.children[1]!
			.children[1]!
			.children[0]!
			.children[1]! as HTMLSpanElement)
			.innerText.trim();

		const percentageText = document.createElement('span');
		percentageText.style.position = 'absolute';
		percentageText.style.top = '-24px';
		percentageText.style.left = '0';
		percentageText.style.fontSize = '24px';
		percentageText.style.lineHeight = '24px';
		percentageText.style.height = '24px';
		percentageText.style.textAlign = 'center';
		percentageText.style.color = '#fff';
		percentageText.innerText = percentage;

		const percentTextAdd = document.createElement('span');
		percentTextAdd.style.fontSize = '14px';
		percentTextAdd.style.lineHeight = '14px';
		percentTextAdd.style.height = '14px';
		percentTextAdd.style.color = 'rgba(255, 255, 255, .5)';
		percentTextAdd.innerText = 'per round';
		percentTextAdd.style.marginLeft = '5px';
		percentageText.append(percentTextAdd);

		const progress = document.createElement('div');
		progress.style.width = '100%';
		progress.style.height = '5px';
		progress.style.borderRadius = '3px';
		progress.style.background = 'rgba(58, 116, 250, .1)';
		progress.style.position = 'absolute';
		progress.style.top = '0';
		progress.style.left = '0';

		const bar = document.createElement('div');
		bar.style.width = percentage;
		bar.style.height = '5px';
		bar.style.borderRadius = '3px 0 0 3px';
		bar.style.background = 'rgb(58, 116, 250)';
		bar.style.position = 'absolute';
		bar.style.top = '0';
		bar.style.left = '0';

		progressContainer.append(percentageText);
		progressContainer.append(progress);
		progressContainer.append(bar);

		div.append(progressContainer);

		const ids = {
			Success: {
				Both: '2-fk-both',
				T: '2-fk-t',
				CT: '2-fk-ct',
			},
			Attempts: {
				Both: '1-fk-both',
				T: '1-fk-t',
				CT: '1-fk-ct',
			},
		} as const;

		(['Success', 'Attempts'] as const).forEach((title) => {
			const container = document.createElement('div');
			container.style.display = 'flex';
			container.style.justifyContent = 'space-evenly';
			container.style.alignItems = 'center';
			
			const span = document.createElement('span');
			span.style.fontSize = '12px';
			span.style.lineHeight = '12px';
			span.style.textTransform = 'uppercase';
			span.style.textAlign = 'center';
			span.innerText = title === 'Attempts' ? title + ' Per Round' : title + ' Per Attempt';

			if (title === 'Attempts') span.style.marginBottom = '29px';

			container.append(span);

			(['Both', 'T', 'CT'] as const).forEach((side) => {
				const column = document.createElement('div');
				column.style.display = 'flex';
				column.style.flexDirection = 'column';
				column.style.gap = '10px';
				column.style.width = ((this.PANEL_WIDTH * 2) + (10 * 1) - 20) / 4 + 'px';
				column.style.alignItems = 'center';

				const canvasContainer = document.createElement('div');
				canvasContainer.style.display = 'flex';
				canvasContainer.style.justifyContent = 'center';
				canvasContainer.style.alignItems = 'center';
				canvasContainer.style.width = '60px';
				canvasContainer.style.height = '60px';
				canvasContainer.style.marginTop = '-10px';

				const oldCanvas = document.getElementById(ids[title][side]) as HTMLCanvasElement;
				const parentElement = title === 'Attempts' && side !== 'Both' ?  oldCanvas.parentElement! : oldCanvas.parentElement!.parentElement!;
				const percentage = parentElement.innerText;

				const colorBoth = 'rgb(58, 116, 250';
				const colorT = 'rgb(250, 173, 58';
				const colorCT = 'rgb(58, 169, 250';

				const canvas = document.createElement('canvas');
				new Chart(canvas, {
					type: 'pie',
					data: {
						datasets: [{
							data: [percentageToRadians(parseFloat(percentage)), percentageToRadians(100 - parseFloat(percentage))],
							backgroundColor: [
								(side === 'Both' ? colorBoth : side === 'T' ? colorT : colorCT) + ')',
								(side === 'Both' ? colorBoth : side === 'T' ? colorT : colorCT) + ', .1)',
							],
							borderWidth: 0,
						}]
					},
					options,
				})

				canvasContainer.append(canvas);
				column.append(canvas.parentElement!);
				column.append(percentage);

				if (title === 'Success') column.prepend(side);

				container.append(column);
			});

			div.append(container);
		})

		document.getElementById('player-stats-container')!.append(div);
	}

	private updateMatchesPanels() {
		const matchesDivs = document
			.getElementById('player-overview')!
			.querySelector('.col-sm-4')!
			.querySelectorAll('.match-dot-outer');

		const mostPlayedDivs = document
			.getElementById('player-overview')!
			.querySelector('.col-sm-4')!
			.querySelectorAll('.stat-panel')[1]
			.querySelector('div')!
			.querySelectorAll('div')[1]
			;

		const mostSuccessDivs = document
			.getElementById('player-overview')!
			.querySelector('.col-sm-4')!
			.querySelectorAll('.stat-panel')[2]
			.querySelector('div')!
			.querySelectorAll('div')[1]
			;

		const container = document.createElement('div');
		container.style.display = 'flex';
		container.style.flexDirection = 'column';
		container.style.gap = '10px';

		const matchesPanel = this.basePanel(this.PANEL_WIDTH * 3 + 10 * 2);
		const matchesTitle = this.panelTitle('Matches');
		matchesPanel.append(matchesTitle);

		container.append(matchesPanel);

		this.updateMatchesPanel(matchesPanel, matchesDivs);

		const subContainer = document.createElement('div');
		subContainer.style.display = 'flex';
		subContainer.style.flexDirection = 'row';
		subContainer.style.gap = '10px';

		const mostPlayed = this.basePanel(((this.PANEL_WIDTH * 3 + 10 * 2) - 10) / 2);
		const mostPlayedTitle = this.panelTitle('Most Played');
		mostPlayed.append(mostPlayedTitle);

		const mostSuccess = this.basePanel(((this.PANEL_WIDTH * 3 + 10 * 2) - 10) / 2);
		const mostSuccessTitle = this.panelTitle('Most Success');
		mostSuccess.append(mostSuccessTitle);

		const mostPlayedBg = mostPlayedDivs.parentElement!.parentElement!.style.background;
		const mostSuccessBg = mostSuccessDivs.parentElement!.parentElement!.style.background;

		const mostPlayedContainer = document.createElement('div');
		mostPlayedContainer.style.background = mostPlayedBg;
		mostPlayedContainer.style.borderRadius = '5px';
		mostPlayedContainer.append(mostPlayed);

		const mostSuccessContainer = document.createElement('div');
		mostSuccessContainer.style.background = mostSuccessBg;
		mostSuccessContainer.style.borderRadius = '5px';
		mostSuccessContainer.append(mostSuccess);

		subContainer.append(mostPlayedContainer);
		subContainer.append(mostSuccessContainer);

		container.append(subContainer);

		this.updateMapStatPanel(mostPlayed, mostPlayedDivs);
		this.updateMapStatPanel(mostSuccess, mostSuccessDivs);

		document.getElementById('player-stats-container')!.append(container);
	}

	private updateMatchesPanel(div: HTMLDivElement, matchesDiv: NodeListOf<Element>) {
		const matchesContainer = document.createElement('div');
		matchesContainer.style.display = 'flex';
		matchesContainer.style.flexDirection = 'row';

		const matches = getLast10Matches().reverse();

		(matchesDiv as NodeListOf<HTMLDivElement>).forEach((div, index) => {
			const img = div.querySelector('img');

			div.onclick = () => {
				const a = document.createElement('a')
				a.href = matches[index].url!;
				a.click();
			};
			div.style.cursor = 'pointer';

			if (img) {
				img.style.height = '25px';
				const mapName = img.src.split('/').pop()!.replace('.png', '').split('_').filter((_, i) => i < 2).join('_');
				img.src = getMapIcon(mapName as CS2Map);
			}
			else {
				const newImg = document.createElement('img');
				newImg.style.height = '25px';
				newImg.src = getMapIcon(matches[index].map as CS2Map);

				div.prepend(newImg);
			}

			const last = index === matchesDiv.length - 1;
			if (last) {
				const bar = div.querySelector('div')!;
				bar.style.width = '50%';

				const dot = bar.querySelector('div')!;
				dot.style.margin = '';
				dot.style.marginRight = '-5px';
				dot.style.marginTop = '-5px';
			}


			matchesContainer.append(div);
		})

		div.append(matchesContainer);
	}

	private updateMapStatPanel(div: HTMLDivElement, data: HTMLDivElement) {
		data.style.width = '100%';
		div.style.backdropFilter = 'blur(2px)';
		div.style.backgroundColor = 'rgba(0, 0, 0, .75)';

		Array.from(data.children).forEach((div) => {
			const row = div.querySelector('div')!.querySelector('div')!;

			const mapIconMissing = Array.from(row.querySelectorAll('div')).length === 0;

			const greenBar = Array.from(div.querySelectorAll('div'))[mapIconMissing ? 4 : 5]!;
			const redBar = Array.from(div.querySelectorAll('div'))[mapIconMissing ? 5 : 6];

			greenBar.style.borderRadius = '3px 0 0 3px';
			greenBar.style.height = '5px';

			if (redBar) {
				greenBar.style.background = '#7dcd4e';
				redBar.style.background = '#ca5151';

				redBar.style.borderRadius = '0 3px 3px 0';
				redBar.style.height = '5px';
			}
			else {
				greenBar.style.background = '#3a74fa'; // blue

				const redBar = greenBar.cloneNode() as HTMLDivElement;
				redBar.style.background = 'rgba(58, 116, 250, .2)';
				redBar.style.width = 100 - parseFloat(redBar.style.width.replace('%', '')) + '%';
				redBar.style.borderRadius = '0 3px 3px 0';
				greenBar.parentElement!.append(redBar);
			}

			if (greenBar.style.width === '100%') greenBar.style.borderRadius = '3px';
			if (redBar && redBar.style.width === '100%') redBar.style.borderRadius = '3px';
			
			row.style.marginTop = '5px';

			(div.querySelector('div')!.querySelector('div')!.nextElementSibling as HTMLDivElement).style.marginTop = '9px';

			const img = row.querySelector('div')?.querySelector('img');
			const span = row.querySelector('span')!;

			if (img) img.src = getMapIcon(span.innerText as CS2Map);
			else {
				const parent = span.parentElement! as HTMLDivElement;
				const container = document.createElement('div');
				container.style.float = 'left';
				container.style.width = '18px';
				container.style.marginRight = '4px';
				container.style.textAlign = 'center';

				const img = document.createElement('img');
				img.src = getMapIcon(span.innerText as CS2Map);
				img.height = 17;

				container.append(img);
				parent.prepend(container);
			}

			span.innerText = span.innerText.replace('cs_', '').replace('de_', '').replace('dust2', 'dust II');
			span.style.textTransform = 'capitalize';
		})
		
		div.append(data);
	}

	private updateMostKillsWithAndHSWeapon() {
		const mostKillsDiv = this.basePanel(this.PANEL_WIDTH);
		const mostKillsTitle = this.panelTitle('Most Kills');
		mostKillsDiv.append(mostKillsTitle);

		const mostHSDiv = this.basePanel(this.PANEL_WIDTH);
		const mostHSTitle = this.panelTitle('Most HS %');
		mostHSDiv.append(mostHSTitle);

		const row = document.createElement('div');
		row.style.display = 'flex';
		row.style.flexDirection = 'row';
		row.style.gap = '10px';

		[mostKillsDiv, mostHSDiv].forEach((div, index) => {
			div.style.height = '192px';
			div.style.gap = '';
			div.style.justifyContent = 'space-between';

			const subColumn = document.createElement('div');
			subColumn.style.display = 'flex';
			subColumn.style.flexDirection = 'column';
			subColumn.style.gap = '6px';

			const data = (Array.from(document
				.getElementById('player-overview')!
				.querySelector('.col-sm-4')!
				.querySelectorAll('.stat-panel')[index + 3]
				.children) as HTMLDivElement[])
				.filter((c, i) => i > 0)
				;
				
			data.forEach(el => {
				el.style.padding = '';

				const bar = Array.from(el.children)[1] as HTMLDivElement;
				bar.style.height = '5px';
				bar.style.borderRadius = '3px 0 0 3px';
				if (bar.style.width === '100%') bar.style.borderRadius = '3px';

				const emptyBar = bar.cloneNode() as HTMLDivElement;
				emptyBar.style.width = 100 - parseFloat(emptyBar.style.width.replace('%', '')) + '%';
				emptyBar.style.borderRadius = '0 3px 3px 0';
				emptyBar.style.background = 'rgba(58, 116, 250, 0.2)';

				bar.parentElement!.append(emptyBar);

				subColumn.append(el);
			});
			div.append(subColumn);
		});

		row.append(mostKillsDiv);
		row.append(mostHSDiv);

		document.getElementById('player-stats-container')!.append(row);

		return row;
	}
}
