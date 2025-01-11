export function getUserInfo() {
	const otherProfilesDiv = document.getElementById('other-profiles') as HTMLDivElement;
	const [steam, faceit] = Array.from(otherProfilesDiv.children).filter((c) => c.classList.contains('icon')) as (HTMLDivElement | undefined)[];

	const bannedBanner = (Array.from(otherProfilesDiv.children) as HTMLDivElement[]).find((c) => c.innerText.includes('VAC') || c.innerText.includes('Overwatch'));

	const steamAnchor = steam?.children[0] as HTMLAnchorElement | undefined;
	const faceitAnchor = faceit?.children[0] as HTMLAnchorElement | undefined;

	return {
		img: (document.getElementById('player-avatar')?.children[0] as HTMLImageElement).src,
		name: document.getElementById('player-name')?.textContent?.trim(),
		banned: bannedBanner ? bannedBanner.innerText.trim() : null,
		profiles: {
			steam: steamAnchor?.href,
			faceit: faceitAnchor?.href,
		}
	}
}

interface Stats { 
	[key: string]: unknown;
	overall: {
		[key: string]: unknown;
		kpd: number;
		rating: number;
	}
}

export function getUserStats(): Stats | undefined {
	let stats: Stats | undefined;

	for (const script of Array.from(document.scripts)) {
		if (script.textContent?.includes('var stats = ')) {
			stats = JSON.parse(script.textContent.split('var stats = ')[1].split(';')[0]);
		}
	}

	return stats;
}
