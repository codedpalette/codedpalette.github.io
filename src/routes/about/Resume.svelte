<script lang="ts">
	import type { ResumeSchema } from '@kurone-kito/jsonresume-types';
	import extend from 'just-extend';

	import Basics from './partials/Basics.svelte';
	import Education from './partials/Education.svelte';
	import Languages from './partials/Languages.svelte';
	import Links from './partials/Links.svelte';
	import Projects from './partials/Projects.svelte';
	import Skills from './partials/Skills.svelte';
	import Work from './partials/Work.svelte';
	import resume from './resume.json';

	export let print = false;
	export let overrides: ResumeSchema = {};

	const { basics, education, languages, projects, skills, work } = extend(
		true,
		resume,
		overrides
	) as Required<ResumeSchema>;
</script>

<div id="content">
	<Basics {basics} {print} />
	<div class="table flex">
		<div class="main">
			{#if !print}
				<Projects {projects} />
			{/if}
			<Work {work} />
		</div>
		<div class="side">
			<Skills {skills} />
			<Education {education} />
			<Languages {languages} />
			<Links {basics} />
		</div>
	</div>
	{#if print}
		<div class="table flex">
			<Projects {projects} />
		</div>
	{/if}
</div>

<style lang="scss">
	@use 'sass:meta';

	// Ignoring since we're printing page through Puppeteer, and Chrome definitely supports this
	/* stylelint-disable-next-line plugin/no-unsupported-browser-features */
	@page {
		margin: 5mm;
	}

	@media print {
		:global(html, body) {
			width: $flex-content-width;
			font-family: Arial, sans-serif;
		}
	}

	#content {
		width: 100%;

		@media screen {
			padding: $padding-container;
		}

		:global {
			@include meta.load-css('./styles/about');
		}
	}
</style>
