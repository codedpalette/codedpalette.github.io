<script lang="ts">
	import { loadModule, type SizeParams, Sketch, type SketchModule, SketchRenderer } from 'sketches';
	// Because of this bug https://github.com/import-js/eslint-plugin-import/issues/1479
	/* eslint-disable import/no-duplicates */
	import { onMount, tick } from 'svelte';
	import { fade } from 'svelte/transition';
	/* eslint-enable import/no-duplicates */
	import type { Pool } from 'workerpool';

	export let sketchModule: SketchModule;
	export let renderer: SketchRenderer;
	export let workerpool: Pool | undefined = undefined;
	let canvas: HTMLCanvasElement;
	let container: HTMLDivElement;
	let ready = false; // Finished rendering
	let zoomed = false;

	const scaleFactor = 4; // Scaling of sketch model space relative to canvas's css size
	onMount(async () => {
		await tick(); // Waiting for parent component to initialize renderer
		const params: SizeParams = {
			width: canvas.clientWidth * scaleFactor,
			height: canvas.clientHeight * scaleFactor,
			resolution: 1 / scaleFactor
		};
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
		if (workerpool) {
			await renderAsync(workerpool, params);
		} else {
			await renderSync(params);
		}
		ready = true;
		container.style.visibility = 'visible';
	});

	async function renderSync(params: SizeParams) {
		const sketchFactory = await loadModule(sketchModule);
		const sketch = new Sketch(sketchFactory, renderer, params);
		sketch.render(canvas);
	}

	async function renderAsync(workerpool: Pool, params: SizeParams) {
		const result = await workerpool
			.exec('render', [sketchModule, params])
			.catch((err) => console.log(err));
		const ctx = canvas.getContext('2d');
		ctx?.drawImage(result, 0, 0);
	}

	function zoomIn() {
		const margin = 18; //px
		const viewportWidth = document.documentElement.clientWidth - margin * 2;
		const viewportHeight = document.documentElement.clientHeight - margin * 2;

		const naturalWidth = canvas.clientWidth * scaleFactor;
		const naturalHeight = canvas.clientHeight * scaleFactor;
		const { width, height, top, left } = canvas.getBoundingClientRect();

		const scaleX = Math.min(naturalWidth, viewportWidth) / width;
		const scaleY = Math.min(naturalHeight, viewportHeight) / height;
		const scale = Math.min(scaleX, scaleY);

		const translateX = (-left + (viewportWidth - width) / 2 + margin) / scale;
		const translateY = (-top + (viewportHeight - height) / 2 + margin) / scale;

		zoomed = true;
		canvas.style.transform = `scale(${scale}) translate3d(${translateX}px, ${translateY}px, 0)`;
		container.classList.add('zoomed');
		document.addEventListener('scroll', zoomOut);
		// TODO: SketchRunner
	}

	function zoomOut() {
		document.removeEventListener('scroll', zoomOut);
		canvas.style.transform = 'none';
		zoomed = false;
		const onZoomOutEnd = () => {
			container.classList.remove('zoomed');
			canvas.removeEventListener('transitionend', onZoomOutEnd);
		};
		canvas.addEventListener('transitionend', onZoomOutEnd);
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div bind:this={container} class="container" class:ready on:click={() => !zoomed && zoomIn()}>
	{#if zoomed}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="overlay" transition:fade on:click|stopPropagation={zoomOut}></div>
	{/if}
	<canvas bind:this={canvas}></canvas>
	<h1>{sketchModule.name}</h1>
</div>

<style>
	.container {
		visibility: hidden;
		text-align: center;
		padding: 9px;
		font-family: sans-serif;
		transition: scale 400ms;
	}

	/** Add z-index to grid item container to make it's stacking context display over other grid cells */
	:global(div:has(> .container.zoomed)) {
		z-index: 2;
	}

	/** Using :is() selector so that Svelte won't remove "unused" css since we're adding class imperatively */
	.container:is(.zoomed) {
		/** Until hovered container has scale property set, the overlay won't be positioned relative to viewport
				We need it to transition to "none" faster than overlay is transitioning to opacity: 1 */
		transition: scale 50ms;
	}

	.container:not(.zoomed):hover {
		cursor: zoom-in;
		scale: 1.1;
	}

	.ready {
		animation: fadeInUp 2s forwards;
	}

	.overlay {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: #fff;
		cursor: zoom-out;
	}

	canvas {
		width: 100%;
		aspect-ratio: 1/1;
		transition: transform 400ms;
	}

	@keyframes fadeInUp {
		0% {
			opacity: 0;
			transform: translate3d(0, 200px, 0);
		}
		50% {
			transform: none;
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
</style>
