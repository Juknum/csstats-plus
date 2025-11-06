import PlayerHeader from "@/components/player/header";
import PlayerNavbar from "@/components/player/navbar";
import StatsGrid from "@/components/player/stats/grid";

export default function PlayerPage() {
	const [fragment, setFragment] = useState<string | null>(null);

	// hide overriden elements on mount
	useEffect(() => {
		Array.from(document.body.children).forEach((child) => {
			if (!(child instanceof HTMLElement)) return;

			if (child.id === 'outer-wrapper') {
				const bgOuter = document.getElementById('page-bg-outer');
				bgOuter && (bgOuter.style.display = 'none');

				const profileInfo = document.getElementById('player-profile');
				profileInfo && (profileInfo.style.display = 'none');
			}
		});
	}, []);

	// watch URL Hash Fragment changes
	useEffect(() => {
		const updateFragment = () => {
			const hash  = window.location.hash;
			const value = (!hash || hash === '#/' || hash === '#')
				? null 
				: hash.startsWith('#/')
					? hash.slice(2)
					: hash.slice(1);
			
			setFragment(value);
		};

		// Initial call
		updateFragment();
		
		// Listener
		window.addEventListener('hashchange', updateFragment);
		return () => {
			window.removeEventListener('hashchange', updateFragment)
		};
	}, []);

	return (
		<div className="col" style={{ '--gap': 0 }}>
			<PlayerHeader />
			<PlayerNavbar />
			{ !fragment && <StatsGrid /> }
		</div>
	)
}