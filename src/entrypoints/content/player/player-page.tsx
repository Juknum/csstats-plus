import PlayerHeader from "@/components/player/header";
import PlayerNavbar from "@/components/player/navbar";
import StatsGrid from "@/components/player/stats/grid";

export default function PlayerPage() {
	const [fragment, setFragment] = useState<string|null>(null);

	useEffect(() => {
		const updateFragment = () => {
			const hash  = window.location.hash;
			const value = !hash 
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
		<div style={{ 
				display: 'flex', 
				flexDirection: 'column',
			}}
		>
			<PlayerHeader />
			<PlayerNavbar />
			{ !fragment && <StatsGrid /> }
		</div>
	)
}