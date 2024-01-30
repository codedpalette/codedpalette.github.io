<script lang="ts">
	import { screensaver, Sketch, SketchRenderer, SketchRunner } from 'sketches';
	import { onDestroy, onMount } from 'svelte';

	import { browser } from '$app/environment';
	import Flex from '$lib/components/Flex.svelte';
	import NavBar from '$lib/components/NavBar.svelte';

	let canvas: HTMLCanvasElement;
	let renderer: SketchRenderer<HTMLCanvasElement>;
	let runner: SketchRunner;

	onMount(async () => {
		const sizeParams = { width: canvas.clientWidth, height: canvas.clientHeight };
		renderer = new SketchRenderer<HTMLCanvasElement>({ canvas, resizeCSS: false, antialias: false });

		const backgroundColor = getComputedStyle(canvas).backgroundColor;
		const backgroundSketch = new Sketch(await screensaver(backgroundColor), renderer, sizeParams);
		runner = new SketchRunner(backgroundSketch, undefined);
		runner.start();
	});

	onDestroy(() => {
		if (browser) {
			runner?.stop();
			renderer?.destroy();
		}
	});
</script>

<div id="container">
	<canvas id="background" bind:this={canvas}></canvas>
	<Flex width="narrow">
		<div id="content-container">
			<div id="text-container">
				<h1>Hello world</h1>
				<h2>my name is Daniel</h2>
				<h3>and I enjoy making computers display beautiful stuff</h3>
				<NavBar mainPage />
			</div>
		</div>
	</Flex>
</div>

<style lang="scss">
	@use 'sass:color';

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
	}

	#content-container {
		position: relative;
		color: $white;
		text-shadow: $black 0 0 10px;
		text-align: center;
		text-transform: uppercase;
	}

	#text-container {
		position: relative;
		padding: $padding-container;
		background-color: color.change($black, $alpha: 0.8);
		border-radius: 20px;

		@media (max-width: 550px) {
			margin: 0 5px;
		}
	}

	h1 {
		font-family: monospace;
		font-size: min(4em, 12vw);
	}

	h2 {
		font-size: min(2em, 8vw);
		margin: 0;
	}

	h3 {
		font-size: min(1.17em, 4vw);
		margin-top: 0.5em;
	}
</style>
