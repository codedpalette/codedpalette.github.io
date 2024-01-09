<script lang="ts">
	import { screensaver, Sketch, SketchRenderer, SketchRunner } from 'sketches';
	import { onMount } from 'svelte';

	import Flex from '$lib/components/Flex.svelte';
	import NavBar from '$lib/components/NavBar.svelte';

	let canvas: HTMLCanvasElement;

	onMount(() => {
		const backgroundColor = getComputedStyle(canvas).backgroundColor;
		const sizeParams = { width: canvas.clientWidth, height: canvas.clientHeight };
		const renderer = new SketchRenderer<HTMLCanvasElement>({ canvas, resizeCSS: false });
		const backgroundSketch = new Sketch(screensaver(backgroundColor), renderer, sizeParams);
		const runner = new SketchRunner(backgroundSketch, undefined, { clickable: false });
		runner.start();
		return () => {
			runner.stop();
			renderer.destroy();
		};
	});
</script>

<div id="container">
	<canvas id="background" bind:this={canvas}></canvas>
	<Flex width="wide">
		<div id="content-container">
			<div id="text-background"></div>
			<div id="text-container" class="padding">
				<h1>Hello, world</h1>
				<h2>my name is Daniel</h2>
				<h3>and I enjoy making computers display beautiful stuff</h3>
				<NavBar />
			</div>
		</div>
	</Flex>
</div>

<style>
	#container {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	#background {
		background: var(--black);
		width: 100%;
		height: 100%;
		position: fixed;
		z-index: -1;
	}

	#content-container {
		position: relative;
		color: var(--white);
		text-shadow: var(--black) 0px 0px 15px;
		font-family: sans-serif;
		text-align: center;
		text-transform: uppercase;
	}

	#text-background {
		position: absolute;
		width: 100%;
		height: 100%;
		background: var(--white);
		opacity: 0.1;
		transform: skewX(-5deg);
	}

	#text-container {
		position: relative;
	}

	/* TODO Responsive font size (@media) */
	h1 {
		font-family: monospace;
		font-size: 8em;
	}
	h2 {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		font-size: 4em;
		margin: 0px;
	}
	h3 {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		font-size: 2em;
		margin-top: 0.5em;
	}
</style>
