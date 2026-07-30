import { defineBackground } from "wxt/utils/define-background";

export default defineBackground(() => {
	// @ts-ignore
	const runtime = typeof browser !== "undefined" ? browser.runtime : typeof chrome !== "undefined" ? chrome.runtime : null;
	if (!runtime) return;

	runtime.onMessage.addListener((message: any, _sender: any, sendResponse: (res?: any) => void) => {
		if (message?.type === "FETCH_STEAM_BG" && message.steamUrl) {
			(async () => {
				const steamUrl = message.steamUrl;
				console.log("[CSStats+] [Background] Requesting Steam profile background for:", steamUrl);
				try {
					const htmlRes = await fetch(steamUrl);
					if (htmlRes.ok) {
						const htmlText = await htmlRes.text();

						// Match style="background-image: url( 'https://.../images/items/...' );"
						const styleMatch = htmlText.match(/background-image:\s*url\(\s*['"]?(https:\/\/[^'"]+\/images\/items\/[^'"]+)['"]?\s*\)/i);
						if (styleMatch && styleMatch[1]) {
							const bgUrl = styleMatch[1].trim();
							console.log("[CSStats+] [Background] Found Steam profile background:", bgUrl);
							sendResponse({ bg: bgUrl });
							return;
						}

						// Fallback match any Steam CDN items image URL
						const cdnMatch = htmlText.match(/https:\/\/[^\s'"<>]+\/images\/items\/[^\s'"<>]+\.(?:jpg|png|jpeg|webp)/i);
						if (cdnMatch && cdnMatch[0]) {
							console.log("[CSStats+] [Background] Found Steam fallback background:", cdnMatch[0]);
							sendResponse({ bg: cdnMatch[0] });
							return;
						}

						console.warn("[CSStats+] [Background] No Steam background image found in profile HTML for:", steamUrl);
					} else {
						console.error("[CSStats+] [Background] Steam fetch returned non-200 status:", htmlRes.status, htmlRes.statusText);
					}

					sendResponse({ bg: null });
				} catch (err) {
					console.error("[CSStats+] [Background] Error fetching Steam profile background:", err);
					sendResponse({ bg: null, error: String(err) });
				}
			})();

			return true;
		}
	});
});
