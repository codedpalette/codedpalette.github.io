<script lang="ts">
	import '$lib/styles/global.scss';

	import extend from 'just-extend';
	import { MetaTags } from 'svelte-meta-tags';

	import { page } from '$app/stores';

	export let data;
	$: metaTags = extend(true, {}, data.baseMetaTags, $page.data.pageMetaTags);
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.gstatic.com" />
	<script defer src="https://us.umami.is/script.js" data-website-id="d38c0d06-5dbf-4119-9566-d431b078dc5f"></script>
</svelte:head>

<MetaTags {...metaTags} />
<slot />
