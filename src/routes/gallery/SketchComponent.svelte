<!-- Simple check by reference to determine if reactive values have changed -->
<svelte:options immutable={true} />

<script lang="ts">
	import { Sketch, type SketchModule, SketchRunner } from 'sketches';

	import GithubLink from './GithubLink.svelte';
	import { nextFrame } from './schedule';
	import SketchImageComponent from './SketchImageComponent.svelte';

	// Passing props as object with immutable=true to ensure that subsequent updates to sketch array won't trigger
	// reactive overwrite of this component's props
	type SketchContent = {
		sketch: Sketch;
		thumbnail: Blob;
		format?: string;
	};

	export let module: SketchModule;
	export let content: SketchContent | undefined = undefined;
	$: ready = content !== undefined;
	// We can typecast to non-nullable type here since the element is interactive only after ready == true,
	// by which time the content is not undefined
	$: sketch = content?.sketch as Sketch;
	$: thumbnail = content?.thumbnail as Blob;
	$: runner = sketch && new SketchRunner(sketch, { click: () => (dirty = true) });
	$: thumbnailUrl = thumbnail && URL.createObjectURL(thumbnail);

	let sketchImage: SketchImageComponent;
	let zoomed = false;
	let dirty = false;

	async function zoomIn() {
		zoomed = true;
		sketchImage.zoomIn(sketch.params);
		nextFrame(() => {
			runner.start();
			sketchImage.addCanvas(sketch.renderer.canvas);
		});
	}

	async function zoomOut() {
		runner.stop();
		if (dirty) {
			thumbnailUrl && URL.revokeObjectURL(thumbnailUrl);
			thumbnail = await sketch.export({}, content?.format);
			dirty = false;
		} else {
			sketchImage.removeCanvas();
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="container" class:ready class:zoomed on:click={() => !zoomed && zoomIn()}>
	<SketchImageComponent
		bind:this={sketchImage}
		{thumbnailUrl}
		alt={module.name}
		onZoomOutStart={zoomOut}
		onZoomOutEnd={() => (zoomed = false)}
	/>
	<h1>{module.name}</h1>
	<GithubLink {module} />
</div>

<style lang="scss">
	@use 'sass:color';

	$box-shadow: 5px;
	$box-shadow-color: color.scale($white, $blackness: 50%);

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
			border-radius: $box-shadow * 2;
			box-shadow: 0 0 $box-shadow $box-shadow-color;
			transition: box-shadow 400ms;
		}

		&.zoomed {
			/** Add z-index to grid item container to make it's stacking context display over other grid cells */
			z-index: 1;
		}

		&:not(.zoomed):hover {
			// Unsupported mostly on mobile where there is no cursor anyway
			/* stylelint-disable-next-line plugin/no-unsupported-browser-features */
			cursor: zoom-in;

			&::after {
				box-shadow: 0 0 $box-shadow * 4 $box-shadow-color;
			}
		}

		h1 {
			font-weight: normal;
			font-size: $header-label-font-size;
			margin: 0.5em 0;
		}
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
