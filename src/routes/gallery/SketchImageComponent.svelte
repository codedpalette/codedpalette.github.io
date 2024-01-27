<script lang="ts">
	type ImageSize = {
		width: number;
		height: number;
	};

	export let thumbnailUrl: string | undefined = undefined;
	export let alt: string;

	let transform: string | undefined = undefined;
	let thumbnailImg: HTMLImageElement;
	let imageContainer: HTMLDivElement;
	let hidden = false;

	export function zoomIn(naturalSize: ImageSize) {
		transform = calculateImageTransform(naturalSize);
	}

	export function zoomOut() {
		transform = undefined;
	}

	export function addCanvas(canvas: HTMLCanvasElement) {
		imageContainer.appendChild(canvas);
		hidden = true;
	}

	export function removeCanvas(canvas: HTMLCanvasElement) {
		if (canvas.isConnected && canvas.parentNode == imageContainer) imageContainer.removeChild(canvas);
		hidden = false;
	}

	function calculateImageTransform(naturalSize: ImageSize) {
		const margin = 18; //px
		const viewportWidth = document.documentElement.clientWidth - margin * 2;
		const viewportHeight = document.documentElement.clientHeight - margin * 2;
		const { width: naturalWidth, height: naturalHeight } = naturalSize;
		const { width, height, top, left } = thumbnailImg.getBoundingClientRect();

		const scaleX = Math.min(naturalWidth, viewportWidth) / width;
		const scaleY = Math.min(naturalHeight, viewportHeight) / height;
		const scale = Math.min(scaleX, scaleY);
		const translateX = (-left + (viewportWidth - width) / 2 + margin) / scale;
		const translateY = (-top + (viewportHeight - height) / 2 + margin) / scale;
		return `scale(${scale}) translate3d(${translateX}px, ${translateY}px, 0)`;
	}

	function imageOnload() {
		thumbnailUrl && URL.revokeObjectURL(thumbnailUrl);
	}
</script>

<div bind:this={imageContainer} class="image-container" style:transform>
	<img bind:this={thumbnailImg} src={thumbnailUrl} {alt} on:load={imageOnload} class:hidden />
</div>

<style lang="scss">
	.image-container {
		position: relative;
		transition: transform 400ms ease-out;

		img {
			width: 100%;
			aspect-ratio: 1/1;

			&.hidden {
				display: none;
			}
		}
	}
</style>
