<script>
	import Flex from '../../components/Flex.svelte';
	import Image from './Image.svelte';

	const images = [...Array(10).keys()].map((e) => `Image #${e}`);
</script>

<Flex className="wide" scrollable={true}>
	<div id="container">
		<!-- TODO: Rewrite text-->
		<h1>This is my gallery :)</h1>
		<p>Some more text here text text text i love text</p>
		<div id="gallery">
			{#each images as title}
				<div class="image-container">
					<Image {title}></Image>
				</div>
			{/each}
		</div>
	</div>
</Flex>

<style>
	#container {
		height: 100vh;
	}
	#gallery {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}
	.image-container {
		/* flex-grow: 1; */
		padding: 9px;
		/* flex-basis: 300px; */
	}
</style>
