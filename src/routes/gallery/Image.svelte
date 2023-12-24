<script lang="ts">
	import type { SketchFactory } from 'sketches';
	import { Sketch } from 'sketches';
	import { onMount } from 'svelte';

	export let title: string;
	export let sketch: SketchFactory;
	let canvas: HTMLCanvasElement;

	const scaleFactor = 4;
	onMount(() => {
		new Sketch(sketch, {
			view: canvas,
			width: canvas.clientWidth * scaleFactor,
			height: canvas.clientHeight * scaleFactor,
			autoDensity: false
		}).run();
	});

	// TODO: Grow canvas
	// TODO: Image selection
</script>

<div>
	<canvas bind:this={canvas}></canvas>
	<h1>{title}</h1>
</div>

<style>
	canvas {
		background: lightblue;
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
