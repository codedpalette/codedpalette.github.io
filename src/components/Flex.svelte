<script lang="ts">
	export let className: 'narrow' | 'wide';
	export let scrollable = false;
</script>

<div id="flex-container" class={scrollable ? 'scroll' : 'no-scroll'}>
	<div id="content-container" class={className}>
		<slot />
	</div>
</div>

<style>
	#flex-container {
		width: 100%; /* 100% of parent width */
		height: 100%; /* 100% of parent height */
		display: flex; /* specify it as flex container */
		position: relative; /* to overlay background */
		align-items: center; /* center content vertically */
		justify-content: center; /* center content horizontally */
	}
	#content-container {
		padding: 18px;
		width: 100%;
	}

	.no-scroll {
		overflow: hidden;
	}

	.scroll {
		overflow-x: hidden;
		overflow-y: auto;
	}

	.narrow {
		max-width: 550px;
	}

	.wide {
		max-width: 1100px;
	}
</style>
