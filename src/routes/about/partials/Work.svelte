<script lang="ts">
	import type { ResumeSchema } from '@kurone-kito/jsonresume-types';

	import { calcDateRange, mdToHtml, validArray } from '../helper';

	export let work: ResumeSchema['work'];
	let tableWidth: number;
</script>

{#if validArray(work)}
	<div id="work" class="margin-container-4">
		<p class="section-title no-alone-2">Experience</p>
		<div class="container">
			{#each work as workplace}
				<div class="article margin-container-3">
					<div class="header no-alone-1">
						<div class="table" bind:clientWidth={tableWidth}>
							<div class="left">
								<span class="title">{workplace.position}</span>
								<span class="subtitle margin-text-1">
									<a href={workplace.url}>{workplace.name}</a>
									{#if workplace.location}
										{` · ${workplace.location}`}
									{/if}
								</span>
							</div>
							<div class="right">
								<span class="date">
									{calcDateRange(workplace.startDate, workplace.endDate, tableWidth <= 400)}
								</span>
							</div>
						</div>
					</div>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					<div class="summary markdown margin-text-4">{@html mdToHtml(workplace.summary)}</div>
					{#if validArray(workplace.highlights)}
						<ul class="highlights margin-text-4 no-break">
							{#each workplace.highlights as highlight}
								<li>{highlight}</li>
							{/each}
						</ul>
					{/if}
				</div>
			{/each}
		</div>
	</div>
{/if}
