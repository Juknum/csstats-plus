import { Match } from './match/index';
import { Navbar } from './navbar';
import { Player } from './player/index';
import { PlayerMaps } from './player/maps';
import { PlayerMatches } from './player/matches';
import { PlayerPlayers } from './player/players';
import { PlayerStats } from './player/stats';

let previousPathname = window.location.pathname;

const notifyPathnameChange = () => {
	// notify on every change
	Player.checkVacBtns(window.location.hash);

	// notify only if pathname has changed
	if (previousPathname === window.location.pathname) return;
	main(window.location);
};

// add location change listener
(function () {
	const ogPushState = history.pushState;
	const ogReplaceState = history.replaceState;

	history.pushState = function (...args) {
		ogPushState.apply(this, args);
		notifyPathnameChange();
	}

	history.replaceState = function (...args) {
		ogReplaceState.apply(this, args);
		notifyPathnameChange();
	}

	window.addEventListener('popstate', notifyPathnameChange);
})() 

// apply injections based on location
function main(location: typeof window.location) {
	new Navbar();

	switch (true) {
		case location.pathname.includes('/player/'):
			try { new Player(); } catch (e) { console.error(e); }

			try { new PlayerStats(); } catch (e) { console.error(e); }
			try { new PlayerMaps(); } catch (e) { console.error(e); }
			try { new PlayerMatches(); } catch (e) { console.error(e); }
			try { new PlayerPlayers(); } catch (e) { console.error(e); }

			break;

		case location.pathname.includes('/match/'):
			try { new Match(); } catch (e) { console.error(e); }
	}
}

// initial load
main(window.location);
notifyPathnameChange();