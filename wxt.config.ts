import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  imports: false,
  modules: ['@wxt-dev/module-react'],
  srcDir: 'src',
  webExt: {
    startUrls: ['https://csstats.gg/player/76561198088629896'],
    chromiumArgs: [
      // TODO: Make it compatible with MacOS/Linux
      `--user-data-dir='C:\\Users\\${process.env.USERNAME}\\AppData\\Local\\Google\\Chrome\\User Data'`, 
      // Edge v143.0.3650.28 says it's not working anymore but it seems to still mitigate CloudFlare issues
      "--disable-blink-features=AutomationControlled"
    ],
    keepProfileChanges: true,
    binaries: {
      edge: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    }
  },
  manifest: {
    browser_specific_settings: {
      gecko: {
        // @ts-ignore - WXT doesn't support this field yet but is required by Firefox
        // @see https://github.com/wxt-dev/wxt/pull/1976
        data_collection_permissions: {
          required: ['none']
        }
      }
    }
  }
});
