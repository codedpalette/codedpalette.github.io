<script lang="ts">
	// Because of this bug https://github.com/import-js/eslint-plugin-import/issues/1479
	/* eslint-disable import/no-duplicates */
	import { fade } from 'svelte/transition';
	/* eslint-enable import/no-duplicates */

	//export let sketch: Sketch;
	export let thumbnail: Blob;
	export let title: string;

	$: ready = thumbnail !== undefined;
	$: thumbnailUrl = thumbnail ? URL.createObjectURL(thumbnail) : undefined;
	let thumbnailImg: HTMLImageElement;
	let container: HTMLDivElement;
	let zoomed = false;

	function zoomIn() {
		const margin = 18; //px
		const viewportWidth = document.documentElement.clientWidth - margin * 2;
		const viewportHeight = document.documentElement.clientHeight - margin * 2;
		const { naturalWidth, naturalHeight } = thumbnailImg;
		const { width, height, top, left } = thumbnailImg.getBoundingClientRect();

		const scaleX = Math.min(naturalWidth, viewportWidth) / width;
		const scaleY = Math.min(naturalHeight, viewportHeight) / height;
		const scale = Math.min(scaleX, scaleY);
		const translateX = (-left + (viewportWidth - width) / 2 + margin) / scale;
		const translateY = (-top + (viewportHeight - height) / 2 + margin) / scale;

		zoomed = true;
		thumbnailImg.style.transform = `scale(${scale}) translate3d(${translateX}px, ${translateY}px, 0)`;
		container.classList.add('zoomed');
		document.addEventListener('scroll', zoomOut);

		// TODO: Create runner
		// canvas.getContext('2d')?.reset();
		// const renderer = new SketchRenderer<HTMLCanvasElement>({ canvas });
		// const sketch = new Sketch(sketchFactory, renderer, fullSizeParams, seed);
		// runner = new SketchRunner(sketch);
		// runner.start();
	}

	function zoomOut() {
		document.removeEventListener('scroll', zoomOut);
		thumbnailImg.style.transform = 'none';
		zoomed = false;
		const onZoomOutEnd = () => {
			container.classList.remove('zoomed');
			thumbnailImg.removeEventListener('transitionend', onZoomOutEnd);
		};
		thumbnailImg.addEventListener('transitionend', onZoomOutEnd);
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
	<img bind:this={thumbnailImg} src={thumbnailUrl} alt={title} />
	<h1>{title}</h1>
</div>

<style>
	.container {
		visibility: hidden;
		text-align: center;
		padding: 9px;
		font-family: sans-serif;
		transition: scale 400ms;
	}

	.container:is(.ready) {
		visibility: visible;
		animation: fadeInUp 2s forwards;
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

	.overlay {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: #fff;
		cursor: zoom-out;
	}

	img {
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
