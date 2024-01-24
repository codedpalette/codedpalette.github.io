<script context="module" lang="ts">
	export type LoadedSketch = {
		sketch: Sketch<HTMLCanvasElement>;
		thumbnail: Blob;
		thumbnailResolution: number;
		module: SketchModule;
	};
</script>

<script lang="ts">
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import throttle from 'just-throttle';
	import { type Sketch, type SketchModule, SketchRunner } from 'sketches';
	// Because of this bug https://github.com/import-js/eslint-plugin-import/issues/1479
	/* eslint-disable import/no-duplicates */
	import { onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { Fa } from 'svelte-fa';
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
	let overlay = false;

	const baseGithubUrl = 'https://github.com/codedpalette';

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
		overlay = true;
		imageContainer.style.transform = `scale(${scale}) translate3d(${translateX}px, ${translateY}px, 0)`;
		document.addEventListener('scroll', scrollHandler);

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
		document.removeEventListener('scroll', scrollHandler);
		imageContainer.style.transform = 'none';
		overlay = false;
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

	const scrollHandler = throttle(() => zoomed && zoomOut(), 400);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	bind:this={container}
	class="container"
	class:ready
	class:zoomed
	on:click|stopPropagation={() => !zoomed && zoomIn()}
>
	{#if overlay}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="overlay" transition:fade on:outroend={() => (zoomed = false)} on:click|stopPropagation={zoomOut}></div>
	{/if}
	<div bind:this={imageContainer} class="image-container">
		<img bind:this={thumbnailImg} src={thumbnailUrl} alt={module.name} />
	</div>
	<h1>{module.name}</h1>
	<a
		href={`${baseGithubUrl}/sketches/blob/master/sketches/${module.year}/${module.name}.ts`}
		target="_blank"
		on:click|stopPropagation
	>
		source
		<Fa icon={faGithub}></Fa>
	</a>
</div>

<style lang="scss">
	@use 'sass:color';

	.container {
		position: relative;
		visibility: hidden;
		text-align: center;
		padding: 9px;
		transition: scale 400ms;

		&.ready {
			visibility: visible;
			animation: ease-in-out fade-in-up 0.5s;

			&::after {
				animation: border 0.5s 0.5s forwards;
			}
		}

		&::after {
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
				10px 10px 20px #fff;
		}

		&.zoomed {
			/** Add z-index to grid item container to make it's stacking context display over other grid cells */
			z-index: 1;

			/** Until hovered container has scale property set, the overlay won't be positioned relative to viewport
				We need it to transition to "none" faster than overlay is transitioning to opacity: 1 */
			transition: scale 50ms;
			transform: none;
		}

		&:not(.zoomed):hover {
			// Unsupported mostly on mobile where there is no cursor anyway
			/* stylelint-disable-next-line plugin/no-unsupported-browser-features */
			cursor: zoom-in;
			scale: 1.1;
			z-index: 1;
		}

		h1 {
			font-weight: normal;
			font-size: $header-label-font-size;
			margin: 0.5em 0;
		}
	}

	.overlay {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		// Unsupported mostly on mobile where there is no cursor anyway
		/* stylelint-disable-next-line plugin/no-unsupported-browser-features */
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
		font-style: italic;
		color: color.mix($white, $black);
		text-align: right;
		width: 100%;
	}

	@keyframes fade-in-up {
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
