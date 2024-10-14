<script lang="ts">
	import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
	import { faGlobe } from '@fortawesome/free-solid-svg-icons';
	import type { ResumeSchema } from '@kurone-kito/jsonresume-types';
	import { Fa } from 'svelte-fa';

	import { beautifyLink, validArray } from '../helper';

	export let basics: Required<ResumeSchema>['basics'];

	function networkIcon(network?: string) {
		const code = network?.toLowerCase();
		if (code == 'github') return faGithub;
		if (code == 'linkedin') return faLinkedin;
		return faGlobe;
	}
</script>

{#if validArray(basics.profiles) || basics.url}
	<div id="links" class="margin-container-4 no-break">
		<p class="section-title no-alone-1">Links</p>
		<div class="container">
			<ul>
				{#if basics.url}
					<li class="article">
						<Fa icon={faGlobe} fw size="lg"></Fa>
						<a href={basics.url}>
							{beautifyLink(basics.url)}
						</a>
					</li>
				{/if}
				{#if validArray(basics.profiles)}
					{#each basics.profiles as profile}
						{#if profile.url}
							<li class="article margin-text-4">
								<Fa icon={networkIcon(profile.network)} fw size="lg"></Fa>
								<a href={profile.url}>{profile.username}</a>
							</li>
						{/if}
					{/each}
				{/if}
			</ul>
		</div>
	</div>
{/if}

<style lang="scss">
	#links {
		ul {
			list-style: none;

			li {
				font-size: $font-size-small;
			}
		}
	}
</style>
