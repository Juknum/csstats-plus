import PlayerHeader from "@/components/player/header";
import PlayerNavbar from "@/components/player/navbar";

export default function PlayerPage() {
	return (
		<div style={{ 
				display: 'flex', 
				flexDirection: 'column',
			}}
		>
			<PlayerHeader />
			<PlayerNavbar />
		</div>
	)
}