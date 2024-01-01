<script lang="ts">
	import { loadModule, type SizeParams, Sketch, type SketchModule, SketchRenderer } from 'sketches';
	import { onMount, tick } from 'svelte';
	import type { Pool } from 'workerpool';

	export let sketchModule: SketchModule;
	export let renderer: Pool | SketchRenderer;
	let canvas: HTMLCanvasElement;
	let container: HTMLDivElement;

	const scale = 4;
	onMount(async () => {
		await tick(); // Waiting for parent component to initialize renderer
		const params: SizeParams = {
			width: canvas.clientWidth * scale,
			height: canvas.clientHeight * scale
		};
		Object.assign(canvas, params);
		if (renderer instanceof SketchRenderer) {
			const sketchFactory = await loadModule(sketchModule);
			const sketch = new Sketch(sketchFactory, renderer, params);
			sketch.render(canvas);
		} else {
			const result = (await renderer
				.exec('render', [sketchModule, params])
				.catch((error) => console.log(error))) as ImageBitmap;
			const ctx = canvas.getContext('2d');
			ctx?.drawImage(result, 0, 0);
		}
		container.style.visibility = 'visible';
	});

	// TODO: Image selection, grow canvas with overlay
	// TODO: Appearance animation
</script>

<div bind:this={container}>
	<canvas bind:this={canvas}></canvas>
	<h1>{sketchModule.name}</h1>
</div>

<style>
	canvas {
		width: 100%;
		aspect-ratio: 1/1;
	}

	div {
		visibility: hidden;
		border: 1px solid black;
		text-align: center;
		padding: 9px;
	}
</style>
