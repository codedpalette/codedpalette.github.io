<script lang="ts">
	import type { ResumeSchema } from '@kurone-kito/jsonresume-types';

	import { validArray } from '../helper';

	export let skills: ResumeSchema['skills'];
</script>

{#if validArray(skills)}
	<div id="skills" class="margin-container-4">
		<p class="section-title no-alone-1">Skills</p>
		<div class="container">
			{#each skills as skill}
				<div class="article no-break">
					<span>{skill.name}</span>
					{#if validArray(skill.keywords)}
						<ul class="margin-text-2">
							{#each skill.keywords as keyword}
								<li>{keyword}</li>
							{/each}
						</ul>
					{/if}
				</div>
			{/each}
		</div>
	</div>
{/if}

<style lang="scss">
	@use 'sass:math';

	#skills {
		.section-title {
			margin: 0;
		}

		.container {
			display: block;
			columns: 2;
			column-gap: $space-1;

			.article {
				break-inside: avoid-column;
				min-width: calc(($content-side-percentage - $space-1 - $space-4) * 0.5);
				padding-top: $space-2;

				span {
					display: block;
					font-size: $font-size-large;
					font-weight: lighter;
				}

				li {
					font-size: $font-size-small;
					list-style: none;
				}
			}
		}
	}
</style>
