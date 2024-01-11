<script lang="ts">
	import 'jsonresume-theme-actual/assets/styles.css';

	import { onMount } from 'svelte';

	import type { PageData } from './$types';

	export let data: PageData;
	let templateHTML: string;

	// TODO: Export to PDF
	onMount(() => {
		templateHTML = new DOMParser().parseFromString(data.template, 'text/html').body.innerHTML;
	});
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html templateHTML}
