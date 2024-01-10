<script context="module" lang="ts">
	export type LoadedSketch = {
		sketch: Sketch<HTMLCanvasElement>;
		thumbnail: Blob;
		thumbnailResolution: number;
		module: SketchModule;
	};
</script>

<script lang="ts">
	import { type Sketch, type SketchModule, SketchRunner } from 'sketches';
	// Because of this bug https://github.com/import-js/eslint-plugin-import/issues/1479
	/* eslint-disable import/no-duplicates */
	import { onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	/* eslint-enable import/no-duplicates */

	export let sketch: Sketch<HTMLCanvasElement>;
	export let thumbnail: Blob;
	export let module: SketchModule;
	export let thumbnailResolution: number;

	$: runner = new SketchRunner(sketch);
	$: ready = thumbnail !== undefined;
	$: thumbnailUrl = thumbnail ? URL.createObjectURL(thumbnail) : undefined;
	let thumbnailImg: HTMLImageElement;
	let container: HTMLDivElement;
	let imageContainer: HTMLDivElement;
	let zoomed = false;

	onDestroy(() => thumbnailUrl && URL.revokeObjectURL(thumbnailUrl));

	async function zoomIn() {
		const margin = 18; //px
		const viewportWidth = document.documentElement.clientWidth - margin * 2;
		const viewportHeight = document.documentElement.clientHeight - margin * 2;
		const { width: naturalWidth, height: naturalHeight } = sketch.params;
		const { width, height, top, left } = thumbnailImg.getBoundingClientRect();

		const scaleX = Math.min(naturalWidth, viewportWidth) / width;
		const scaleY = Math.min(naturalHeight, viewportHeight) / height;
		const scale = Math.min(scaleX, scaleY);
		const translateX = (-left + (viewportWidth - width) / 2 + margin) / scale;
		const translateY = (-top + (viewportHeight - height) / 2 + margin) / scale;

		zoomed = true;
		container.classList.add('zoomed');
		imageContainer.style.transform = `scale(${scale}) translate3d(${translateX}px, ${translateY}px, 0)`;

		// This needs to be higher than scale transition to none on zoomed container
		// to let browser update layout
		const renderDelay = 100;
		setTimeout(() => {
			// runner.start potentially has to initialize sketch, which is a long lasting operations
			// using setTimeout here to let css animation start
			runner.start();
			imageContainer.appendChild(sketch.renderer.canvas);
			thumbnailImg.style.display = 'none';
		}, renderDelay);
	}

	async function zoomOut() {
		imageContainer.style.transform = 'none';
		zoomed = false;

		runner.stop();
		await updateThumbnail();
		thumbnailImg.style.display = 'inline';
		imageContainer.removeChild(sketch.renderer.canvas);
	}

	async function updateThumbnail() {
		sketch.resize({ resolution: thumbnailResolution });
		thumbnail = await sketch.export();
		sketch.resize({ resolution: 1 });
	}
</script>

<svelte:document on:scroll={() => zoomed && zoomOut()} />
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div bind:this={container} class="container" class:ready on:click={() => !zoomed && zoomIn()}>
	{#if zoomed}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="overlay" transition:fade on:click|stopPropagation={zoomOut}></div>
	{/if}
	<div
		bind:this={imageContainer}
		class="image-container"
		on:transitionend={() => !zoomed && container.classList.remove('zoomed')}
	>
		<img bind:this={thumbnailImg} src={thumbnailUrl} alt={module.name} />
	</div>
	<h1>{module.name}</h1>
	<a
		href={`https://github.com/monkeyroar/sketches/blob/master/sketches/${module.year}/${module.name}.ts`}
		target="_blank"
		on:click|stopPropagation
	>
		link to sources
	</a>
</div>

<style>
	.container {
		position: relative;
		visibility: hidden;
		text-align: center;
		padding: 9px;
		font-family: sans-serif;
		transition: scale 400ms;
	}

	.container.ready {
		visibility: visible;
		animation: ease-in-out fadeInUp 0.5s;
	}

	.container::after {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: -1;
		opacity: 0;
		border-radius: 10px;
		box-shadow:
			-10px -10px 20px #aeadaa,
			10px 10px 20px #ffffff;
	}

	.container.ready::after {
		animation: border 0.5s 0.5s forwards;
	}

	/** Add z-index to grid item container to make it's stacking context display over other grid cells */
	:global(div:has(> .container.zoomed)) {
		z-index: 1;
	}

	/** Using :is() selector so that Svelte won't remove "unused" css since we're adding class imperatively */
	.container:is(.zoomed) {
		/** Until hovered container has scale property set, the overlay won't be positioned relative to viewport
				We need it to transition to "none" faster than overlay is transitioning to opacity: 1 */
		transition: scale 50ms;
		transform: none;
	}

	.container:not(.zoomed):hover {
		cursor: zoom-in;
		scale: 1.1;
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

	.image-container {
		position: relative;
		transition: transform 400ms;
	}

	img {
		width: 100%;
		aspect-ratio: 1/1;
	}

	a {
		display: block;
		text-decoration: none;
		font-style: italic;
		font-weight: bold;
		color: color-mix(in srgb, var(--black), var(--white));
		text-align: right;
		width: 100%;
	}

	@keyframes fadeInUp {
		0% {
			opacity: 0;
			transform: translate3d(0, 200px, 0);
		}
		100% {
			transform: none;
			opacity: 1;
		}
	}

	@keyframes border {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
