
export class PlayerPlayers {
	constructor() {
		this.centerPlayedWithText();
	}

	private centerPlayedWithText() {
		document.getElementById('played-with-outer')!.querySelector('div')!.style.textAlign = 'center';
	}
}