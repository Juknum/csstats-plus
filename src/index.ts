import { PlayerPage } from './pages/player';

function main() {
	const pathname = window.location.pathname;

	switch (true) {
		case pathname.startsWith('/player/'):
			const pp = new PlayerPage();
			pp.load();

			break;
	}
}

main();
