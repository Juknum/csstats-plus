import { defineBackground } from "wxt/utils/define-background";

export default defineBackground(() => {
	// @ts-expect-error
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

						const bgUrl = extractSteamProfileBg(htmlText);
						const frameUrl = extractSteamAvatarFrame(htmlText);
						console.log("[CSStats+] [Background] Steam profile bg:", bgUrl, "frame:", frameUrl);
						sendResponse({ bg: bgUrl, frame: frameUrl });
						return;
					} else {
						console.error("[CSStats+] [Background] Steam fetch returned non-200 status:", htmlRes.status, htmlRes.statusText);
					}

					sendResponse({ bg: null, frame: null });
				} catch (err) {
					console.error("[CSStats+] [Background] Error fetching Steam profile media:", err);
					sendResponse({ bg: null, frame: null, error: String(err) });
				}
			})();

			return true;
		}
	});
});

export function extractSteamProfileBg(htmlText: string): string | null {
	if (!htmlText) return null;

	const cleanUrl = (rawUrl: string): string => {
		return rawUrl
			.replace(/&quot;/g, "")
			.replace(/&apos;/g, "")
			.replace(/&#039;/g, "")
			.replace(/&amp;/g, "&")
			.trim();
	};

	const isAvatarOrFrame = (url: string): boolean => {
		const lower = url.toLowerCase();
		return (
			lower.includes("avatarframe") ||
			lower.includes("avatar_frame") ||
			lower.includes("profile_avatar") ||
			lower.includes("avatar_animated") ||
			lower.includes("animated_avatar") ||
			lower.includes("miniprofile") ||
			lower.includes("/frame.") ||
			lower.includes("_frame.")
		);
	};

	// 1. Check for animated video source (.webm or .mp4) inside a background/animated container
	//    This must come first so animated backgrounds are preferred over static poster images.
	const animatedVideoRegex = /(?:profile_animated_background|profile_background_holder|has_profile_background)[\s\S]{1,2000}?<source[^>]+src=["'](https:\/\/[^'"\s]+\/(?:community_assets\/)?images\/items\/[^'"\s]+\.(?:webm|mp4))["']/gi;
	let match: RegExpExecArray | null = animatedVideoRegex.exec(htmlText);
	while (match !== null) {
		if (match[1]) {
			const url = cleanUrl(match[1]);
			if (!isAvatarOrFrame(url)) {
				return url;
			}
		}
		match = animatedVideoRegex.exec(htmlText);
	}

	// 2. Check for background-image inside profile background container elements
	const containerRegex =
		/(?:profile_background_image_content|profile_background_holder|has_profile_background|profile_animated_background|profile_bg_item|profile_header_bg)[^>]*style=["'][^"']*background-image:\s*url\(\s*(?:&quot;|&#039;|['"'])?([^'"\)\s]+)(?:&quot;|&#039;|['"'])?\s*\)/gi;
	match = containerRegex.exec(htmlText);
	while (match !== null) {
		if (match[1]) {
			const url = cleanUrl(match[1]);
			if ((url.includes("/images/items/") || url.includes("/community_assets/images/items/")) && !isAvatarOrFrame(url)) {
				return url;
			}
		}
		match = containerRegex.exec(htmlText);
	}

	// Reverse attribute order: style before class
	const reverseContainerRegex =
		/style=["'][^"']*background-image:\s*url\(\s*(?:&quot;|&#039;|['"'])?([^'"\)\s]+)(?:&quot;|&#039;|['"'])?\s*\)[^"']*["'][^>]*class=["'][^"']*(?:profile_background_image_content|profile_background_holder|has_profile_background|profile_animated_background|profile_bg_item|profile_header_bg)/gi;
	match = reverseContainerRegex.exec(htmlText);
	while (match !== null) {
		if (match[1]) {
			const url = cleanUrl(match[1]);
			if ((url.includes("/images/items/") || url.includes("/community_assets/images/items/")) && !isAvatarOrFrame(url)) {
				return url;
			}
		}
		match = reverseContainerRegex.exec(htmlText);
	}

	// 3. General background-image url pointing to /images/items/
	const bgStyleRegex = /background-image:\s*url\(\s*(?:&quot;|&#039;|['"'])?(https:\/\/[^'"&\s)]+\/(?:community_assets\/)?images\/items\/[^'"&\s)]+)(?:&quot;|&#039;|['"'])?\s*\)/gi;
	match = bgStyleRegex.exec(htmlText);
	while (match !== null) {
		if (match[1]) {
			const url = cleanUrl(match[1]);
			if (!isAvatarOrFrame(url)) {
				return url;
			}
		}
		match = bgStyleRegex.exec(htmlText);
	}

	// 4. Video poster/src inside profile_animated_background container
	const animatedBgRegex = /class=["'][^"']*profile_animated_background[^"']*["'][\s\S]{1,500}?(?:poster|src)=["'](https:\/\/[^'"\s]+\/(?:community_assets\/)?images\/items\/[^'"\s]+)["']/gi;
	match = animatedBgRegex.exec(htmlText);
	while (match !== null) {
		if (match[1]) {
			const url = cleanUrl(match[1]);
			if (!isAvatarOrFrame(url)) {
				return url;
			}
		}
		match = animatedBgRegex.exec(htmlText);
	}

	return null;
}

export function extractSteamAvatarFrame(htmlText: string): string | null {
	if (!htmlText) return null;

	const cleanUrl = (rawUrl: string): string => {
		return rawUrl
			.replace(/&quot;/g, "")
			.replace(/&apos;/g, "")
			.replace(/&#039;/g, "")
			.replace(/&amp;/g, "&")
			.trim();
	};

	// Restrict search to header block before comments or friends
	let headerHtml = htmlText;
	const cutoffIndices = [
		htmlText.indexOf('class="profile_leftcol"'),
		htmlText.indexOf('class="profile_customization"'),
		htmlText.indexOf('class="commentthread"'),
		htmlText.indexOf('id="commentthread'),
	].filter((idx) => idx > 0);

	if (cutoffIndices.length > 0) {
		const minCutoff = Math.min(...cutoffIndices);
		if (minCutoff > 0) {
			headerHtml = htmlText.slice(0, minCutoff);
		}
	}

	const frameBlockMatch = headerHtml.match(/class=["'][^"']*profile_avatar_frame[^"']*["'][\s\S]{1,800}?<\/div>/i);
	if (frameBlockMatch) {
		const block = frameBlockMatch[0];

		// 1. Prefer the non-reduced-motion <source srcset> — this is the animated APNG version
		const allSources = Array.from(block.matchAll(/<source[^>]+>/gi));
		for (const sm of allSources) {
			const tag = sm[0];
			if (tag.includes("prefers-reduced-motion")) continue;
			const srcsetMatch = tag.match(/srcset=["'](https:\/\/[^'"\s]+)["']/i);
			if (srcsetMatch && srcsetMatch[1]) {
				const url = cleanUrl(srcsetMatch[1]);
				if (url.includes("/images/items/") || url.includes("/community_assets/images/items/")) {
					return url;
				}
			}
		}

		// 2. Fall back to <img src> (same file as non-reduced-motion on static frames)
		const imgMatch = block.match(/<img[^>]+src=["'](https:\/\/[^'"\s]+)["']/i);
		if (imgMatch && imgMatch[1]) {
			const url = cleanUrl(imgMatch[1]);
			if (url.includes("/images/items/") || url.includes("/community_assets/images/items/")) {
				return url;
			}
		}

		// 3. Last-resort: any src/srcset in the block
		const fallback = block.match(/(?:src|srcset)=["'](https:\/\/[^'"\s]+)["']/i);
		if (fallback && fallback[1]) {
			const url = cleanUrl(fallback[1]);
			if (url.includes("/images/items/") || url.includes("/community_assets/images/items/")) {
				return url;
			}
		}
	}

	return null;
}
