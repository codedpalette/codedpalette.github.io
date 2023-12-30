<script lang="ts">
	import Flex from '$lib/components/Flex.svelte';
	import Image from './Image.svelte';
	import { SketchRenderer, sketches } from 'sketches';
	import { pool, type Pool } from 'workerpool';
	import workerUrl from '$lib/worker?worker&url';
	import { onDestroy, onMount } from 'svelte';

	let renderer: Pool | SketchRenderer;
	onMount(() => {
		const offscreenCanvasSupported = !!HTMLCanvasElement.prototype.transferControlToOffscreen;
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
	<div id="gallery">
		{#each sketches as sketchModule}
			<div class="image-container">
				<Image {sketchModule} {renderer}></Image>
			</div>
		{/each}
	</div>
</Flex>

<style>
	#gallery {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}
	.image-container {
		/* flex-grow: 1; */ /* TODO: Grow to the size of column */
		padding: 9px;
		/* flex-basis: 300px; */
	}
</style>
