import { useEffect, useState } from "react";
import Tile from "@/components/tile/tile";
import { usePlayerData } from "@/hooks/usePlayerData";
import type { Stats } from "@/utils/types";
import { MapIcon } from "@/components/map-icon";

export default function MatchesStats() {
	const {
		user: { stats },
		loading,
	} = usePlayerData();
	const [past10Matches, setPast10Matches] = useState<(Stats["past10"][number] & { id: number })[]>([]);

	useEffect(() => {
		if (loading || !stats) return;

		const last10MatchesIds = stats.matches.slice(-10);
		const past10Matches = stats.past10.map((match, index) => ({
			...match,
			id: last10MatchesIds[index] ?? 0,
		}));
		setPast10Matches(past10Matches);
	}, [stats, loading]);

	const openMatchDetails = (matchId: number) => {
		window.open(`/match/${matchId}`, "_blank");
	};

	return (
		<Tile
			isLoading={loading}
			width={542}
			height={153.5}
			className="overflow-hidden"
			content={
				<div className="flex flex-col w-full h-full justify-between gap-[10px] overflow-hidden">
					<div className="flex flex-row flex-nowrap justify-between gap-[10px] shrink-0">
						<span className="text-[13px] leading-[13px] h-[13px] text-white font-bold">MATCHES</span>
					</div>
					<div className="flex flex-row gap-0 w-full flex-1 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
						{past10Matches.map((match, index) => (
							<button
								type="button"
								key={match.id}
								className="border-none bg-none p-0 flex flex-col justify-evenly flex-nowrap h-full min-w-[50px] flex-1 items-center match-hoverable shrink-0 sm:shrink"
								onClick={() => openMatchDetails(match.id)}
							>
								<MapIcon src={match.map} alt={match.map} height={35} width={35} />
								<div className="flex flex-row gap-0 relative w-full justify-center items-center">
									<span
										className="absolute"
										style={{
											backgroundColor: "#4B505E",
											zIndex: -1,
											height: "2px",
											left: 0,
											width: past10Matches.length !== index + 1 ? "100%" : "50%",
										}}
									/>
									<span
										style={{
											backgroundColor: match.result === "lose" ? "#C72D2E" : match.result === "win" ? "#97E668" : "#3A74FA",
											borderRadius: "12px",
											width: "12px",
											height: "12px",
										}}
									/>
								</div>
								<span className="text-[13px] leading-[13px] h-[13px] text-white/75 font-normal">{match.score}</span>
							</button>
						))}
					</div>
				</div>
			}
		/>
	);
}
