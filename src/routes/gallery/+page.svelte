<script lang="ts">
	import { loadModule, type SizeParams, Sketch, sketches, SketchRenderer } from 'sketches';
	import { onDestroy, onMount } from 'svelte';
	import { type Pool, pool, type WorkerPoolOptions } from 'workerpool';

	import { browser } from '$app/environment';
	import Flex from '$lib/components/Flex.svelte';
	import Grid from '$lib/components/Grid.svelte';
	import type { RenderResult } from '$lib/worker';
	// eslint-disable-next-line import/default
	import workerUrl from '$lib/worker?worker&url';

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
		const offscreenCanvasSupported =
			// eslint-disable-next-line compat/compat
			typeof OffscreenCanvas !== 'undefined' && new OffscreenCanvas(0, 0).getContext('webgl2');
		renderer = new SketchRenderer({ resizeCSS: false });
		renderer.canvas.style.width = '100%';
		workerpool = offscreenCanvasSupported ? pool(workerUrl, workerPoolOpts) : undefined;
		for (const [index, module] of sketches.entries()) {
			const sketchFactory = await loadModule(module);
			if (workerpool) {
				workerpool
					.exec('render', [module, thumbnailSizeParams])
					.catch((err) => console.log(err))
					.then((result: RenderResult) => {
						const sketch = new Sketch(sketchFactory, renderer, sizeParams, result.seed);
						const thumbnail = result.blob;
						loadedSketches[index] = { sketch, thumbnail, thumbnailResolution, module };
					});
			} else {
				const sketch = new Sketch(sketchFactory, renderer, thumbnailSizeParams);
				const thumbnail = await sketch.export();
				loadedSketches[index] = { sketch, thumbnail, thumbnailResolution, module };
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
	<div class="padding">
		<h1>This is my gallery :)</h1>
		<p>Some more text here text text text i love text</p>
		<div id="grid-container">
			<Grid items={sketches} let:index>
				{#if loadedSketches[index]}
					<SketchImage {...loadedSketches[index]} />
				{/if}
			</Grid>
		</div>
	</div>
</Flex>

<style>
	#grid-container {
		padding: 18px 0;
	}
</style>
