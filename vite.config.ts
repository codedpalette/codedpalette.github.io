import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import removeConsole from 'vite-plugin-remove-console';

export default defineConfig({
	plugins: [sveltekit(), removeConsole()]
});
