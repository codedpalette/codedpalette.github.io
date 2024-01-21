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
	<Flex width="narrow">
		<div id="content-container">
			<div id="text-background"></div>
			<div id="text-container">
				<h1>Hello, world</h1>
				<h2>my name is Daniel</h2>
				<h3>and I enjoy making computers display beautiful stuff</h3>
				<NavBar />
			</div>
		</div>
	</Flex>
</div>

<style lang="scss">
	#container {
		width: 100%;
		height: 100%;
		// False positive: partial support refers to not supporting the `clip` value
		// Root cause fix: https: //github.com/anandthakker/doiuse/pull/160
		/* stylelint-disable-next-line plugin/no-unsupported-browser-features */
		overflow: hidden;
	}

	#background {
		background: rgb(43 45 48);
		width: 100%;
		height: 100%;
		position: fixed;
		z-index: -1;
	}

	#content-container {
		position: relative;
		color: $white;
		text-shadow: $black 0 0 10px;
		text-align: center;
		text-transform: uppercase;
	}

	#text-background {
		position: absolute;
		width: 100%;
		height: 100%;
		background: $black;
		opacity: 0.2;
	}

	#text-container {
		position: relative;
		padding: $padding-container;
	}

	// TODO: Responsive font

	h1 {
		font-family: monospace;
		font-size: 4em;
	}

	h2 {
		font-size: 2em;
		margin: 0;
	}

	h3 {
		margin-top: 0.5em;
	}
</style>
