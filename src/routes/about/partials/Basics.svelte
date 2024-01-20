<script lang="ts">
	import type { ResumeSchema } from '@kurone-kito/jsonresume-types';

	import { calcLocation, mdToHtml } from '../helper';

	export let basics: Required<ResumeSchema>['basics'];
</script>

<div id="basics">
	<div class="table">
		<div class="main">
			<span id="name">{basics.name}</span>
			<span id="label">{basics.label}</span>
		</div>
		<div class="side">
			<a id="pdf" href="/about/resume.pdf">Save as pdf</a>
			<ul id="contact">
				<li>{basics.phone}</li>
				<li>{basics.email}</li>
				<li class="margin-text-5">{calcLocation(basics.location)}</li>
			</ul>
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
		margin-left: $font-size * $margin-factor;
	}

	#basics {
		.table {
			border-bottom: 1px solid $text-color;
		}

		.main {
			vertical-align: middle;

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
				@media print {
					display: none;
				}
			}

			#contact {
				@media screen {
					display: none;
				}

				list-style-type: none;

				li {
					font-size: $font-size-large;
					line-height: $line-height-3;
				}
			}
		}
	}
</style>
