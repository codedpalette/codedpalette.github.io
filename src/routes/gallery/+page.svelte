<script lang="ts">
	import { loadModule, type SizeParams, Sketch, sketches, SketchRenderer } from 'sketches';
	import { onDestroy, onMount } from 'svelte';
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
	import SketchImage, { type LoadedSketch } from './SketchImage.svelte';

	let renderer: SketchRenderer<HTMLCanvasElement>;
	let workerpool: Pool | undefined;
	const loadedSketches: LoadedSketch[] = [];
	const sizeParams: SizeParams = { width: 1200, height: 1200 };
	const thumbnailResolution = 1 / 2;
	const thumbnailSizeParams: SizeParams = { ...sizeParams, resolution: thumbnailResolution };
	const workerPoolOpts: WorkerPoolOptions = {
		maxWorkers: 3,
		workerOpts: {
			// By default, Vite uses a module worker in dev mode, which can cause your application to fail.
			// Therefore, we need to use a module worker in dev mode and a classic worker in prod mode.
			type: import.meta.env.PROD ? undefined : 'module'
		}
	};

	onMount(async () => {
		// eslint-disable-next-line compat/compat
		const ofcSupported = typeof OffscreenCanvas !== 'undefined' && new OffscreenCanvas(0, 0).getContext('webgl2');
		renderer = new SketchRenderer({ resizeCSS: false });
		renderer.canvas.style.width = '100%';
		workerpool = ofcSupported ? pool(workerUrl, workerPoolOpts) : undefined;
		for (const [index, module] of sketches.entries()) {
			const sketchFactory = await loadModule(module);
			try {
				let sketch: Sketch<HTMLCanvasElement>, thumbnail: Blob;
				if (workerpool) {
					const result = (await workerpool.exec('render', [module, thumbnailSizeParams])) as RenderResult;
					sketch = new Sketch(sketchFactory, renderer, sizeParams, result.seed);
					thumbnail = result.blob;
				} else {
					sketch = new Sketch(sketchFactory, renderer, thumbnailSizeParams);
					thumbnail = await sketch.export();
				}
				loadedSketches[index] = { sketch, thumbnail, thumbnailResolution, module };
			} catch (err) {
				console.log(err);
				trackError(err);
			}
		}
	});

	onDestroy(() => {
		if (browser) {
			renderer.destroy();
			workerpool?.terminate();
		}
	});
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
		{#if loadedSketches.length == 0}
			<div id="loader-container">
				<Loader />
			</div>
		{:else}
			<div id="grid-container">
				<Grid items={sketches} let:index>
					{#if loadedSketches[index]}
						<SketchImage {...loadedSketches[index]} />
					{:else}
						<div class="placeholder"></div>
					{/if}
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

	.placeholder {
		visibility: hidden;
		width: 300px;
		height: 400px;
	}
</style>
