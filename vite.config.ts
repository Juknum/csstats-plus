import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
	build: {
		outDir: 'dist',
		rollupOptions: {
			input: 'src/contentScript.tsx',
			output: {
				format: 'iife',
				entryFileNames: '[name].js',
			},
		},
	},
	plugins: [
		viteStaticCopy({
			targets: [
				{ src: 'manifest.json', dest: '' },
				{ src: 'src/assets/icons/*.png', dest: 'icons' },
			],
		}),
	],
});