import { launch } from 'puppeteer';

import Content from '../Content.svelte';

// SvelteKit doesn't export types for server-side components API, need to define it myself
type ServerSideComponent = {
	render(): { html: string; head: string; css: { code: string } };
};

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	const contentResult = (Content as unknown as ServerSideComponent).render();
	const browser = await launch({ headless: 'new' });
	const page = await browser.newPage();
	await page.setContent(`<html><head>${contentResult.head}</head><body>${contentResult.html}</body>`);
	await page.addStyleTag({ content: contentResult.css.code });
	const pdf = await page.pdf({ format: 'A4' });
	return new Response(pdf, { status: 200 });
}

// Enable prerendering of server endpoints for deploying with adapter-static
export const prerender = true;
