import { defineConfig } from "wxt";

const CHROMIUM_ARGS: string[] = [
	// Edge says it's not working anymore but it seems to still mitigate CloudFlare issues
	"--disable-blink-features=AutomationControlled",
];

// See https://wxt.dev/api/config.html
export default defineConfig({
	imports: false,
	modules: ["@wxt-dev/module-react"],
	srcDir: "src",
	webExt: {
		startUrls: ["https://csstats.gg/player/76561198088629896"],
		chromiumArgs: CHROMIUM_ARGS,
		keepProfileChanges: true,
	},
	manifest: {
		name: "CSStats+",
		browser_specific_settings: {
			gecko: {
				data_collection_permissions: {
					required: ["none"],
				},
			},
		},
	},
});
