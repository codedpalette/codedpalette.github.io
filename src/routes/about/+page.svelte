<script lang="ts">
	// import 'jsonresume-theme-actual/assets/styles.css';

	import { onMount } from 'svelte';

	import Flex from '$lib/components/Flex.svelte';

	import type { PageData } from './$types';
	import Basics from './Basics.svelte';
	import Projects from './Projects.svelte';
	import resume from './resume.json';
	import Work from './Work.svelte';

	export let data: PageData;
	let templateHTML: string;

	// TODO: Export to PDF
	onMount(() => {
		templateHTML = new DOMParser().parseFromString(data.template, 'text/html').body.innerHTML;
	});
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<!-- {@html templateHTML} -->

<Flex stretch width="wide">
	<div id="content">
		<Basics {...resume} />
		<div class="table">
			<div class="main">
				<Projects {...resume} />
				<Work {...resume} />
			</div>
			<div class="side">
				<!-- skills -->
				<!-- education -->
				<!-- languages -->
				<!-- links -->
			</div>
		</div>
	</div>
</Flex>

<style lang="scss">
	@use 'styles/variables.scss';
	#content {
		width: 100%;
		padding: 0 50px;
		margin: 0 auto;
		font-family: Helvetica, Arial, sans-serif;
		color: var(--black);

		@import 'styles/global.scss';

		.table {
			padding-top: variables.$space-2;
		}
	}
</style>
