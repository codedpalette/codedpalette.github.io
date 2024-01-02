<script lang="ts">
	import { sketches, SketchRenderer } from 'sketches';
	import { onMount } from 'svelte';
	import { type Pool, pool } from 'workerpool';

	import Flex from '$lib/components/Flex.svelte';
	import Grid from '$lib/components/Grid.svelte';
	// eslint-disable-next-line import/default
	import workerUrl from '$lib/worker?worker&url';

	import Image from './Image.svelte';

	let renderer: Pool | SketchRenderer;
	onMount(() => {
		const offscreenCanvasSupported =
			// eslint-disable-next-line compat/compat
			typeof OffscreenCanvas !== 'undefined' && new OffscreenCanvas(0, 0).getContext('webgl2');
		renderer = offscreenCanvasSupported
			? pool(workerUrl, {
					maxWorkers: 3,
					workerOpts: {
						// By default, Vite uses a module worker in dev mode, which can cause your application to fail.
						// Therefore, we need to use a module worker in dev mode and a classic worker in prod mode.
						type: import.meta.env.PROD ? undefined : 'module'
					}
				})
			: new SketchRenderer();
		return () => (renderer instanceof SketchRenderer ? renderer.destroy() : renderer.terminate());
	});
</script>

<Flex stretch width="wide">
	<h1>This is my gallery :)</h1>
	<p>Some more text here text text text i love text</p>
	<Grid items={sketches} let:item>
		<Image sketchModule={item} {renderer}></Image>
	</Grid>
</Flex>
