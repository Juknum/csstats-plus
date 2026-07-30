import { useEffect, useMemo, useRef, useState } from "react";
import { usePlayerData } from "@/hooks/usePlayerData";
import { CS2_MAPS, SOME_COMMUNITY_MAPS } from "@/utils/constants";
import { getMapName } from "@/utils/maps";

import "../common.css";

const SELECT_CLASS = "bg-[#181a26] border border-[#24262d] rounded px-2.5 max-w-fit text-white cursor-pointer h-8 appearance-none";

export default function PlayerNavbar() {
	const { loading, isLoginRequired } = usePlayerData();
	const [displayAdvancedFilters, setDisplayAdvancedFilters] = useState(false);

	const defaultGameType = "cs2";
	const [gameType, setGameType] = useState<string>(defaultGameType);

	const defaultVersusType = "5v5";
	const [versusType, setVersusType] = useState<string>(defaultVersusType);

	const defaultPlatformType = "All";
	const [platformType, setPlatformType] = useState<string>(defaultPlatformType);

	const defaultCommon = "all";
	const [modeType, setModeType] = useState<string>(defaultCommon);
	const [groupType, setGroupType] = useState<string>(defaultCommon);
	const [dateType, setDateType] = useState<string>(defaultCommon);
	const [mapType, setMapType] = useState<string>(defaultCommon);

	const areFiltersTouched = useMemo(
		() =>
			gameType !== defaultGameType ||
			versusType !== defaultVersusType ||
			platformType !== defaultPlatformType ||
			modeType !== defaultCommon ||
			groupType !== defaultCommon ||
			dateType !== defaultCommon ||
			mapType !== defaultCommon,
		[gameType, versusType, platformType, modeType, groupType, dateType, mapType],
	);

	const navbarRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (loading) return;

		const tableNav = document.getElementById("tab-h-nav") as HTMLDivElement | null;
		if (tableNav) {
			tableNav.classList.add("max-w-full", "overflow-x-auto");
			navbarRef.current?.prepend(tableNav);
		} else navbarRef.current?.classList.add("no-table-nav");

		// fetch the current filters from the URL
		const url = new URL(window.location.href);
		setGameType(url.pathname.includes("/csgo") ? "csgo" : "cs2");
		setVersusType(url.searchParams.get("vs") ?? defaultVersusType);
		setPlatformType(url.searchParams.get("platforms") ?? defaultPlatformType);
		setModeType(url.searchParams.get("modes") ?? defaultCommon);
		setGroupType(url.searchParams.get("groups") ?? defaultCommon);
		setDateType(url.searchParams.get("date") ?? defaultCommon);
		setMapType(url.searchParams.get("maps") ?? defaultCommon);
	}, [loading]);

	const handleApplyFilters = () => {
		const url = new URL(window.location.href);

		if (platformType !== defaultPlatformType) url.searchParams.set("platforms", platformType);
		if (dateType !== defaultCommon) url.searchParams.set("date", dateType);
		if (mapType !== defaultCommon) url.searchParams.set("maps", mapType);
		if (modeType !== defaultCommon) url.searchParams.set("modes", modeType);
		if (groupType !== defaultCommon) url.searchParams.set("groups", groupType);
		if (versusType !== defaultVersusType) url.searchParams.set("vs", versusType);

		if (gameType !== defaultGameType) {
			if (!url.pathname.includes("/csgo")) url.pathname = `${url.pathname}/${gameType}`;
		} else url.pathname = url.pathname.replace(/\/csgo/, "");

		window.history.pushState({}, "", url.toString());
		window.location.reload();
	};

	const handleClearFilters = () => {
		const url = new URL(window.location.href);
		url.searchParams.delete("platforms");
		url.searchParams.delete("date");
		url.searchParams.delete("maps");
		url.searchParams.delete("modes");
		url.searchParams.delete("groups");
		url.searchParams.delete("vs");

		url.pathname = url.pathname.replace(/\/csgo/, "");

		window.history.pushState({}, "", url.toString());
		window.location.reload();
	};

	if (isLoginRequired) return null;
	if (loading)
		return <div className="w-full max-w-[1680px] min-h-[50px] px-2 mx-auto flex justify-between bg-[rgba(11,13,24,0.6)] border border-white/[0.04] rounded-[2px]">&nbsp;</div>;

	return (
		<div
			className="w-full max-w-[1680px] min-h-[50px] px-2 py-1 mx-auto flex flex-row flex-nowrap items-center justify-between gap-2 bg-[rgba(11,13,24,0.6)] border border-white/[0.04] rounded-[2px] [&.no-table-nav]:justify-end overflow-hidden"
			ref={navbarRef}
		>
			<div className="flex flex-row flex-nowrap gap-1.5 items-center justify-end shrink-0 relative">
				{areFiltersTouched && (
					<>
						<button type="button" className={`${SELECT_CLASS} border-[#3049a5] hover:bg-[#3049a5]/50 hover:text-white`} onClick={() => handleApplyFilters()}>
							Apply
						</button>
						<button type="button" className={`${SELECT_CLASS} border-[#a53030] hover:bg-[#a53030]/50 hover:text-white`} onClick={() => handleClearFilters()}>
							Clear
						</button>
					</>
				)}

				<select className={SELECT_CLASS} onChange={(e) => setGameType(e.target.value)} value={gameType}>
					<option value="cs2">CS2</option>
					<option value="csgo">CS:GO</option>
				</select>
				<select className={SELECT_CLASS} onChange={(e) => setVersusType(e.target.value)} value={versusType}>
					<option value="5v5">5v5</option>
					<option value="2v2">2v2</option>
				</select>

				<button type="button" className={`${SELECT_CLASS} w-8 px-0 text-center`} onClick={() => setDisplayAdvancedFilters(!displayAdvancedFilters)}>
					⋮
				</button>

				{displayAdvancedFilters && (
					<div className="absolute top-[calc(100%+0.25rem)] right-0 z-[1000] flex flex-col gap-1 bg-[#141622] p-2 rounded border border-[#24262d] shadow-lg min-w-[160px]">
						<select className={`${SELECT_CLASS} min-w-[145px]`} onChange={(e) => setPlatformType(e.target.value)}>
							<option value="All">All Platforms</option>
							<option value="Valve">Valve</option>
							<option value="FACEIT">FACEIT</option>
						</select>

						{versusType === "5v5" && (
							<select className={`${SELECT_CLASS} min-w-[145px]`} onChange={(e) => setModeType(e.target.value)}>
								<option value="all">All Modes</option>
								{["Valve", "All"].includes(platformType) && (
									<>
										<option value="Competitive">Competitive</option>
										<option value="Scrimmage">Scrimmage</option>
										<option value="Premier">Premier</option>
										<option value="Premier - Season 2">Premier - S2</option>
										<option value="Premier - Season 3">Premier - S3</option>
										<option value="Premier - Season 4">Premier - S4</option>
										<option value="Premier-Limited-Test">Premier Limited Test</option>
									</>
								)}
								{["FACEIT", "All"].includes(platformType) && (
									<>
										<option value="Matchmaking">Matchmaking</option>
										<option value="ESEA">ESEA</option>
										<option value="Hubs">Hubs</option>
									</>
								)}
							</select>
						)}

						{modeType === "ESEA" && (
							<select className={`${SELECT_CLASS} min-w-[145px]`} onChange={(e) => setGroupType(e.target.value)}>
								<option value="all">All Seasons</option>
								<option value="ESEA S46">Season S46</option>
								<option value="ESEA S47">Season S47</option>
								<option value="ESEA S48">Season S48</option>
								<option value="ESEA S49">Season S49</option>
								<option value="ESEA S50">Season S50</option>
								<option value="ESEA S51">Season S51</option>
								<option value="ESEA S52">Season S52</option>
								<option value="ESEA S53">Season S53</option>
							</select>
						)}

						<select className={`${SELECT_CLASS} min-w-[145px]`} onChange={(e) => setDateType(e.target.value)}>
							<option value="all">All Dates</option>
							<option value="7d">7 Days</option>
							<option value="30d">30 Days</option>
							<option value="6mo">6 Months</option>
							<option value="12mo">12 Months</option>
							<option value="range" disabled>
								Custom
							</option>
						</select>

						<select className={`${SELECT_CLASS} min-w-[145px]`} onChange={(e) => setMapType(e.target.value)}>
							<option value="all">All Maps</option>
							{[...CS2_MAPS, ...SOME_COMMUNITY_MAPS]
								.sort()
								.filter((map) => map.startsWith("de") || map.startsWith("cs"))
								.map((map) => (
									<option key={map} value={map} className="capitalize">
										{getMapName(map)}
									</option>
								))}
						</select>
					</div>
				)}
			</div>
		</div>
	);
}
