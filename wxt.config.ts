import { defineConfig } from "wxt";
import os from "node:os";
import tailwindcss from "@tailwindcss/vite";

const CHROMIUM_ARGS: string[] = [
	// Edge says it's not working anymore but it seems to still mitigate CloudFlare issues
	"--disable-blink-features=AutomationControlled",
];

const EDGE_BIN_PATH = (() => {
	switch (os.platform()) {
		case "win32":
			return "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
		case "darwin":
			return "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge";
		default:
			return undefined;
	}
})();

// See https://wxt.dev/api/config.html
export default defineConfig({
	imports: false,
	modules: ["@wxt-dev/module-react"],
	srcDir: "src",
	vite: () => ({
		plugins: [tailwindcss()],
	}),
	webExt: {
		startUrls: ["https://csstats.gg/player/76561198088629896"],
		chromiumArgs: CHROMIUM_ARGS,
		keepProfileChanges: true,
		...(EDGE_BIN_PATH ? { binaries: { edge: EDGE_BIN_PATH } } : {}),
	},
	manifest: {
		name: "CSStats+",
		permissions: ["storage"],
		host_permissions: ["https://steamcommunity.com/*", "https://*.steamstatic.com/*"],
		browser_specific_settings: {
			gecko: {
				id: "{ee7678f1-9717-47cd-81e1-12ebe567fe2e}",
				data_collection_permissions: {
					required: ["none"],
				},
			},
			gecko_android: {
				strict_min_version: "120.0",
			},
		},
	},
});
