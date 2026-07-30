import { useEffect, useRef, useState } from "react";
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

	const bannerRef = useRef<HTMLDivElement>(null);

	const {
		user: { tracked, bg },
		isLoginRequired,
	} = usePlayerData();

	// hide overridden elements on mount and handle page background
	useEffect(() => {
		const bgOuter = document.getElementById("page-bg-outer");
		const bgInner = document.getElementById("page-bg");

		if (bg) {
			const isVideo = bg.endsWith(".mp4") || bg.endsWith(".webm");
			if (bgOuter) {
				bgOuter.style.display = "";
				if (!isVideo) {
					bgOuter.style.backgroundImage = `url('${bg}')`;
				}
			}
			if (bgInner) {
				bgInner.style.display = "";
				if (!isVideo) {
					bgInner.style.backgroundImage = `url('${bg}')`;
				}
			}
		} else {
			if (bgOuter) bgOuter.style.display = "none";
			if (bgInner) bgInner.style.display = "none";
		}

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
			const banner = document.getElementsByClassName("tracking-bar")?.[0] as HTMLElement | undefined;
			if (banner) bannerRef.current?.appendChild(banner);
		}
	}, [bg, fragment, tracked, isLoginRequired]);

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
		<div className="flex flex-col gap-0">
			{!tracked && <div ref={bannerRef} />}
			<PlayerHeader />
			<PlayerNavbar />
			{!fragment && hasLoadingSection && <StatsGrid />}

			{/* No element added, so no need to check for the fragment */}
			<Maps />
			<Matches />
		</div>
	);
}
