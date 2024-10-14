<script lang="ts">
	import type { ResumeSchema } from '@kurone-kito/jsonresume-types';

	import { beautifyArray, validArray } from '../helper';

	export let languages: ResumeSchema['languages'];
</script>

{#if validArray(languages)}
	<div id="languages" class="margin-container-4 no-break">
		<p class="section-title no-alone-1">Languages</p>
		<div class="container">
			<ul>
				{#each languages as language}
					<li class="article margin-text-2">
						{beautifyArray(' · ', [language.language, language.fluency])}
					</li>
				{/each}
			</ul>
		</div>
	</div>
{/if}

<style lang="scss">
	#languages {
		ul {
			list-style: none;

			li {
				font-size: $font-size-small;
			}
		}
	}
</style>
