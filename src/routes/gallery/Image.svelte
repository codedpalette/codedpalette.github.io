<script lang="ts">
	export let title: string;
</script>

<div>
	<canvas></canvas>
	<h1>{title}</h1>
</div>

<style>
	canvas {
		background: lightblue;
		width: 300px;
		height: 300px;
		margin: 9px;
	}
	div {
		border: 1px solid black;
		text-align: center;
		justify-content: center;
	}
</style>
