import { useEffect, useMemo, useState } from "react";
import { usePlayerData } from "@/hooks/usePlayerData";
import { CS2_MAPS, type CS2OfficialMap } from "@/utils/constants";
import { getRankPicture } from "@/utils/ranks";
import type { RankInfo } from "@/utils/types";
import { PremierRankIcon } from "../rank-icons/premier-rank";
import { MapIcon } from "../map-icon";
import Tile from "../tile/tile";

import "../common.css";

export default function PlayerHeader() {
	const {
		user,
		user: { ranks },
	} = usePlayerData();

	const GRID_GAP = 10;

	const RANK_WIDTH_TINY = 63;
	const RANK_HEIGHT_TINY = 63;

	const RANK_WIDTH_MEDIUM_HANDLE = 30;
	const RANK_WIDTH_MEDIUM_CONTENT = 290;

	const RANK_WIDTH_MEDIUM = RANK_WIDTH_MEDIUM_CONTENT + RANK_WIDTH_MEDIUM_HANDLE + GRID_GAP;
	const RANK_HEIGHT_MEDIUM = 63;

	const premierRanks = useMemo(() => {
		if (!ranks) return [];

		return ranks.filter((r) => r.gamemode.type === "Premier").sort((a, b) => (b.gamemode.season ?? 0) - (a.gamemode.season ?? 0));
	}, [ranks]);

	const [currSeason, setCurrentSeason] = useState<number>(0);
	const maxSeason = useMemo(() => (premierRanks.length && premierRanks[0] ? (premierRanks[0].gamemode.season ?? 0) : 0), [premierRanks]);
	const currPremierRank = useMemo(() => premierRanks.find((r) => r.gamemode.season === currSeason), [currSeason, premierRanks]);

	useEffect(() => {
		if (premierRanks.length === 0 || !premierRanks[0]) return;
		setCurrentSeason(premierRanks[0].gamemode.season ?? 0);
	}, [premierRanks]);

	const handleSeasonSwitch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, newIndex: -1 | 1) => {
		e.preventDefault();

		const findNextAvailableSeason = (startSeason: number, direction: -1 | 1): number | null => {
			let nextSeason = startSeason + direction;
			const seasons = premierRanks.map((r) => r.gamemode.season ?? 0);
			const minSeason = Math.min(...seasons);
			const maxSeason = Math.max(...seasons);

			while (nextSeason >= minSeason && nextSeason <= maxSeason) {
				if (seasons.includes(nextSeason)) {
					return nextSeason;
				}
				nextSeason += direction;
			}
			return null;
		};

		setCurrentSeason((prev) => {
			const nextSeason = findNextAvailableSeason(prev, newIndex);
			return nextSeason !== null ? nextSeason : prev;
		});
	};

	const isLastPremierSeason = useMemo(() => {
		if (!currPremierRank) return true;

		const seasons = premierRanks.map((r) => r.gamemode.season ?? 0);
		const maxSeason = Math.max(...seasons);

		return currPremierRank.gamemode.season === maxSeason;
	}, [currPremierRank, premierRanks]);

	const isFirstPremierSeason = useMemo(() => {
		if (!currPremierRank) return true;

		const seasons = premierRanks.map((r) => r.gamemode.season ?? 0);
		const minSeason = Math.min(...seasons);

		return currPremierRank.gamemode.season === minSeason;
	}, [currPremierRank, premierRanks]);

	const wingmanRank = useMemo(() => {
		if (!ranks) return null;
		return ranks.filter((r) => r.gamemode.type === "Wingman")[0];
	}, [ranks]);

	const faceitRank = useMemo(() => {
		if (!ranks) return null;
		return ranks.filter((r) => r.gamemode.type === "FACEIT")[0];
	}, [ranks]);

	const csgoRank = useMemo(() => {
		if (!ranks) return null;
		return ranks.filter((r) => r.gamemode.type === "Competitive" && r.game === "CS:GO")[0];
	}, [ranks]);

	const setUrl = (params: [string, string][], csgo: boolean = false) => {
		const url = new URL(window.location.href);
		if (url.pathname.includes("/csgo")) url.pathname = url.pathname.replace(/\/csgo/, "");

		url.search = "";

		params.forEach(([key, val]) => {
			url.searchParams.append(key, val);
		});

		if (csgo) url.pathname += "/csgo";

		window.history.pushState({}, "", url.toString());
		window.location.reload();
	};

	const rankedTile = (rank: RankInfo, clickParams: [string, string][]) => {
		const types: ("current" | "best")[] = ["current", "best"];

		if (rank.rank.best === 0) types.pop();

		return (
			<Tile
				height={RANK_HEIGHT_MEDIUM}
				width={RANK_WIDTH_MEDIUM_CONTENT}
				className="rank-tile-hoverable w-full max-w-full flex-1"
				onClick={() => setUrl(clickParams, rank.game === "CS:GO")}
				content={
					<div className="flex flex-row-reverse sm:flex-row justify-between w-full gap-[10px]">
						<div className="flex flex-col gap-0 items-end sm:items-start">
							<div className="text-[13px] leading-[13px] h-[13px] text-white font-bold">
								{rank.game === "CS:GO" ? "CS:GO" : rank.gamemode.type.toUpperCase()}
								&nbsp;
								{rank.gamemode.season !== null ? `- S${rank.gamemode.season}` : ""}
							</div>
							<div className="text-[9px] leading-[14px] h-[14px] text-[#aaaaaa]">{rank.date.toUpperCase()}</div>
							{!Number.isNaN(rank.wins) && <div className="text-[9px] leading-[14px] h-[14px] text-[#aaaaaa]">{rank.wins} WINS</div>}
						</div>

						<div className="flex flex-row justify-start sm:justify-end gap-[10px]">
							{types.map((type) => {
								if (rank.gamemode.type === "Premier") {
									return (
										<div key={type} className="flex flex-col gap-[4px]">
											<PremierRankIcon rankNumber={rank.rank[type]} />
											<span className="text-[9px] leading-[14px] h-[14px] text-[#aaaaaa] text-center w-[70px]">
												{type === "current" && rank.gamemode.season !== maxSeason ? "LAST" : type.toUpperCase()}
											</span>
										</div>
									);
								}

								return (
									<div key={type} className="flex flex-col gap-[4px]">
										<img height={25} src={getRankPicture(rank.rank[type], rank.gamemode.type)} alt={`${rank.rank[type]} rank`} />
										<span className="text-[9px] leading-[14px] h-[14px] text-[#aaaaaa] text-center w-[70px]">
											{type === "current" && rank.game === "CS:GO" ? "LAST" : type.toUpperCase()}
										</span>
									</div>
								);
							})}
						</div>
					</div>
				}
			/>
		);
	};

	const [showCommunityMaps, setShowCommunityMaps] = useState(false);
	const canShowCommunityMaps = useMemo(() => ranks.some((cr) => !CS2_MAPS.includes(cr.map as CS2OfficialMap)), [ranks]);

	const competitiveRanks = useMemo(() => {
		if (!ranks) return [];
		return ranks
			.filter((r) => r.gamemode.type === "Competitive" && r.game === "CS2")
			.filter((r) => (showCommunityMaps ? !CS2_MAPS.includes(r.map as CS2OfficialMap) : CS2_MAPS.includes(r.map as CS2OfficialMap)));
	}, [ranks, showCommunityMaps]);

	return (
		<div
			className="flex flex-row justify-center p-3 sm:p-5 bg-cover bg-center w-full gap-[10px]"
			style={{ backgroundImage: "url('https://csstats.gg/images/header-bg-image.png')" }}
		>
			<div className="flex flex-col md:flex-row w-full max-w-[1680px] items-center md:items-start" style={{ gap: `${GRID_GAP * 2}px` }}>
				{/* Avatar & User Info Header Block */}
				<div className="flex flex-row md:flex-col items-center justify-between md:justify-start w-full md:w-auto gap-4 shrink-0">
					<div className="flex flex-row md:flex-col items-center md:items-center shrink-0 gap-[10px]">
						<img className="rounded-[3px] w-[90px] h-[90px] md:w-[120px] md:h-[120px] object-cover shrink-0" src={user.img ?? ""} alt="avatar" />
						
						<div className="flex flex-col items-start md:items-center gap-[6px] md:gap-[10px]">
							<span className="text-white text-[15px] md:text-[14px] leading-tight text-left md:text-center text-ellipsis max-w-[160px] md:w-[120px] break-all font-bold">
								{user.name}
							</span>
							<div className="flex flex-row justify-start md:justify-center items-center w-full gap-[10px]">
								{user.profiles?.discordBooster && (
									<img src={user.profiles?.discordBooster} width="18" height="14" data-toggle="tooltip" data-original-title="Discord Server Booster" alt="Discord Server Booster" />
								)}
								{user.profiles?.steam && (
									<a href={user.profiles.steam} target="_blank" rel="noopener noreferrer">
										<img src="https://steamcommunity.com/favicon.ico" width="18" height="18" alt="Steam Profile" />
									</a>
								)}
								{user.profiles?.faceit && (
									<a href={user.profiles.faceit} target="_blank" rel="noopener noreferrer">
										<img src="https://static.csstats.gg/images/faceit-pheasant.png" width="18" height="18" alt="Faceit Profile" />
									</a>
								)}
							</div>
						</div>
					</div>

					{/* Mobile Faceit Level Badge (Next to User Info on Mobile) */}
					{faceitRank && (
						<div className="flex md:hidden flex-col items-center gap-[10px] shrink-0">
							<Tile
								className="justify-center items-center rank-faceit-hoverable"
								onClick={() => setUrl([["platforms", "FACEIT"]])}
								height={RANK_WIDTH_TINY}
								width={RANK_HEIGHT_TINY}
								content={<img width="40" height="40" src={getRankPicture(faceitRank.rank.current, faceitRank.gamemode.type)} alt={`${faceitRank.rank.current} rank`} />}
							/>
							<img width="58" src="https://static.csstats.gg/images/faceit.png" alt="Faceit Logo" />
						</div>
					)}
				</div>

				{/* Desktop Row: Ranks (#oui) on Left, Competitive Maps Tile on Right */}
				<div className="flex flex-col md:flex-row w-full max-w-full min-w-0 items-center md:items-start flex-1" style={{ gap: `${GRID_GAP * 2}px` }}>
					{/* Ranks Column */}
					<div className="flex flex-col gap-[10px] w-full md:w-auto shrink-0 max-w-full">
						{user.banned && (
							<div className="bg-[rgba(208,65,67,0.12)] border-2 border-[rgba(208,65,67,0.35)] rounded-[5px] text-[#ccc] h-[40px] text-center leading-[40px] text-[13px] font-bold w-full">
								{user.banned}
							</div>
						)}

						<div
							className="flex flex-row flex-wrap sm:flex-nowrap justify-center sm:justify-start w-full md:w-auto max-w-full"
							id="oui"
							style={{
								gap: `${GRID_GAP}px`,
							}}
						>
							{/* Desktop Faceit Level Badge */}
							{faceitRank && (
								<div className="hidden md:flex flex-col items-center gap-[10px] shrink-0">
									<Tile
										className="justify-center items-center rank-faceit-hoverable"
										onClick={() => setUrl([["platforms", "FACEIT"]])}
										height={RANK_WIDTH_TINY}
										width={RANK_HEIGHT_TINY}
										content={<img width="40" height="40" src={getRankPicture(faceitRank.rank.current, faceitRank.gamemode.type)} alt={`${faceitRank.rank.current} rank`} />}
									/>
									<img width="58" src="https://static.csstats.gg/images/faceit.png" alt="Faceit Logo" />
								</div>
							)}

							<div className="flex flex-col items-center sm:items-end gap-[10px] w-full md:w-auto max-w-full">
								{currPremierRank && (
									<div className="flex flex-row-reverse sm:flex-row relative gap-[10px] w-full max-w-full">
										<Tile
											height={RANK_WIDTH_TINY}
											width={RANK_WIDTH_MEDIUM_HANDLE}
											className="shrink-0"
											content={
												<>
													<button
														type="button"
														onClick={(e) => handleSeasonSwitch(e, 1)}
														className={`absolute h-[30px] w-[30px] border-none bg-transparent text-[9px] cursor-pointer ${
															isLastPremierSeason ? "text-gray-500 cursor-not-allowed opacity-30" : "text-white"
														}`}
														style={{ top: "0px", right: "0px" }}
													>
														▲
													</button>
													<button
														type="button"
														onClick={(e) => handleSeasonSwitch(e, -1)}
														className={`absolute h-[30px] w-[30px] border-none bg-transparent text-[9px] cursor-pointer ${
															isFirstPremierSeason ? "text-gray-500 cursor-not-allowed opacity-30" : "text-white"
														}`}
														style={{ bottom: "0px", right: "0px" }}
													>
														▼
													</button>
												</>
											}
										/>
										{rankedTile(currPremierRank, [["modes", currPremierRank.gamemode.season === 1 ? "Premier" : `Premier - Season ${currPremierRank.gamemode.season}`]])}
									</div>
								)}

								{csgoRank && (
									<div className="flex flex-row-reverse sm:flex-row relative gap-[10px] w-full max-w-full">
										{currPremierRank && <Tile height={RANK_HEIGHT_MEDIUM} width={RANK_WIDTH_MEDIUM_HANDLE} className="shrink-0" content={null} />}
										{rankedTile(csgoRank, [["platforms", "Valve"]])}
									</div>
								)}

								{wingmanRank && (
									<div className="flex flex-row-reverse sm:flex-row relative gap-[10px] w-full max-w-full">
										{currPremierRank && <Tile height={RANK_HEIGHT_MEDIUM} width={RANK_WIDTH_MEDIUM_HANDLE} className="shrink-0" content={null} />}
										{rankedTile(wingmanRank, [["vs", "2v2"]])}
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Competitive Maps Tile */}
					<div className="flex flex-col w-full min-w-0 max-w-full md:flex-1 h-full gap-[10px]">
						{competitiveRanks.length > 0 && (
							<Tile
								height={209}
								className="flex flex-col w-full max-w-full"
								content={
									<div className="flex flex-col gap-0 w-full max-w-full">
										<div className="flex flex-row flex-nowrap justify-between gap-[10px]">
											<span className="text-[13px] leading-[13px] h-[13px] text-white font-bold">COMPETITIVE</span>
											<div className="flex flex-col gap-0 items-end">
												<span className="text-[9px] leading-[14px] h-[14px] text-right text-white">
													{competitiveRanks.reduce((prev, curr) => prev + curr.wins, 0)} WINS TOTAL
												</span>
												{canShowCommunityMaps && (
													<div className="flex flex-row flex-nowrap gap-[5px]">
														<label className="text-[9px] leading-[14px] h-[14px] text-right text-white cursor-pointer" htmlFor="checkbox">
															Show Community Maps
														</label>
														<input
															id="checkbox"
															type="checkbox"
															className="cursor-pointer"
															defaultChecked={showCommunityMaps}
															onClick={() => setShowCommunityMaps(!showCommunityMaps)}
														/>
													</div>
												)}
												{!canShowCommunityMaps && <span className="text-[9px] leading-[14px] h-[14px] text-right text-white italic">No Community Maps played</span>}
											</div>
										</div>
										<div className="flex flex-row flex-nowrap gap-[7px] max-w-full">
											<div className="flex flex-col gap-[5px] h-[180px] shrink-0">
												<span style={{ height: "40px" }} />
												<span className="text-[9px] leading-[22.35px] h-[22.35px] w-[60px] text-[#aaaaaa]">WINS</span>
												<span className="text-[9px] leading-[22.35px] h-[22.35px] w-[60px] text-[#aaaaaa]">PLAYED</span>
												<span className="text-[9px] leading-[22.35px] h-[22.35px] w-[60px] text-[#aaaaaa]">LATEST</span>
												<span className="text-[9px] leading-[22.35px] h-[22.35px] w-[60px] text-[#aaaaaa]">BEST</span>
											</div>
											<div className="flex flex-row flex-nowrap overflow-x-auto pb-[5px] gap-[2.5px] max-w-full">
												{competitiveRanks.map((cr) => (
													<button
														type="button"
														key={cr.map}
														className="border-none bg-none p-0 flex flex-col items-center rank-competitive-hoverable cursor-pointer gap-[5px] shrink-0"
														onClick={() =>
															setUrl([
																// biome-ignore lint/style/noNonNullAssertion: cr.map can't be null as it's filtered above
																["maps", cr.map!],
																["modes", "Competitive"],
															])
														}
													>
														{/** biome-ignore lint/style/noNonNullAssertion: cr.map can't be null as it's filtered above */}
														<MapIcon height="40" src={cr.map!} alt={cr.map ?? "unknown_map"} />
														<span className="text-center text-[9px] leading-[22.35px] h-[22.35px] w-[60px] text-[#aaaaaa]">{cr.wins}</span>
														<span className="text-center text-[9px] leading-[22.35px] h-[22.35px] w-[60px] text-[#aaaaaa]">
															{cr.date.replace(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) /, "").toUpperCase()}
														</span>
														<img width="55" src={getRankPicture(cr.rank.current, cr.gamemode.type)} alt={`${cr.rank.current} rank`} />
														{cr.rank.best !== 0 && <img width="55" src={getRankPicture(cr.rank.best, cr.gamemode.type)} alt={`${cr.rank.best} rank`} />}
													</button>
												))}
											</div>
										</div>
									</div>
								}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
