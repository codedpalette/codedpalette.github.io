# personal-website

My personal website, built with [Svelte](https://svelte.dev/)/[SvelteKit](https://kit.svelte.dev/). I use it to display my [generative artworks](https://github.com/codedpalette/sketches), offloading rendering to a [Web Workers pool](/src/lib/worker.ts). It can also dynamically build my resume from [JSON representation](/src/routes/about/resume.json) to [HTML](src/routes/about/Resume.svelte) and [PDF](/src/routes/about/resume.pdf/+server.ts).

## Developing

Once you've installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run start
```

The website wil automatically open in a new tab.

## Building

To create a production version of the website:

```bash
npm run build
```

You can preview the production build with `npm run preview`.
