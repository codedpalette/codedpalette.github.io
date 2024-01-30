<script lang="ts">
	import { page } from '$app/stores';

	export let mainPage = false;
	const currentPath = $page.url.pathname;
</script>

<div id="nav-container">
	<div class:border={!mainPage}>
		<nav class:not-main={!mainPage}>
			<ul>
				{#if !mainPage}
					<li><a href="/">Home</a></li>
				{/if}
				<li class:selected={currentPath.startsWith('/about')}><a href="/about">About</a></li>
				<li class:selected={currentPath.startsWith('/gallery')}><a href="/gallery">Gallery</a></li>
				<li><a href="mailto:daniel.blindr@gmail.com">Contact</a></li>
			</ul>
		</nav>
	</div>
</div>

<style lang="scss">
	@use 'sass:math';
	@use 'sass:color';

	$max-border-width: 768px;
	$border-color: color.adjust($black, $lightness: 75%);

	#nav-container {
		display: flex;
		justify-content: center;
		width: 100%;

		.border {
			border-bottom: 1px solid $border-color;
			width: 100%;
			max-width: $max-border-width;
		}
	}

	nav {
		font-size: min(1em, 4vw);
		font-style: italic;
		font-weight: bold;
		text-transform: uppercase;

		ul {
			margin: 0;
			padding: 0;
			display: flex;
			flex-direction: row;
			list-style: none;
			justify-content: center;

			a {
				display: block;
				padding: $padding-container $padding-container * 2;
				text-decoration: none;
				color: inherit;
				transition: scale 200ms;

				&:hover {
					scale: 1.2;
				}

				@media only screen and (max-width: $max-border-width) {
					padding: math.div($padding-container, 2) $padding-container;
				}
			}
		}

		&.not-main {
			color: $black;

			li.selected {
				border-bottom: 5px solid $border-color;
			}
		}
	}
</style>
