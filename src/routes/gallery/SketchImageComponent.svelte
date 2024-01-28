<script lang="ts">
	import throttle from 'just-throttle';
	import { fade } from 'svelte/transition';

	type ImageSize = {
		width: number;
		height: number;
	};

	export let thumbnailUrl: string | undefined = undefined;
	export let alt: string;
	export let onZoomOutStart = () => {};
	export let onZoomOutEnd = () => {};

	let imageTransform: string | undefined = undefined;
	let thumbnailImage: HTMLImageElement;
	let imageContainer: HTMLDivElement;
	let addedCanvas: HTMLCanvasElement | undefined = undefined;
	let imageHidden = false;
	let overlayVisible = false;

	const scrollHandler = throttle(zoomOut, 400);

	export function zoomIn(naturalSize: ImageSize) {
		overlayVisible = true;
		imageTransform = calculateImageTransform(naturalSize);
		document.addEventListener('scroll', scrollHandler);
	}

	function zoomOut() {
		overlayVisible = false;
		imageTransform = undefined;
		document.removeEventListener('scroll', scrollHandler);
		onZoomOutStart();
	}

	export function addCanvas(canvas: HTMLCanvasElement) {
		addedCanvas = canvas;
		imageContainer.appendChild(canvas);
		imageHidden = true;
	}

	export function removeCanvas() {
		if (addedCanvas) imageContainer.removeChild(addedCanvas);
		addedCanvas = undefined;
		imageHidden = false;
	}

	function calculateImageTransform(naturalSize: ImageSize) {
		const margin = 18; //px
		const viewportWidth = document.documentElement.clientWidth - margin * 2;
		const viewportHeight = document.documentElement.clientHeight - margin * 2;
		const { width: naturalWidth, height: naturalHeight } = naturalSize;
		const { width, height, top, left } = thumbnailImage.getBoundingClientRect();

		const scaleX = Math.min(naturalWidth, viewportWidth) / width;
		const scaleY = Math.min(naturalHeight, viewportHeight) / height;
		const scale = Math.min(scaleX, scaleY);
		const translateX = (-left + (viewportWidth - width) / 2 + margin) / scale;
		const translateY = (-top + (viewportHeight - height) / 2 + margin) / scale;
		return `scale(${scale}) translate3d(${translateX}px, ${translateY}px, 0)`;
	}

	function imageOnload() {
		//thumbnailUrl && URL.revokeObjectURL(thumbnailUrl);
		removeCanvas();
	}
</script>

{#if overlayVisible}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="overlay" transition:fade on:outroend={onZoomOutEnd} on:click|stopPropagation={zoomOut}></div>
{/if}
<div bind:this={imageContainer} class="image-container" style:transform={imageTransform}>
	{#if thumbnailUrl}
		<img bind:this={thumbnailImage} src={thumbnailUrl} {alt} on:load={imageOnload} class:hidden={imageHidden} />
	{:else}
		<div class="placeholder"></div>
	{/if}
</div>

<style lang="scss">
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

		img {
			width: 100%;
			aspect-ratio: 1;

			&.hidden {
				display: none;
			}
		}
	}

	.placeholder {
		width: 100%;
		aspect-ratio: 1;
	}
</style>
