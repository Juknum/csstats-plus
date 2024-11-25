import { Navbar } from './navbar';
import { Player } from './player/index';
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
			new Player();

			new PlayerStats();
			new PlayerMatches();
			new PlayerPlayers();

			break;
	}
}

// initial load
main(window.location);
notifyPathnameChange();