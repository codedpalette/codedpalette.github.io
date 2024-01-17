<script lang="ts">
	import type { ResumeSchema } from '@kurone-kito/jsonresume-types';

	import { calcLocation, mdToHtml } from './helper';

	export let basics: Required<ResumeSchema>['basics'];
</script>

<div id="basics">
	<div class="table padding-bottom-container-2">
		<div class="main">
			<span id="name">{basics.name}</span>
			<span id="label">{basics.label}</span>
		</div>
		<!-- TODO: Display only on pdf (maybe replace with picture) -->
		<div class="side">
			<ul id="contact">
				<li>{basics.phone}</li>
				<li>{basics.email}</li>
				<li class="margin-text-5">{calcLocation(basics.location)}</li>
			</ul>
		</div>
	</div>
	{#if basics.summary}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<div class="summary markdown padding-bottom-container-2">{@html mdToHtml(basics.summary)}</div>
	{/if}
</div>

<style lang="scss">
	@use 'styles/variables';
	@use 'styles/mixins';

	@mixin main-span($font-size, $font-weight, $margin-factor) {
		font-size: $font-size;
		line-height: 1em;
		font-weight: $font-weight;
		margin-left: $font-size * $margin-factor;
	}

	#basics {
		.main {
			vertical-align: middle;

			#name {
				@include main-span(variables.$header-name-font-size, bold, -0.07);
			}

			#label {
				@include main-span(variables.$header-line-font-size, lighter, -0.04);
			}
		}

		.side {
			visibility: hidden;
			vertical-align: middle;
			padding-left: 0;
			padding-top: 15px;

			#contact {
				list-style-type: none;

				li {
					font-size: variables.$font-size-large;
					line-height: variables.$line-height-3;
				}
			}
		}
	}
</style>
