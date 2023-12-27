<script>
	import Flex from '$lib/components/Flex.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
</script>

<canvas id="background"></canvas>
<Flex noScroll width="narrow">
	<div id="content-container">
		<h1>Hello, world</h1>
		<h2>my name is Daniel</h2>
		<h3>and I enjoy making computers draw beautiful stuff</h3>
		<NavBar />
	</div>
</Flex>

<style>
	#background {
		background: var(--black);
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: -1;
	}
	#content-container {
		color: var(--white);
		text-shadow: var(--white) 0px 0px 15px; /* TODO: Darken shadow */
		font-family: sans-serif;
		text-align: center;
		text-transform: uppercase;
	}

	/* TODO different font sizes on diff screens (@media) */
	h1 {
		font-family: monospace;
		font-size: 4em;
	}
	h2 {
		font-size: 2em;
		margin: 0px;
	}
	h3 {
		margin-top: 0.5em;
	}
</style>
