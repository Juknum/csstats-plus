import { useEffect, useState } from "react";
import PlayerHeader from "@/components/player/header";
import Maps from "@/components/player/maps/maps";
import Matches from "@/components/player/matches/matches";
import PlayerNavbar from "@/components/player/navbar";
import StatsGrid from "@/components/player/stats/grid";
import { usePlayerData } from "@/hooks/usePlayerData";

import "@/components/common.css";

export default function PlayerPage() {
	const [fragment, setFragment] = useState<string | null>(null);
	const [hasLoadingSection, setHasLoadingSection] = useState<boolean>(false);

	const {
		user: { tracked },
		isLoginRequired,
	} = usePlayerData();

	// hide overridden elements on mount
	useEffect(() => {
		Array.from(document.body.children).forEach((child) => {
			if (!(child instanceof HTMLElement)) return;

			const bgOuter = document.getElementById("page-bg-outer");
			if (bgOuter) bgOuter.style.display = "none";

			const player = document.getElementById("player");
			if (player) player.style.justifyContent = "center";

			const profileInfo = document.getElementById("player-profile");
			if (profileInfo) profileInfo.style.display = "none";

			const filters = document.getElementById("player-filters");
			if (filters) filters.style.display = "none";

			const loadingSection = document.getElementById("player-loading-section");
			if (loadingSection) setHasLoadingSection(true);

			const statsSection = document.getElementById("player-outer-section");
			if (statsSection) {
				if (loadingSection && !isLoginRequired) statsSection.style.display = !fragment ? "none" : "";
				if (isLoginRequired) statsSection.style.display = "";
			}

			if (!tracked) {
				const banner = document.getElementsByClassName("glyphicon glyphicon-warning-sign")?.[0]?.parentElement;
				if (banner) banner.style.display = "none";
			}
		});
	}, [fragment, tracked, isLoginRequired]);

	// watch URL Hash Fragment changes
	useEffect(() => {
		const updateFragment = () => {
			const hash = window.location.hash;
			const value = !hash || hash === "#/" || hash === "#" ? null : hash.startsWith("#/") ? hash.slice(2) : hash.slice(1);

			setFragment(value);
		};

		// Initial call
		updateFragment();

		// Listener
		window.addEventListener("hashchange", updateFragment);
		return () => {
			window.removeEventListener("hashchange", updateFragment);
		};
	}, []);

	return (
		<div className="col" style={{ "--gap": 0 }}>
			{!tracked && <div className="info-banner text">This player does not have match tracking enabled. Some data may be missing.</div>}
			<PlayerHeader />
			<PlayerNavbar />
			{!fragment && hasLoadingSection && <StatsGrid />}

			{/* No element added, so no need to check for the fragment */}
			<Maps />
			<Matches />
		</div>
	);
}
