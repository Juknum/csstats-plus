import { defineConfig } from 'vite';

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
});