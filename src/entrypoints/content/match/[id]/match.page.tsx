import CompetitiveOrWingmanRankIcon from "@/components/rank-icons/comp-win-rank";
import FaceitRankIcon from "@/components/rank-icons/faceit-rank";
import { PremierRankIcon } from "@/components/rank-icons/premier-rank";
import { CS2Map } from "@/utils/constants";
import { getMapIcon, getMapName } from "@/utils/maps";
import { CSGameMode } from "@/utils/types";
import { Fragment, useEffect } from "react";
import { createRoot } from "react-dom/client";

export default function MatchPage() {

	useEffect(() => {
		const matchInfoElement = document.getElementById('match-info-inner');
		if (!matchInfoElement) return;

		const row = matchInfoElement.querySelector('div');
		if (!row) return;

		const isFaceIt      = row.children[3]?.querySelector('img')?.src.includes('faceit') || false;
		const isWingman     = row.children[1]?.textContent?.trim().toLowerCase() === 'wingman';
		const isCompetitive = row.children[1]?.textContent?.trim().toLowerCase() === 'official matchmaking';
		
		const gamemode: CSGameMode = 
			  isWingman     ? 'Wingman' 
			: isCompetitive ? 'Competitive'
			: isFaceIt      ? 'FACEIT' 
			: 'Premier'

		let rankNumber = 0;
		const map = row.children[2]?.textContent?.trim() || '';
		(row.children[2] as HTMLElement).style.display = 'none';

		switch (gamemode) {
			case 'FACEIT': 
				if (row.children[3]) {
					const img = row.children[3].querySelector('img');
					rankNumber = parseInt(img?.src.match(/faceit\/level(\d+)\.png/)?.[1] ?? '0');
					(row.children[3] as HTMLElement).style.display = 'none';
				}
			break;

			case 'Wingman':
				if (row.children[1]) row.children[1].textContent = 'Wingman';
				// fallthrough
			case 'Competitive':
				if (row.children[4]) {
					const img = row.children[4].querySelector('img');
					rankNumber = parseInt(img?.src.match(/ranks\/(\d+)\.png/)?.[1] ?? '0');
					(row.children[4] as HTMLElement).style.display = 'none';
				}
			break;

			case 'Premier':
				if (row.children[4]) {
					const div = row.children[4].querySelector('div');
					rankNumber = parseInt(div?.innerText.replace(',', '') ?? '0');
					(row.children[4] as HTMLElement).style.display = 'none';
				}

			break;
		}

		updateMatchDetails(rankNumber, gamemode, map);
		updatePlayersAvatars();
		hideHeaderRanks();
		avoidScrollBarOnTable();
		updateRanksInTable(gamemode);
	}, []);

	const updateRanksInTable = (gamemode: CSGameMode) => {
		const tableContainer = document.getElementById('match-scoreboard');
		if (!tableContainer) return;

		const table = tableContainer.querySelector('table');
		if (!table) return;

		const rows = table.querySelectorAll('tbody tr');
		rows.forEach((row) => {
			const rankCell = row.children[2];
			if (!rankCell) return;

			const img = rankCell.querySelector('img');
			const div = rankCell.querySelector('div');

			let rankNumber = 0;
			let hasRankChanges = false;
			let isRankUp = false;

			switch (gamemode) {
				case 'FACEIT': 
					if (img) rankNumber = parseInt(img.src.match(/faceit\/level(\d+)\.png/)?.[1] ?? '0');
				break;

				case 'Wingman':
				case 'Competitive':
					if (img) {
						rankNumber = parseInt(img.src.match(/ranks\/(\d+)\.png/)?.[1] ?? '0');
						const spanSibling = img.nextElementSibling as HTMLSpanElement | null;
						if (spanSibling) {
							hasRankChanges = spanSibling.classList.length > 0;
							isRankUp = spanSibling.classList.contains('glyphicon-chevron-up');
						}
					}
				break;

				case 'Premier':
					if (div) rankNumber = parseInt(div.innerText.replace(',', '') ?? '0');
				break;
			}

			createRoot(rankCell).render(
				<>
					{gamemode === 'Premier' && (
						<PremierRankIcon rankNumber={rankNumber} />
					)}
					
					{gamemode === 'FACEIT' && (
						<FaceitRankIcon rankNumber={rankNumber} />
					)}

					{(gamemode === 'Wingman' || gamemode === 'Competitive') && (
						<CompetitiveOrWingmanRankIcon
							rankNumber={rankNumber}
							gamemode={gamemode}
							hasRankChanges={hasRankChanges}
							isRankUp={isRankUp}
						/>
					)}
				</>
			);
		});
	};

	const avoidScrollBarOnTable = () => {
		const tableContainer = document.getElementById('match-scoreboard');
		if (!tableContainer) return;

		const table = tableContainer.querySelector('table');
		if (!table) return;

		table.style.overflow = 'hidden';
	};

	const hideHeaderRanks = () => {
		const headerRanks = document.querySelectorAll("div.rank-holder") as NodeListOf<HTMLDivElement>;
		headerRanks.forEach((div) => {
			div.style.display = 'none';
		});
	};

	const updatePlayersAvatars = () => {
		const images = [
			...document.querySelectorAll('img.avatar') as NodeListOf<HTMLImageElement>,
			...document.querySelectorAll('img[width="25"][height="25"]') as NodeListOf<HTMLImageElement>
		];

		images.forEach((img) => {
			img.style.borderRadius = '3px';
		});
	};

	const updateMatchDetails = (rankNumber: number, gamemode: CSGameMode, map: string) => {
		const avgRankDiv   = document.createElement('div');
		const matchDetails = document.getElementById('match-details');
		if (!matchDetails) return;

		matchDetails.appendChild(avgRankDiv);

		matchDetails.querySelectorAll('.tied-team').forEach((el) => {
			const span = el.querySelector('span');
			if (span) span.style.color = '#3A74FA';
		})

		// Make sure the header has enough space
		if (matchDetails.nextElementSibling) {
			(matchDetails.nextElementSibling as HTMLDivElement).style.height = '200px';
		}

		const team1 = document.getElementById('team-1-outer');
		const team2 = document.getElementById('team-2-outer');

		team1 && (team1.style.marginTop = '20px');
		team2 && (team2.style.marginTop = '20px');

		createRoot(avgRankDiv).render(
			<div 
				style={{ 
					display: 'flex', 
					flexDirection: 'column', 
					gap: '.5rem', 
					alignItems: 'center', 
					position: 'absolute',
					left: 'calc(50% - 40px)',
					top: '30px'
				}}
			>
				<img src={getMapIcon(map as CS2Map)} alt={map} width="80" />
				<span style={{ marginTop: '-5px', textTransform: 'capitalize' }}>{getMapName(map)}</span>

				{gamemode === 'Premier' && (
					<PremierRankIcon rankNumber={rankNumber} />
				)}

				{gamemode === 'FACEIT' && (
					<FaceitRankIcon rankNumber={rankNumber} />
				)}

				{(gamemode === 'Wingman' || gamemode === 'Competitive') && (
					<CompetitiveOrWingmanRankIcon
						rankNumber={rankNumber}
						gamemode={gamemode}
					/>
				)}
				<span 
					style={{ 
						marginTop: '-5px', 
						textTransform: 'capitalize', 
						fontSize: '.8em' 
					}}
				>
					{gamemode === 'FACEIT' ? 'Avg. Level' : 'Avg. Rank' }
				</span>

			</div>
		)
	};

	// const updateRankIcons = (gamemode: CSGameMode) => {
	// 	const rankIcons = document.querySelectorAll('img[src^="https://static.csstats.gg/images/ranks/"]') as NodeListOf<HTMLImageElement>;
		
	// 	rankIcons.forEach((icon) => {
	// 		const src = icon.src;
	// 		const rankNumber = src.match(/ranks\/(\d+)\.png/)?.[1];
	// 		if (!rankNumber) return;

	// 		const parent = icon.parentElement;
	// 		if (!parent) return;

	// 		if (parent.childElementCount > 1) {
	// 			const spanSibling = parent.querySelector('span');
	// 			const isNothing = spanSibling?.classList.length === 0;
	// 			const isRankUp = spanSibling?.classList.contains('glyphicon-chevron-up') || false;

	// 			createRoot(parent).render(
	// 				<>
	// 					{isNothing && (<span>{spanSibling.textContent}</span>)}
	// 					{/* {isFaceit && (<FaceitRankIcon rankNumber={parseInt(child?.src.match(/faceit\/level(\d+)\.png/)?.[1] ?? '0')} />)} */}
	// 					{/* {!isFaceit && ( */}
	// 						<CompetitiveOrWingmanRankIcon
	// 							small
	// 							rankNumber={parseInt(rankNumber) ?? 0}
	// 							gamemode={gamemode}
	// 							hasRankChanges={!isNothing}
	// 							isRankUp={isRankUp}
	// 						/>
	// 					{/* )} */}
	// 				</>
	// 			)
	// 		}
			
	// 		else {
	// 			createRoot(parent).render(
	// 				<>
	// 					{/* {isFaceit && (<FaceitRankIcon rankNumber={parseInt(child?.src.match(/faceit\/level(\d+)\.png/)?.[1] ?? '0')} />)} */}
	// 					{/* {!isFaceit && ( */}
	// 						<CompetitiveOrWingmanRankIcon
	// 							rankNumber={parseInt(rankNumber) ?? 0}
	// 							gamemode={gamemode}
	// 							hasRankChanges={false}
	// 							isRankUp={false}
	// 						/>
	// 					{/* )} */}
	// 				</>
	// 			)
	// 		}

	// 	});
	// };

	return <></>;
}