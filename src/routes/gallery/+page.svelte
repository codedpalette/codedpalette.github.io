<script lang="ts">
	import Flex from '$lib/components/Flex.svelte';
	import Image from './Image.svelte';
	import { curves } from 'sketches';

	// TODO: Render sketches asynchronously (if offscreencanvas is available)

	const sketches = [
		{
			title: 'Curves',
			sketch: curves
		}
	];
</script>

<Flex stretch width="wide">
	<h1>This is my gallery :)</h1>
	<p>Some more text here text text text i love text</p>
	<div id="gallery">
		{#each sketches as sketch}
			<div class="image-container">
				<!-- TODO: Appearance animation-->
				<Image {...sketch}></Image>
			</div>
		{/each}
	</div>
</Flex>

<style>
	#gallery {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}
	.image-container {
		/* flex-grow: 1; */ /* TODO: Grow to the size of column */
		padding: 9px;
		/* flex-basis: 300px; */
	}
</style>
