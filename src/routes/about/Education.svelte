<script lang="ts">
	import type { ResumeSchema } from '@kurone-kito/jsonresume-types';

	import { beautifyArray, mdToHtml, validArray } from './helper';

	export let education: ResumeSchema['education'];
</script>

{#if validArray(education)}
	<div id="education" class="margin-container-4">
		<p class="section-title no-alone-1">Education</p>
		<div class="container">
			{#each education as edu}
				<div class="article margin-container-2 no-break">
					<div class="title markdown">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html mdToHtml(beautifyArray(', ', [edu.studyType, edu.area]))}
					</div>
					<span class="institution margin-text-2">
						<a href={edu.url}>{edu.institution}</a>
					</span>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style lang="scss">
	@use 'styles/variables';

	#education {
		.title {
			font-size: variables.$font-size-small;
		}

		.institution {
			font-size: variables.$font-size-small;
			font-weight: lighter;
		}
	}
</style>
