<script lang="ts">
	export let maxWidth: number;
</script>

<div id="flex-container">
	<div id="content-container" style="--max-width:{maxWidth}px">
		<slot />
	</div>
</div>

<style>
	#flex-container {
		width: 100%; /* 100% of parent width */
		height: 100%; /* 100% of parent height */
		display: flex; /* specify it as flex container */
		overflow: hidden; /* disable scrolling */
    position: relative; /* to overlay background */
		align-items: center; /* center content vertically */
		justify-content: center; /* center content horizontally */
	}
	#content-container {
		padding: 18px;
		width: 100%;
		max-width: var(--max-width);
	}
</style>
