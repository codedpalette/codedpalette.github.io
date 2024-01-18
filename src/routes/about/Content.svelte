<script lang="ts">
	import Basics from './Basics.svelte';
	import Education from './Education.svelte';
	import Languages from './Languages.svelte';
	import Links from './Links.svelte';
	import Projects from './Projects.svelte';
	import { basics, education, languages, projects, skills, work } from './resume.json';
	import Skills from './Skills.svelte';
	import Work from './Work.svelte';
</script>

<div id="content" class="padding">
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
	@use 'styles/variables.scss';

	/* stylelint-disable-next-line plugin/no-unsupported-browser-features */
	@page {
		margin: 5mm;
	}

	@media print {
		:global(html, body) {
			width: 1100px;
		}
	}

	#content {
		width: 100%;
		font-family: Helvetica, Arial, sans-serif;
		color: var(--black);

		:global {
			/* stylelint-disable-next-line no-invalid-position-at-import-rule */
			@import 'styles/global';
		}
	}
</style>
