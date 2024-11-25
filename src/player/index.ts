import { CS2Map } from "../utils/constants";
import { getRankPicture, getRanksInfo, RankInfo, slicePremierRank } from "../utils/ranks";
import { getUserInfo } from "../utils/user";
import { getMapIcon } from "../utils/maps";

var playedWithVacBtnShown = true;
var matchesWithVacBtnShown = true;

export class Player {
	private readonly userInfo = getUserInfo();
	private readonly ranksInfo = getRanksInfo();

	private readonly NOT_COMPETITIVE_WIDTH = 600;
	
	constructor() {
		// Custom HTML injection
		document.getElementById('player')!.prepend(this.playerHeader);

		// CSS fixes
		if (document.getElementById('kpd')) {
			document.getElementById('kpd')!.parentElement!.style.transform = 'translateY(-70%)';
			document.getElementById('rating')!.parentElement!.style.transform = 'translateY(-70%)';
		}

		this.fixTableNavbar();

		// Move stuff around
		const warnGlyph = document.getElementsByClassName('glyphicon glyphicon-warning-sign')[0];
		if (warnGlyph && warnGlyph.parentElement) {
			warnGlyph.parentElement.remove();
			const warnBanner = this.warnBanner('This player does not have match tracking enabled. Some data may be missing.');
			warnBanner.style.backgroundColor = 'rgba(208, 65, 67, .15)';
			document.getElementById('player')!.prepend(warnBanner);
		}

		// Banned banner
		if (this.userInfo.banned) {
			document.getElementById('player')!.prepend(this.warnBanner(this.userInfo.banned));
		}
	}
	
	private fixTableNavbar() {
		const filters = document.getElementById('player-filters')!;
		const tableNav = document.getElementById('tab-h-nav') as HTMLDivElement;

		tableNav.style.width = '100%';
		tableNav.style.maxWidth = '1680px';
		tableNav.style.display = 'flex';
		tableNav.style.padding = '0 8px';
		tableNav.style.justifyContent = 'space-between';
		tableNav.style.background = 'rgba(0, 0, 0, 0.38)';
		tableNav.style.borderRadius = '0 0 3px 3px';

		tableNav.append(filters);
		tableNav.id = 'new-tab-h-nav';

		document.getElementById('player-profile')?.replaceWith(tableNav);

		// move filters form to the left
		filters.prepend(document.getElementById('player-filters-form')!);

		const linksContainer = tableNav.querySelectorAll('div')[0];
		linksContainer.style.margin = '0';

		const links = linksContainer.querySelector('ul')!;
		links.style.display = 'flex';
		links.style.gap = '1rem';
		links.style.flexDirection = 'row';
		links.style.height = '100%';
		links.style.alignItems = 'center';
	}

	static checkVacBtns(hash: typeof window.location.hash) {
		const matchesVacBtn = document.getElementById('match-list-show-vac') as HTMLSpanElement | undefined;
		const	matchesAllBtn = document.getElementById('match-list-show-all') as HTMLSpanElement | undefined;

		const playedWithVacBtn = document.getElementById('played-with-show-vac') as HTMLSpanElement | undefined;
		const playedWithAllBtn = document.getElementById('played-with-show-all') as HTMLSpanElement | undefined;

		const allBtns = [matchesVacBtn, matchesAllBtn, playedWithVacBtn, playedWithAllBtn];
	
		const func = (vacBtn: HTMLSpanElement, allBtn: HTMLSpanElement, vacDisplayed: boolean, kind: 'matches' | 'players') => {
			allBtns.forEach((btn) => { if (btn) btn.style.display= 'none' });

			const tableNav = document.getElementById('player-filters') as HTMLDivElement;

			if (kind === 'matches') {
				const count = vacBtn.innerText.split(' ').find((text) => !isNaN(parseInt(text, 10)))!;
				vacBtn.innerText = `Show ${count} VAC matches`;
				allBtn.innerText = 'Show all matches';
			}
			else {
				vacBtn.innerText = 'Show VAC banned players';
				allBtn.innerText = 'Show all players';
			}

			vacBtn.onclick = () => {
				allBtn.style.display = 'inline-block';
				vacBtn.style.display = 'none';

				if (kind === 'matches') matchesWithVacBtnShown = false;
				if (kind === 'players') playedWithVacBtnShown = false;
			}

			allBtn.onclick = () => {
				vacBtn.style.display = 'inline-block';
				allBtn.style.display = 'none';

				if (kind === 'matches') matchesWithVacBtnShown = true;
				if (kind === 'players') playedWithVacBtnShown = true;
			}

			// default display
			vacBtn.style.display = vacDisplayed ? 'inline-block' : 'none';
			allBtn.style.display = vacDisplayed ? 'none' : 'inline-block';

			tableNav.append(vacBtn);
			tableNav.append(allBtn);
		};

		switch (hash) {
			case '#/matches':
				if (!matchesVacBtn || !matchesAllBtn) return;
				func(matchesVacBtn, matchesAllBtn, matchesWithVacBtnShown, 'matches');

				break;

			case '#/players':
				if (!playedWithVacBtn || !playedWithAllBtn) return;
				func(playedWithVacBtn, playedWithAllBtn, playedWithVacBtnShown, 'players');

				break;

			default:
				matchesVacBtn!.style.display = 'none'
				matchesAllBtn!.style.display = 'none'

				playedWithVacBtn!.style.display = 'none'
				playedWithAllBtn!.style.display = 'none'

			 break;
		}
	}

	private warnBanner(text: string) {
		const div = document.createElement('div');
		div.style.background = 'rgb(208, 65, 67)';
		div.style.color = '#fff';
		div.style.padding = '12px 0';
		div.style.textAlign = 'center';
		div.style.width = '100%';

		const span = document.createElement('span');
		span.style.display = 'inline-block';
		span.style.marginRight = '10px';
		span.innerText = text;

		div.append(span);

		return div;
	}

	private get playerHeader() {
		const div = document.createElement('div');
		div.style.background = 'url("https://csstats.gg/images/header-bg-image.png") 50%';
		div.style.backgroundSize = 'cover';
		div.style.width = '100%';

		const container = document.createElement('div');
		container.style.width = '100%';
		container.style.maxWidth = '1680px';
		container.style.margin = '20px auto';
		container.style.display = 'flex';
		container.style.flexDirection = 'row';
		container.style.gap = '20px';
		container.style.alignItems = 'flex-start';

		container.append(this.playerInfo);
		container.append(this.playerRanks);

		div.append(container);

		return div;
	}

	private get playerInfo() {
		const div = document.createElement('div');
		div.style.display = 'flex';
		div.style.flexDirection = 'column';
		div.style.justifyContent = 'flex-start';
		div.style.gap = '10px';
		div.style.alignItems = 'center';
		div.style.width = '120px';
		div.style.height = '200px';

		const img = document.createElement('img');
		img.width = 120;
		img.height = 120;
		img.style.borderRadius = '3px';
		img.src = this.userInfo.img;

		const span = document.createElement('span');
		span.style.color = '#fff';
		span.style.fontSize = '14px';
		span.style.lineHeight = '14px';
		span.style.textAlign = 'center';
		span.style.textOverflow = 'ellipsis';
		span.style.width = '120px';
		span.style.wordBreak = 'break-all';
		span.innerText = this.userInfo.name ?? '';

		const socials = document.createElement('div');
		socials.style.display = 'flex';
		socials.style.gap = '9px';
		socials.style.justifyContent = 'center';
		socials.style.alignItems = 'center';
		socials.style.width = '100%';

		if (this.userInfo.profiles.steam) {
			const steamIcon = document.createElement('img');
			steamIcon.src = 'https://steamcommunity.com/favicon.ico';
			steamIcon.width = 18;
			steamIcon.height = 18;
			
			const steamLink = document.createElement('a');
			steamLink.href = this.userInfo.profiles.steam;
			steamLink.target = '_blank';
			steamLink.rel = 'nofollow noopener noreferrer';

			steamLink.append(steamIcon);
			socials.append(steamLink);
		}
		
		if (this.userInfo.profiles.faceit) {
			const faceitIcon = document.createElement('img');
			faceitIcon.src = 'https://static.csstats.gg/images/faceit-pheasant.png';
			faceitIcon.width = 18;
			faceitIcon.height = 18;
			
			const faceitLink = document.createElement('a');
			faceitLink.href = this.userInfo.profiles.faceit;
			faceitLink.target = '_blank';
			faceitLink.rel = 'nofollow noopener noreferrer';

			faceitLink.append(faceitIcon);
			socials.append(faceitLink);
		}

		div.append(img);
		div.append(span);
		div.append(socials);

		return div;
	}

	private get playerRanks() {
		const div = document.createElement('div');
		div.style.minHeight = '200px';
		div.style.width = '100%';
		div.style.display = 'flex';
		div.style.gap = '20px';
		div.style.flexDirection = 'row';
		div.style.overflowX = 'hidden';

		const notCompetitiveRanks = this.notCompetitiveRanks;
		div.append(notCompetitiveRanks);

		if (this.ranksInfo.some(ri => ri.mode === 'Competitive' && ri.game === 'CS2')) {
			const competitiveRanks = this.competitiveRanks;
			div.append(competitiveRanks);

			// Adjust div width based on modes count (none)
			if (notCompetitiveRanks.style.display === 'none') {
				competitiveRanks.style.width = '100%';
			}

			// Adjust div width based on modes count (one or two)
			if (notCompetitiveRanks.style.width === (this.NOT_COMPETITIVE_WIDTH / 2) + 'px') {
				competitiveRanks.style.width = 'calc(100% - ' + (this.NOT_COMPETITIVE_WIDTH / 2) + 'px - 20px)';
			}
		}

		return div;
	}

	private get competitiveRanks() {
		const CELL_WIDTH = 55;
		const CELL_HEIGHT = (24.38 * CELL_WIDTH) / 60;

		const div = document.createElement('div');
		div.style.background = 'rgba(0, 0, 0, .25)';
		div.style.width = 'calc(100% - ' + this.NOT_COMPETITIVE_WIDTH + 'px - 20px)';
		div.style.backdropFilter = 'blur(10px)';
		div.style.borderRadius = '3px';
		div.style.padding = '10px';
		div.style.display = 'flex';
		div.style.flexDirection = 'column';
		div.style.gap = '10px';

		const title = this.rankTitle;
		title.innerText = 'Competitive';

		div.append(title);

		const ranksTable = document.createElement('div');
		ranksTable.style.display = 'flex';
		ranksTable.style.gap = '10px';
		ranksTable.style.flexDirection = 'row';

		const rankInfo = document.createElement('div');
		rankInfo.style.display = 'flex';
		rankInfo.style.gap = '5px';
		rankInfo.style.flexDirection = 'column';
		rankInfo.style.justifyContent = 'flex-end';
		rankInfo.style.alignItems = 'flex-end';
		rankInfo.style.height = '100%';
		rankInfo.style.paddingBottom = 'calc(15px + 5px)'; // scrollbar height + padding

		const spans = ['wins', 'played', 'current'];
		if (this.ranksInfo.filter(ri => ri.mode === 'Competitive' && ri.game === 'CS2').map(ri => ri.rank.best).some(r => r !== 0)) {
			spans.push('best');
		}

		spans.forEach((type) => {
			const span = document.createElement('span');
			span.style.fontSize = '9px';
			span.style.lineHeight = CELL_HEIGHT + 'px';
			span.style.height = CELL_HEIGHT + 'px';
			span.style.width = '100%';
			span.style.textTransform = 'uppercase';
			span.style.textAlign = 'right';
			span.innerText = type;

			rankInfo.append(span);
		})

		ranksTable.append(rankInfo);

		const ranks = document.createElement('div');
		ranks.style.display = 'flex';
		ranks.style.gap = '5px';
		ranks.style.flexDirection = 'row';
		ranks.style.overflowX = 'scroll';
		ranks.style.paddingBottom = '5px';
		ranks.style.width = '100%';

		for (const rankInfo of this.ranksInfo.filter(ri => ri.game === 'CS2' && ri.mode === 'Competitive' && ri.map !== null)) {
			const rank = document.createElement('div');
			rank.style.display = 'flex';
			rank.style.gap = '5px';
			rank.style.flexDirection = 'column';
			rank.style.justifyContent = 'flex-start';
			rank.style.width = CELL_WIDTH + 'px';

			const icon = document.createElement('img');
			icon.src = getMapIcon(rankInfo.map as CS2Map);
			icon.width = CELL_WIDTH;
			icon.height = CELL_WIDTH;

			const wins = document.createElement('span');
			wins.style.fontSize = '9px';
			wins.style.lineHeight = CELL_HEIGHT + 'px';
			wins.style.height = CELL_HEIGHT + 'px';
			wins.style.width = '100%';
			wins.style.textAlign = 'center';
			wins.innerText = rankInfo.wins.toString();
			
			const played = document.createElement('span');
			played.style.fontSize = '9px';
			played.style.lineHeight = CELL_HEIGHT + 'px';
			played.style.height = CELL_HEIGHT + 'px';
			played.style.width = '100%';
			played.style.textAlign = 'center';
			played.innerText = rankInfo.date
				.replaceAll('Mon ', '')
				.replaceAll('Tue ', '')
				.replaceAll('Wed ', '')
				.replaceAll('Thu ', '')
				.replaceAll('Fri ', '')
				.replaceAll('Sat ', '')
				.replaceAll('Sun ', '')
				;

			const current = document.createElement('img');
			current.src = getRankPicture(rankInfo.rank.current, rankInfo.mode);
			current.width = CELL_WIDTH;

			rank.append(icon);
			rank.append(wins);
			rank.append(played);
			rank.append(current);

			if (rankInfo.rank.best !== 0) {
				const best = document.createElement('img');
				best.src = getRankPicture(rankInfo.rank.best, rankInfo.mode);
				best.width = CELL_WIDTH;
				rank.append(best);
			}

			ranks.append(rank);
		}

		ranksTable.append(ranks);
		div.append(ranksTable);

		return div;
	}

	private get notCompetitiveRanks() {
		const div = document.createElement('div');
		div.style.width = this.NOT_COMPETITIVE_WIDTH + 'px';
		div.style.display = 'flex';
		div.style.flexDirection = 'row';
		div.style.flexWrap = 'wrap';
		div.style.gap = '20px';

		let modesCount = 0;

		if (this.ranksInfo.some(ri => ri.mode === 'Premier')) {
			div.append(this.premierRank);
			modesCount++;
		}

		if (this.ranksInfo.some(ri => ri.mode === 'FACEIT')) {
			div.append(this.faceitRank);
			modesCount++;
		}

		if (this.ranksInfo.some(ri => ri.mode === 'Wingman')) {
			div.append(this.wingmanRank);
			modesCount++;
		}

		if (this.ranksInfo.some(ri => ri.game === 'CS:GO')) {
			div.append(this.csgoRank);
			modesCount++;
		}

		// Hide div if no ranks
		if (modesCount === 0) {
			div.style.display = 'none';
		}

		// Adjust div width based on modes count
		if (modesCount === 2 || modesCount === 1) {
			div.style.width = (this.NOT_COMPETITIVE_WIDTH / 2) + 'px';
			Array.from(div.children).forEach((child) => {
				(child as HTMLDivElement).style.maxWidth = (this.NOT_COMPETITIVE_WIDTH / 2) + 'px';
			});
		}

		return div;
	}

	private get rankDiv() {
		const div = document.createElement('div');

		div.style.background = 'rgba(0, 0, 0, .25)';
		div.style.width = '100%';
		div.style.maxWidth = 'calc((' + this.NOT_COMPETITIVE_WIDTH + 'px - 20px) / 2)';
		div.style.height = '100%';
		div.style.maxHeight = 'calc((100% - 20px) / 2)';
		div.style.backdropFilter = 'blur(10px)';
		div.style.borderRadius = '3px';
		div.style.padding = '10px';
		div.style.display = 'flex';
		div.style.flexDirection = 'column';
		div.style.justifyContent = 'space-between';

		return div;
	}

	private get rankTitle() {
		const title = document.createElement('span');
		title.style.fontSize = '14px';
		title.style.lineHeight = '14px';
		title.style.height = '14px';
		title.style.textTransform = 'uppercase';

		return title;
	}

	private rankIcons(rankInfo: RankInfo) {
		const container = document.createElement('div');
		container.style.display = 'flex';
		container.style.flexDirection = 'row';
		container.style.justifyContent = 'space-evenly';
		container.style.alignItems = 'center';

		(['current', 'best'] as const).forEach((type) => {
			const div = document.createElement('div');
			div.style.display = 'flex';
			div.style.flexDirection = 'column';
			div.style.justifyContent = 'center';
			div.style.gap = '10px';

			const span = document.createElement('span');
			span.style.fontSize = '9px';
			span.style.lineHeight = '9px';
			span.style.height = '9px';
			span.style.textTransform = 'uppercase';
			span.style.textAlign = 'center';
			span.innerText = rankInfo.game === 'CS:GO' && type === 'current' ? 'last' : type;

			if (rankInfo.mode === 'Premier') {
				const [thousand, hundred, color] = slicePremierRank(rankInfo.rank[type]);
				
				const icon = document.createElement('div');
				icon.className = `cs2rating ${color} md`;
				icon.style.transform = 'scale(1.2)';
				icon.style.backgroundImage = `url(${getRankPicture(rankInfo.rank[type], rankInfo.mode)})`;

				const span = document.createElement('span');
				span.innerText = thousand === 0 ? '---' : thousand.toString();
				span.style.transform = 'skew(-15deg)';

				const small = document.createElement('small');
				small.innerText = thousand === 0 ? '' : `,${hundred}`;

				span.append(small);
				icon.append(span);
				div.append(icon);

			}
			else {
				const icon = document.createElement('img');
				icon.src = getRankPicture(rankInfo.rank[type], rankInfo.mode);
	
				if (rankInfo.mode === 'FACEIT') {
					icon.width = 40;
					icon.height = 40;
				}
				else {
					icon.height = 30;
				}
	
				div.append(icon);
			}

			div.append(span);

			if (type === 'best' && rankInfo.rank.best !== 0) {
				container.append(div);
			}
			if (type === 'current') {
				container.append(div);
			}
		});

		return container;
	}

	private get faceitRank() {
		const div = this.rankDiv;

		const rankInfo = this.ranksInfo.find(ri => ri.mode === 'FACEIT')!;
		const titles = this.rankTitles(rankInfo);
		div.append(titles);

		const container = this.rankIcons(rankInfo);
		div.append(container);

		return div;
	}

	private get csgoRank() {
		const div = this.rankDiv;

		const rankInfo = this.ranksInfo.find(ri => ri.game === 'CS:GO')!;
		const titles = this.rankTitles(rankInfo);
		div.append(titles);

		const container = this.rankIcons(rankInfo);
		div.append(container);

		return div;
	}

	private get premierRank() {
		const div = this.rankDiv;

		const rankInfo = this.ranksInfo.find(ri => ri.mode === 'Premier')!;
		const titles = this.rankTitles(rankInfo);
		div.append(titles);

		const container = this.rankIcons(rankInfo);
		div.append(container);

		return div;
	}

	private rankTitles(rankInfo: RankInfo) {
		const div = document.createElement('div');
		div.style.display = 'flex';
		div.style.flexDirection = 'row';
		div.style.justifyContent = 'space-between';

		const title = this.rankTitle;
		title.innerText = rankInfo.game === 'CS:GO' ? 'CS:GO' : rankInfo.mode;

		const date = this.rankTitle;
		date.innerText = rankInfo.date;
		date.style.fontSize = '9px';

		div.append(title);

		const stack = document.createElement('div');
		stack.style.display = 'flex';
		stack.style.flexDirection = 'column';

		stack.append(date);

		if (!Number.isNaN(rankInfo.wins)) {
			const wins = this.rankTitle;
			wins.innerText = rankInfo.wins + ' wins';
			wins.style.fontSize = '9px';
			wins.style.textAlign = 'right';
			stack.append(wins);
		}

		div.append(stack);

		return div;
	}

	private get wingmanRank() {
		const div = this.rankDiv;

		const rankInfo = this.ranksInfo.find(ri => ri.mode === 'Wingman')!;
		const titles = this.rankTitles(rankInfo);
		const container = this.rankIcons(rankInfo);
		
		div.append(titles);
		div.append(container);

		return div;
	}

}
