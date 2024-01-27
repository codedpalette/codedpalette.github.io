<!-- Simple check by reference to determine if reactive values have changed -->
<svelte:options immutable={true} />

<script lang="ts">
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import throttle from 'just-throttle';
	import { Sketch, type SketchModule, SketchRunner } from 'sketches';
	// Because of this bug https://github.com/import-js/eslint-plugin-import/issues/1479
	// eslint-disable-next-line import/no-duplicates
	import { getContext } from 'svelte';
	// eslint-disable-next-line import/no-duplicates
	import { fade } from 'svelte/transition';
	import { Fa } from 'svelte-fa';

	import { thumbnailResolutionContextKey } from './+page.svelte';

	type SketchContent = {
		sketch: Sketch;
		thumbnail: Blob;
	};

	export let module: SketchModule;
	export let content: SketchContent | undefined = undefined;
	const baseGithubUrl = 'https://github.com/codedpalette';
	const thumbnailResolution = getContext<number>(thumbnailResolutionContextKey);

	$: ready = content !== undefined;
	$: sketch = content?.sketch as Sketch;
	$: thumbnail = content?.thumbnail as Blob;
	$: runner = sketch && new SketchRunner(sketch);
	$: thumbnailUrl = thumbnail && URL.createObjectURL(thumbnail);

	let thumbnailImg: HTMLImageElement;
	let imageContainer: HTMLDivElement;
	let zoomed = false;
	let overlay = false;

	function zoomIn() {
		if (zoomed) return;
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

		// TODO: Polyfill
		// eslint-disable-next-line compat/compat
		requestIdleCallback(() => {
			runner.start();
			imageContainer.appendChild(sketch.renderer.canvas);
			thumbnailImg.style.display = 'none';
		});
	}

	function zoomOut() {
		if (!zoomed) return;
		document.removeEventListener('scroll', scrollHandler);
		imageContainer.style.transform = 'none';
		overlay = false;
		runner.stop();
		updateThumbnail().then(() => {
			// TODO: Move to image.onload
			imageContainer.removeChild(sketch.renderer.canvas);
			thumbnailImg.style.display = 'inline';
		});
	}

	async function updateThumbnail() {
		sketch.resize({ resolution: thumbnailResolution });
		thumbnail = await sketch.export();
		sketch.resize({ resolution: 1 });
	}

	function imageOnload() {
		thumbnailUrl && URL.revokeObjectURL(thumbnailUrl);
	}

	const scrollHandler = throttle(zoomOut, 400);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="container" class:ready class:zoomed on:click={zoomIn}>
	{#if overlay}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="overlay" transition:fade on:outroend={() => (zoomed = false)} on:click|stopPropagation={zoomOut}></div>
	{/if}
	<div bind:this={imageContainer} class="image-container">
		<img bind:this={thumbnailImg} src={thumbnailUrl} alt={module.name} on:load={imageOnload} />
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

			/** We need to reset transform on container, otherwise the overlay won't be positioned relative to viewport.
				See https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block  */
			transition: none;
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
		transition: transform 400ms ease-out;
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
