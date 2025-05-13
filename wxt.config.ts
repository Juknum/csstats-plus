import { resolve } from 'node:path';
import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  srcDir: 'src',
  webExt: {
    chromiumProfile: resolve('.wxt/chrome-data'),
    keepProfileChanges: true,
  },
});
