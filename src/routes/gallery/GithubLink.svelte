<script lang="ts">
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import type { SketchModule } from 'sketches';
	import { Fa } from 'svelte-fa';

	export let module: SketchModule;
	const baseGithubUrl = 'https://github.com/codedpalette';
	const githubUrl = `${baseGithubUrl}/sketches/blob/master/sketches/${module.year}/${module.name}.ts`;
</script>

<a href={githubUrl} target="_blank" on:click|stopPropagation>
	source
	<Fa icon={faGithub}></Fa>
</a>

<style lang="scss">
	@use 'sass:color';

	a {
		display: block;
		font-style: italic;
		color: $black;
		text-align: right;
		width: 100%;
	}
</style>
