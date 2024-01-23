<script lang="ts">
	import '$lib/styles/global.scss';

	import extend from 'just-extend';
	import { MetaTags } from 'svelte-meta-tags';

	import { page } from '$app/stores';

	export let data;
	$: metaTags = extend(true, {}, data.baseMetaTags, $page.data.pageMetaTags);
</script>

<MetaTags {...metaTags} />
<slot />
