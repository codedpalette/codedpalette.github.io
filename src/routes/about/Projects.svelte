<script lang="ts">
	import type { ResumeSchema } from '@kurone-kito/jsonresume-types';

	import { arrayToPhrase, calcDateRange, mdToHtml, validArray } from './helper';

	export let projects: ResumeSchema['projects'];
</script>

{#if validArray(projects)}
	<div id="projects" class="margin-container-4">
		<p class="section-title no-alone-2">Projects</p>
		<div class="container">
			{#each projects as project}
				<div class="article margin-container-3">
					<div class="header no-alone-1">
						<div class="table">
							<div class="left">
								<span class="title">{arrayToPhrase(project.roles)}</span>
								<span class="subtitle margin-text-1">
									<a href={project.url}>{project.name}</a>
								</span>
							</div>
							<div class="right">
								<span class="date">{calcDateRange(project.startDate, project.endDate)}</span>
							</div>
						</div>
					</div>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					<div class="summary markdown margin-text-4">{@html mdToHtml(project.description)}</div>
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
