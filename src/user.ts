export function getUserInfo() {
	const otherProfilesDiv = document.getElementById('other-profiles') as HTMLDivElement;
	const [steam, faceit] = Array.from(otherProfilesDiv.children) as (HTMLDivElement | undefined)[];

	const steamAnchor = steam?.children[0] as HTMLAnchorElement | undefined;
	const faceitAnchor = faceit?.children[0] as HTMLAnchorElement | undefined;

	return {
		img: (document.getElementById('player-avatar')?.children[0] as HTMLImageElement).src,
		name: document.getElementById('player-name')?.textContent?.trim(),
		profiles: {
			steam: steamAnchor?.href,
			faceit: faceitAnchor?.href,
		}
	}
}