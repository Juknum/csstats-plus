import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
	build: {
		outDir: 'dist',
		rollupOptions: {
			input: 'src/index.ts',
			output: {
				format: 'iife',
				entryFileNames: '[name].js',
			},
		},
	},
	plugins: [
		viteStaticCopy({
			targets: [
				{ src: 'src/assets/*.css', dest: '' },
				{ src: 'src/assets/*.json', dest: '' },
			],
		}),
	],
});