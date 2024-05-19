import { sveltekit } from '@sveltejs/kit/vite';
import electron from 'vite-plugin-electron/simple';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		electron({
			main: {
				// Shortcut of `build.lib.entry`
				entry: 'electron/main.ts'
			},
			preload: {
				// Shortcut of `build.rollupOptions.input`
				input: 'electron/preload.ts'
			},
			// Optional: Use Node.js API in the Renderer process
			renderer: {}
		})
	]
});
