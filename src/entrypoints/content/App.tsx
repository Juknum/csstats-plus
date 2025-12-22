import { useEffect, useMemo } from 'react';

import PlayerPage from './player/player-page';
import AllMatchesPage from './match/all-matches-page';
import MatchPage from './match/[id]/match.page';

export default function App() {
	const url = useMemo(() => window.location.href, [window.location]);

	// remove Ad banner 
	useEffect(() => {
		const removeAdBanner = () => {
			const el1 = document.getElementById('sticky-banner');
			if (el1) el1.remove();

			const el2 = document.getElementsByClassName('publift-widget-sticky_footer-container')[0];
			if (el2) el2.remove();
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
			{url === 'https://csstats.gg/match'              && <AllMatchesPage />}

			{url.match(/https:\/\/csstats\.gg\/player\/\d+/) && <PlayerPage     />}
			{url.match(/https:\/\/csstats\.gg\/match\/\d+/)  && <MatchPage      />}
		</>
	);
}