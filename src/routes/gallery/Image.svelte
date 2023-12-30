<script lang="ts">
	import { loadModule, type SizeParams, Sketch, type SketchModule, SketchRenderer } from 'sketches';
	import { onMount, tick } from 'svelte';
	import type { Pool } from 'workerpool';

	export let sketchModule: SketchModule;
	export let renderer: Pool | SketchRenderer;
	let canvas: HTMLCanvasElement;

	const scale = 4;
	onMount(async () => {
		await tick(); // Waiting for parent component to initialize renderer
		const params: SizeParams = {
			width: canvas.clientWidth * scale,
			height: canvas.clientHeight * scale
		};
		if (renderer instanceof SketchRenderer) {
			const sketchFactory = await loadModule(sketchModule);
			const sketch = new Sketch(sketchFactory, renderer, params);
			sketch.render(canvas);
		} else {
			const offscreen = canvas.transferControlToOffscreen();
			renderer
				.exec('render', [sketchModule, offscreen, params], { transfer: [offscreen] })
				.catch((error) => console.log(error));
		}
	});

	// TODO: Grow canvas
	// TODO: Image selection
	// TODO: Appearance animation
</script>

<div>
	<canvas bind:this={canvas}></canvas>
	<h1>{sketchModule.name}</h1>
</div>

<style>
	canvas {
		width: 300px;
		height: 300px;
		margin: 9px;
	}
	div {
		border: 1px solid black;
		text-align: center;
		justify-content: center;
	}
</style>
