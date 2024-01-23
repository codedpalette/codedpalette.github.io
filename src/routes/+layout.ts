import type { MetaTagsProps } from 'svelte-meta-tags';

import { base } from '$app/paths';

export const prerender = true;

export const load = ({ url }) => {
	const link = new URL(url.pathname, url.origin).href;
	const description = 'Home description';
	const baseMetaTags: MetaTagsProps = {
		title: 'Home',
		description,
		titleTemplate: 'codepalette · %s',
		canonical: link,
		openGraph: {
			type: 'website',
			url: link,
			title: 'codepalette',
			description,
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
