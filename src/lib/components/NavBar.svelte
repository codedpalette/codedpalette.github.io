<nav>
	<ul>
		<li><a href="/about">About</a></li>
		<li><a href="/gallery">Gallery</a></li>
		<li><a href="mailto:daniel.blindr@gmail.com">Contact</a></li>
	</ul>
</nav>

<style lang="scss">
	@use 'sass:math';

	nav {
		font-style: italic;
		font-weight: bold;
	}

	ul {
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: row;
		list-style: none;
		justify-content: center;
	}

	a {
		display: block;
		padding: $padding-container $padding-container * 2;
		text-decoration: none;
		color: inherit;

		@media only screen and (max-width: 768px) {
			padding: math.div($padding-container, 2) $padding-container;
		}
	}
</style>
