
export async function waitForScriptLoad(filter: (s: HTMLScriptElement) => boolean): Promise<HTMLScriptElement> {
	return new Promise((res) => {
		const existing = Array.from(document.scripts).find((s) => filter(s));
		if (existing) return res(existing);

		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				for (const node of Array.from(mutation.addedNodes)) {
					if (node instanceof HTMLScriptElement && filter(node)) {
						observer.disconnect();
						res(node);
						return;
					}
				}
			}
		});

		observer.observe(document, {
			childList: true,
			subtree: true,
		});
	});
}