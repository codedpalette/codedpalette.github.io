<script lang="ts">
	import type { ResumeSchema } from '@kurone-kito/jsonresume-types';

	import { beautifyLink, validArray } from './helper';

	export let basics: Required<ResumeSchema>['basics'];
</script>

{#if validArray(basics.profiles) || basics.url}
	<div id="links" class="margin-container-4 no-break">
		<p class="section-title no-alone-1">Links</p>
		<div class="container">
			<ul>
				{#if basics.url}
					<li class="article">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						<a href={basics.url}>{@html beautifyLink(basics.url)}</a>
					</li>
				{/if}
				{#if validArray(basics.profiles)}
					{#each basics.profiles as profile}
						{#if profile.url}
							<li class="article margin-text-4">
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								<a href={profile.url}>{@html beautifyLink(profile.url)}</a>
							</li>
						{/if}
					{/each}
				{/if}
			</ul>
		</div>
	</div>
{/if}

<style lang="scss">
	@use 'styles/variables';

	#links {
		ul {
			list-style: none;

			li {
				font-size: variables.$font-size-xsmall;
			}
		}
	}
</style>
