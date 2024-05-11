<script lang="ts">
	import {
		initRenderer,
		loadModule,
		type SizeParams,
		type Sketch,
		sketches,
		type SketchModule,
		type SketchRenderer
	} from 'sketches';
	import { type ComponentProps, onDestroy, onMount } from 'svelte';
	import { type Pool, pool, type WorkerPoolOptions } from 'workerpool';

	import { browser } from '$app/environment';
	import { trackError } from '$lib/analytics';
	import Flex from '$lib/components/Flex.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import type { RenderResult } from '$lib/worker';
	// eslint-disable-next-line import/default
	import workerUrl from '$lib/worker?worker&url';

	import Grid from './Grid.svelte';
	import Loader from './Loader.svelte';
	import SketchComponent from './SketchComponent.svelte';

	let renderer: SketchRenderer<HTMLCanvasElement>;
	let workerpool: Pool | undefined;
	const sketchContents: ComponentProps<SketchComponent>['content'][] = [];
	const workerPoolOpts: WorkerPoolOptions = { maxWorkers: 3, workerOpts: { type: 'module' } };
	const sizeParams: SizeParams = { width: 1200, height: 1200 };

	onMount(async () => {
		const webpFormat = 'image/webp';
		const webpSupported = document.createElement('canvas').toDataURL(webpFormat).indexOf(`data:${webpFormat}`) == 0;
		const imageFormat = webpSupported ? webpFormat : undefined;
		// eslint-disable-next-line compat/compat
		const ofcSupported = typeof OffscreenCanvas !== 'undefined' && new OffscreenCanvas(0, 0).getContext('webgl2');
		workerpool = ofcSupported ? pool(workerUrl, workerPoolOpts) : undefined;
		renderer = await initRenderer({ resizeCSS: false });
		for (const [index, module] of sketches.entries()) {
			renderModule(index, module, renderer, workerpool, imageFormat);
		}
	});

	onDestroy(() => {
		if (browser) {
			renderer?.destroy();
			workerpool?.terminate();
		}
	});

	async function renderModule(
		index: number,
		module: SketchModule,
		renderer: SketchRenderer<HTMLCanvasElement>,
		workerpool?: Pool,
		format?: string
	) {
		try {
			let sketch: Sketch, thumbnail: Blob;
			if (workerpool) {
				const { blob, seed } = (await workerpool.exec('render', [module, sizeParams, format])) as RenderResult;
				sketch = (await loadModule(module))(renderer, { ...sizeParams, seed });
				thumbnail = blob;
			} else {
				sketch = (await loadModule(module))(renderer, sizeParams);
				thumbnail = await sketch.export({ format });
			}
			sketch.canvas.style.width = '100%';
			sketchContents[index] = { sketch, thumbnail, format };
			if (sketchContents.length == sketches.length) {
				workerpool?.terminate();
			}
		} catch (err) {
			console.log(err);
			trackError(err);
		}
	}
</script>

<Flex stretch width="wide">
	<NavBar />
	<div id="content">
		<h1>Generative artworks</h1>
		<p id="sub-heading">Explore the gallery to discover a collection of generative artworks.</p>
		<p>
			Click on any piece for a fullscreen view with a unique variation on each click. Return to the gallery by clicking
			outside or scrolling.
		</p>
		<p>
			Be sure to check out the GitHub links for the source code to learn how I create these interactive web graphics!
		</p>
		{#if sketchContents.length == 0}
			<div id="loader-container">
				<Loader />
			</div>
		{:else}
			<div id="grid-container">
				<Grid items={sketches} let:item let:index>
					<SketchComponent module={item} content={sketchContents[index]} />
				</Grid>
			</div>
		{/if}
	</div>
</Flex>

<style lang="scss">
	#sub-heading {
		font-size: $font-size-xlarge;
	}

	p {
		margin-block: 0.5rem;
		font-size: $font-size-large;
	}

	#content {
		padding: $padding-container;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	#loader-container {
		margin: auto;
	}

	#grid-container {
		padding: $padding-container * 2 0;
	}

	h1 {
		font-family: $heading-font-family;
		font-size: $header-name-font-size;
		margin: 0;
		line-height: 1em;
	}
</style>
