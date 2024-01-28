<script lang="ts">
	import { faEnvelope, faFilePdf, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';
	import type { ResumeSchema } from '@kurone-kito/jsonresume-types';
	import { Fa } from 'svelte-fa';

	import { calcLocation, mdToHtml } from '../helper';

	export let print: boolean;
	export let basics: Required<ResumeSchema>['basics'];
</script>

<div id="basics">
	<div class="table">
		<div class="main">
			<span id="name">{basics.name}</span>
			<span id="label">{basics.label}</span>
		</div>
		<div class="side">
			{#if print}
				<ul id="contact">
					<li>
						{basics.phone}
						<Fa icon={faPhone} fw></Fa>
					</li>
					<li>
						{basics.email}
						<Fa icon={faEnvelope} fw></Fa>
					</li>
					<li class="margin-text-5">
						{calcLocation(basics.location)}
						<Fa icon={faLocationDot} fw></Fa>
					</li>
				</ul>
			{:else}
				<a id="pdf" href="/about/resume.pdf" aria-label="Save as PDF">
					<Fa icon={faFilePdf}></Fa>
				</a>
			{/if}
		</div>
	</div>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	<div class="summary markdown padding-bottom-container-2">{@html mdToHtml(basics.summary)}</div>
</div>

<style lang="scss">
	@use '../styles/mixins';

	@mixin main-span($font-size, $font-weight, $margin-factor) {
		font-size: $font-size;
		line-height: 1em;
		font-weight: $font-weight;
		margin-left: calc($font-size * $margin-factor);
	}

	#basics {
		.table {
			padding-bottom: $space-1;
			border-bottom: 1px solid $black;

			.main {
				vertical-align: middle;
				font-family: $heading-font-family;
				padding-right: 0;

				#name {
					@include main-span($header-name-font-size, bold, -0.07);
				}

				#label {
					@include main-span($header-label-font-size, lighter, -0.04);
				}
			}

			.side {
				vertical-align: middle;
				padding-left: 0;
				padding-top: 15px;

				@media screen {
					vertical-align: top;
				}

				#pdf {
					:global(svg) {
						font-size: 2em;
					}
				}

				#contact {
					list-style-type: none;
					direction: ltr;

					li {
						font-size: $font-size-large;
						line-height: $line-height-3;
					}
				}
			}
		}
	}
</style>
