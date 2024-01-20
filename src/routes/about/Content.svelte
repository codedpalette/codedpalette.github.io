<script lang="ts">
	import Basics from './partials/Basics.svelte';
	import Education from './partials/Education.svelte';
	import Languages from './partials/Languages.svelte';
	import Links from './partials/Links.svelte';
	import Projects from './partials/Projects.svelte';
	import Skills from './partials/Skills.svelte';
	import Work from './partials/Work.svelte';
	import { basics, education, languages, projects, skills, work } from './resume.json';
</script>

<div id="content">
	<Basics {basics} />
	<div class="table flex">
		<div class="main">
			<Projects {projects} />
			<Work {work} />
		</div>
		<div class="side">
			<Skills {skills} />
			<Education {education} />
			<Languages {languages} />
			<Links {basics} />
		</div>
	</div>
</div>

<style lang="scss">
	/* stylelint-disable-next-line plugin/no-unsupported-browser-features */
	@page {
		margin: 5mm;
	}

	@media print {
		:global(html, body) {
			width: $flex-content-width;
		}
	}

	#content {
		width: 100%;
		color: $black;
		padding: $padding-container;

		:global {
			/* stylelint-disable-next-line no-invalid-position-at-import-rule */
			@import 'styles/global';
		}
	}
</style>
