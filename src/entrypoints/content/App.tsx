import PlayerPage from './player/player-page';

export default function App() {
	const url = window.location.href;

	const modifiedPages = useMemo(() => [
		'/player/'
	], []);

	const isModifiedPage = useMemo(() => {
		return modifiedPages.some((u) => url.includes(u));
	}, [url, modifiedPages]);

	useEffect(() => {
		if (isModifiedPage) {
			Array.from(document.body.children).forEach((child) => {
				if (!(child instanceof HTMLElement)) return;

				if (child.id === 'outer-wrapper') {
					child.style.display = 'none';

					const el = document.getElementById('page-bg-outer');
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