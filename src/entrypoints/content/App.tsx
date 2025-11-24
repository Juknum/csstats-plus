import { useEffect, useMemo } from 'react';

import PlayerPage from './player/player-page';
import AllMatchesPage from './match/all-matches-page';
import MatchPage from './match/[id]/match.page';

export default function App() {
	const url = useMemo(() => window.location.href, [window.location]);

	// remove add banner 
	useEffect(() => {
		const removeBanner = () => {
			const el = document.getElementById('sticky-banner');
			if (el) el.remove();
		};

		// remove if already present
		removeBanner();

		// watch for future additions
		const observer = new MutationObserver((mutations) => {
			for (const m of mutations) {
				if (m.addedNodes.length) {
					removeBanner();
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