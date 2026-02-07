export function watchElement(id: string, onChange: (target: HTMLElement, mutation: MutationRecord) => void) {
	const target = document.getElementById(id);
	if (!target) return;

	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => void onChange(target, mutation));
	});

	observer.observe(target, {
		attributes: true,
		childList: true,
		characterData: true,
	});
}
