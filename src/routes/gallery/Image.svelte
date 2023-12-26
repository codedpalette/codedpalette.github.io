<script lang="ts">
	import type { SketchFactory } from 'sketches';
	import { Sketch } from 'sketches';
	import { onMount } from 'svelte';

	export let title: string;
	export let sketch: SketchFactory;
	let view: HTMLCanvasElement;

	const resolution = 4;
	onMount(() => {
		new Sketch(sketch, {
			view,
			resolution,
			scaleBbox: true,
			resizeCSS: false,
			clickable: false
		}).run();
	});

	// TODO: Grow canvas
	// TODO: Image selection
</script>

<div>
	<canvas bind:this={view}></canvas>
	<h1>{title}</h1>
</div>

<style lang="scss">
	$canvas-dim: 300px;

	canvas {
		width: $canvas-dim;
		height: $canvas-dim;
		margin: 9px;
	}
	div {
		border: 1px solid black;
		text-align: center;
		justify-content: center;
	}
</style>
