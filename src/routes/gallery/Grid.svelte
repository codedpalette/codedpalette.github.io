<script lang="ts" generics="T">
	// eslint-disable-next-line no-undef
	export let items: T[];
</script>

<div id="grid">
	{#each items as item, index}
		<div class="item-container">
			<slot {item} {index} />
		</div>
	{/each}
</div>

<style>
	#grid {
		display: grid;
		gap: 30px;
	}

	.item-container {
		grid-column: span 2;
	}

	@media (min-width: 600px) and (max-width: 899px) {
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
