<script lang="ts">
	import type { ResumeSchema } from '@kurone-kito/jsonresume-types';

	import { beautifyArray, mdToHtml, validArray } from '../helper';

	export let projects: ResumeSchema['projects'];
	let tableWidth: number;
</script>

{#if validArray(projects)}
	<div id="projects" class="main margin-container-4 no-break">
		<p class="section-title no-alone-2">Projects</p>
		<div class="container">
			{#each projects as project}
				<div class="article margin-container-3">
					<div class="header no-alone-1">
						<div class="table" bind:clientWidth={tableWidth}>
							<div class="left">
								<span class="title">
									<a href={project.url}>{project.name}</a>
								</span>
								{#if project.keywords}
									<span class="subtitle margin-text-1">{beautifyArray(' · ', project.keywords)}</span>
								{/if}
							</div>
						</div>
					</div>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					<div class="highlights markdown margin-text-4">{@html mdToHtml(project.description)}</div>
					{#if validArray(project.highlights)}
						<ul class="highlights margin-text-4 no-break">
							{#each project.highlights as highlight}
								<li>{highlight}</li>
							{/each}
						</ul>
					{/if}
				</div>
			{/each}
		</div>
	</div>
{/if}
