import { defineConfig } from "wxt";
import os from "node:os";

const CHROMIUM_ARGS: string[] = [
	// Edge says it's not working anymore but it seems to still mitigate CloudFlare issues
	"--disable-blink-features=AutomationControlled",
];

switch (os.platform()) {
	case "darwin":
		CHROMIUM_ARGS.push(`--user-data-dir=${os.homedir()}/Library/Application Support/Microsoft Edge`);
		break;
	case "win32":
		CHROMIUM_ARGS.push(`--user-data-dir='C:\\Users\\${process.env.USERNAME}\\AppData\\Local\\Microsoft\\Edge\\User Data'`);
		break;
}

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
	webExt: {
		startUrls: ["https://csstats.gg/player/76561198088629896"],
		chromiumArgs: CHROMIUM_ARGS,
		keepProfileChanges: true,
		binaries: EDGE_BIN_PATH !== undefined ? { edge: EDGE_BIN_PATH } : undefined,
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
