import type { MetaTagsProps } from 'svelte-meta-tags';

import { base } from '$app/paths';

export const prerender = true;

export const load = ({ url }) => {
	const baseMetaTags: MetaTagsProps = {
		title: 'Home',
		description: 'Hello world! My name is Daniel, and I enjoy making computers display beautiful stuff.',
		titleTemplate: 'codepalette · %s',
		canonical: new URL(url.pathname, url.origin).href,
		openGraph: {
			type: 'website',
			images: [
				{
					url: `${base}/avatar.png`,
					width: 1000,
					height: 1000,
					type: 'image/png'
				}
			]
		}
	};

	return {
		baseMetaTags
	};
};
