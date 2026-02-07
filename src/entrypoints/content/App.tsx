import { useEffect, useMemo } from "react";
import MatchPage from "./match/[id]/match.page";
import AllMatchesPage from "./match/all-matches-page";
import PlayerPage from "./player/player-page";

export default function App() {
	const url = useMemo(() => window.location.href, []);

	// remove Ad banner
	useEffect(() => {
		const removeAdBanner = () => {
			const el1 = document.getElementById("sticky-banner");
			if (el1) el1.remove();

			const el2 = document.getElementsByClassName("publift-widget-sticky_footer-container")[0];
			if (el2) el2.remove();

			const el3 = document.getElementById("primis-video-container");
			if (el3) el3.remove();
		};

		// remove if already present
		removeAdBanner();

		// watch for future additions
		const observer = new MutationObserver((mutations) => {
			for (const m of mutations) {
				if (m.addedNodes.length) {
					removeAdBanner();
					break;
				}
			}
		});

		observer.observe(document.body ?? document.documentElement, {
			childList: true,
			subtree: true,
		});

		return () => observer.disconnect();
	}, []);

	return (
		<>
			{url.match(/https:\/\/csstats\.gg\/(?:[a-z]{2}\/)?match$/) && <AllMatchesPage />}

			{url.match(/https:\/\/csstats\.gg\/(?:[a-z]{2}\/)?player\/\d+/) && <PlayerPage />}
			{url.match(/https:\/\/csstats\.gg\/(?:[a-z]{2}\/)?match\/\d+/) && <MatchPage />}
		</>
	);
}
