
export function getLast10Matches() {
	const div = document.getElementById('player-matches');
	if (!div) return [];

	const table = div.querySelector('table')!;
	const rows = Array.from(table.querySelector('tbody')!.querySelectorAll('tr')!).filter((_, i) => i < 10);

	return rows.map((tr) => {

		const mapCol = tr.querySelector('td:nth-child(3)')!;
		const map = mapCol.querySelector('img')?.getAttribute('alt') || mapCol.textContent!.trim();
		const url = tr.getAttribute('onclick')?.replace('if (!window.__cfRLUnblockHandlers) return false; window.location=', '').replace(/'/g, '');

		return {
			map,
			url
		}
	})
}