import { Navbar } from './navbar';
import { PlayerHeader } from './player-header';
import { PlayerMatches } from './player-matches';

let previousPathname = window.location.pathname;

// add location change listener
(function () {
	const ogPushState = history.pushState;
	const ogReplaceState = history.replaceState;

	const notifyPathnameChange = () => {
		if (previousPathname === window.location.pathname) return;
		main(window.location);
	};

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
		case location.pathname.startsWith('/player/'):
			new PlayerHeader();
			new PlayerMatches();

			break;
	}
}

// initial load
main(window.location);