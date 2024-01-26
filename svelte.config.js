import adapter from '@sveltejs/adapter-static';
import sveltePreprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: sveltePreprocess({
		scss: {
			prependData: "@use 'variables' as *;",
			includePaths: ['src/lib/styles']
		}
	}),
	// See https://kit.svelte.dev/docs/adapters for more information about adapters.
	kit: {
		adapter: adapter(),
		inlineStyleThreshold: 1000
	}
};

export default config;
