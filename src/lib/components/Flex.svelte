<script lang="ts">
	export let width: 'narrow' | 'wide';
	export let noScroll = false;
	export let stretch = false;
</script>

<div class="flex-container" class:noScroll class:stretch>
	<div class="content-container {width}">
		<slot />
	</div>
</div>

<style>
	.flex-container {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.content-container {
		padding: 18px;
		width: 100%;
	}

	.noScroll {
		overflow: hidden;
	}

	.stretch {
		align-items: stretch;
	}

	.narrow {
		max-width: 550px;
	}

	.wide {
		max-width: 1100px;
	}
</style>
