<script lang="ts">
	/** Class specifying width of flex container */
	export let width: 'narrow' | 'wide';
	/** Whether to stretch content vertically */
	export let stretch = false;
</script>

<div class="flex-container" class:stretch>
	<div class="content-container {width}">
		<slot />
	</div>
</div>

<style lang="scss">
	@use 'sass:math';

	.flex-container {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.content-container {
		width: 100%;
	}

	.stretch {
		align-items: stretch;
	}

	.narrow {
		max-width: math.div($flex-content-width, 2);
	}

	.wide {
		max-width: $flex-content-width;
	}
</style>
