<script>
	import Flex from '../../components/Flex.svelte';
	import Image from './Image.svelte';

	const images = new Array(10).map((i) => `Image #${i}`);
</script>

<Flex className="wide" scrollable={true}>
	<div id="container">
		<!-- TODO: Rewrite text-->
		<h1>This is my gallery :)</h1>
		<p>Some more text here text text text i love text</p>
		<div id="gallery">
			{#each images as title}
				<Image {title}></Image>
			{/each}
		</div>
	</div>
</Flex>

<style>
	#container {
		height: 100vh;
	}
</style>
