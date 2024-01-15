<script lang="ts">
	import Flex from '$lib/components/Flex.svelte';

	import Basics from './Basics.svelte';
	import Education from './Education.svelte';
	import Languages from './Languages.svelte';
	import Links from './Links.svelte';
	import Projects from './Projects.svelte';
	import { basics, education, languages, projects, skills, work } from './resume.json';
	import Skills from './Skills.svelte';
	import Work from './Work.svelte';

	// TODO: Export to PDF
	// TODO: Responsive layout
</script>

<Flex stretch width="wide">
	<div id="content" class="padding">
		<Basics {basics} />
		<div class="table">
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
</Flex>

<style lang="scss">
	@use 'styles/variables.scss';

	#content {
		width: 100%;
		font-family: Helvetica, Arial, sans-serif;
		color: var(--black);

		/* stylelint-disable-next-line no-invalid-position-at-import-rule */
		@import 'styles/global';
	}
</style>
