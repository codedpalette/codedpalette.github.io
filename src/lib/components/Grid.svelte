<script lang="ts" generics="T">
	// eslint-disable-next-line no-undef
	export let items: T[];
</script>

<div id="grid">
	{#each items as item}
		<div class="item-container">
			<slot {item} />
		</div>
	{/each}
</div>

<style>
	#grid {
		display: grid;
		gap: 20px;
	}

	.item-container {
		grid-column: span 2;
		z-index: 1;
	}

	@media (min-width: 600px) {
		#grid {
			grid-template-columns: repeat(4, 1fr);
		}

		/* Dealing with single orphan */
		.item-container:last-child:nth-child(2n - 1) {
			grid-column-end: 4;
		}
	}

	@media (min-width: 900px) {
		#grid {
			grid-template-columns: repeat(6, 1fr);
		}

		/* Dealing with 2 orphan items */
		.item-container:last-child:nth-child(3n - 1) {
			grid-column-end: 6;
		}

		.item-container:nth-last-child(2):nth-child(3n + 1) {
			grid-column-end: 4;
		}

		/* Dealing with single orphan */
		.item-container:last-child:nth-child(3n - 2) {
			grid-column-end: 5;
		}
	}
</style>
