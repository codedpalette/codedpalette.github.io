<script lang="ts">
	import { loadModule, type SizeParams, Sketch, type SketchModule, SketchRenderer } from 'sketches';
	import { onMount, tick } from 'svelte';
	import type { Pool } from 'workerpool';

	export let sketchModule: SketchModule;
	export let renderer: Pool | SketchRenderer;
	let canvas: HTMLCanvasElement;
	let container: HTMLDivElement;
	let ready = false;

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
		ready = true;
		container.style.visibility = 'visible';
	});

	// TODO: Image selection, grow canvas with overlay
	// TODO: Canvas downsampling
</script>

<div bind:this={container} class={ready ? 'animated' : ''}>
	<canvas bind:this={canvas}></canvas>
	<h1>{sketchModule.name}</h1>
</div>

<style>
	canvas {
		width: 100%;
		aspect-ratio: 1/1;
	}

	div {
		transition: scale 0.5s;
		visibility: hidden;
		text-align: center;
		padding: 9px;
		font-family: sans-serif;
	}

	div:hover {
		scale: 1.1;
	}

	@keyframes fadeInUp {
		0% {
			opacity: 0;
			transform: translate3d(0, 200px, 0);
		}
		50% {
			transform: translate3d(0, 0, 0);
			opacity: 1;
			border: none;
			box-shadow: none;
		}
		100% {
			border-radius: 10px;
			box-shadow:
				-10px -10px 20px #aeadaa,
				10px 10px 20px #ffffff;
		}
	}

	.animated {
		animation: fadeInUp 2s forwards;
	}
</style>
