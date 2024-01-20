import { launch } from 'puppeteer';

import layout from '../../+layout.svelte';
import Content from '../Content.svelte';

// SvelteKit doesn't export types for server-side components API, need to define it myself
type ServerSideComponent = {
	render(): { html: string; head: string; css: { code: string } };
};

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	const layoutRender = (layout as unknown as ServerSideComponent).render();
	const contentRender = (Content as unknown as ServerSideComponent).render();
	const browser = await launch({ headless: 'new' });
	const page = await browser.newPage();
	await page.setContent(
		`<html>
			<head>
				${layoutRender.head}
				${contentRender.head}
				<style type='text/css'>
					${layoutRender.css.code}
					${contentRender.css.code}
				</style>
			</head>
			<body>
				${contentRender.html}
			</body>
		</html>`,
		{ waitUntil: 'networkidle0' }
	);
	const pdf = await page.pdf({ format: 'A4' });
	return new Response(pdf, { status: 200 });
}

// Enable prerendering of server endpoints for deploying with adapter-static
export const prerender = true;
