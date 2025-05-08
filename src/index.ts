import { Match } from './match/index.js';
import { MatchesPage } from './matches-page/index.js';
import { Navbar } from './navbar.js';
import { PlayerInit } from './player/index.js';

let previousPathname = window.location.pathname;

const notifyPathnameChange = () => {
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
			try { new PlayerInit(); } catch (e) { console.error(e); }
			break;

		case location.pathname.includes('/match/'):
			try { new Match(); } catch (e) { console.error(e); }
			break;

		case location.pathname.includes('/match'):
			try { new MatchesPage(); } catch (e) { console.error(e); }
			break;
	}
}

// initial load
main(window.location);
notifyPathnameChange();