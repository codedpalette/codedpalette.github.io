<script>
	import Flex from '../components/Flex.svelte';
</script>

<canvas id="background" class="fullscreen"></canvas>
<Flex className="narrow">
	<div id="container">
		<h1>Hello, world</h1>
		<h2>my name is Daniel</h2>
		<h3>and I enjoy making computers draw beautiful stuff</h3>
		<nav>
			<ul>
				<li><a href="/about">About</a></li>
				<li><a href="/gallery">Gallery</a></li>
				<li><a href="mailto:daniel.blindr@gmail.com">Contact</a></li>
			</ul>
		</nav>
	</div>
</Flex>

<style lang="scss">
	@use '../styles/base.scss';
	@use 'sass:color';
	$shadow: color.adjust(base.$white, $red: -30, $green: -30, $blue: -30);

	#background {
		background: base.$black;
	}
	#container {
		color: base.$white;
		text-shadow: $shadow 0px 0px 15px;
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
	nav {
		font-style: italic;
		font-weight: bold;
		align-items: start;
	}
	ul {
		margin: 0px;
		padding: 0px;
		display: flex;
		flex-direction: row;
		list-style: none;
		justify-content: center;
	}
	a {
		display: block;
		padding: 18px 36px;
		text-decoration: none;
		color: inherit;
	}
</style>
