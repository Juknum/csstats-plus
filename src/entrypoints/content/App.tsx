import PlayerPage from './player/player-page';

export default function App() {
	const url = window.location.href;

	const modifiedPages = useMemo(() => [
		'/player/'
	] as const, []);

	const isModifiedPage = useMemo(() => {
		return modifiedPages.some((u) => url.includes(u));
	}, [url, modifiedPages]);

	useEffect(() => {
		if (isModifiedPage) {
			Array.from(document.body.children).forEach((child) => {
				if (!(child instanceof HTMLElement)) return;

				if (child.id === 'outer-wrapper') {
					// TODO: to be removed once the new layout is done
					// child.style.display = 'none';
					const tmp1 = document.getElementById('player');
					if (tmp1) tmp1.style.justifyContent = 'center';
					// TODO END ---

					const el = document.getElementById('page-bg-outer');
					const el2 = document.getElementById('player-profile');
					if (el2) el2.style.display = 'none';
					if (el) el.style.display = 'none';
				}
			})
		}

	}, [isModifiedPage]);

	switch (true) {
		case url.includes(modifiedPages[0]):
			return <PlayerPage />;
	}

	return null;
}