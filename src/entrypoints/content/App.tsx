import PlayerPage from './player/player-page';

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
			{url.includes('/player/') && <PlayerPage />}
		</>
	);
}