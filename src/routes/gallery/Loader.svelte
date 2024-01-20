<div class="lds-grid">
	<div></div>
	<div></div>
	<div></div>
	<div></div>
	<div></div>
	<div></div>
	<div></div>
	<div></div>
	<div></div>
</div>

<style lang="scss">
	@use 'sass:math';

	.lds-grid {
		display: inline-block;
		position: relative;
		width: 80px;
		height: 80px;

		div {
			position: absolute;
			width: 16px;
			height: 16px;
			border-radius: 50%;
			background: $black;
			animation: lds-grid 1.2s linear infinite;

			@for $child from 0 to 9 {
				$row: math.floor(math.div($child, 3));
				$column: $child % 3;

				&:nth-child(#{$child + 1}) {
					top: 8px + $row * 24px;
					left: 8px + $column * 24px;
					animation-delay: -0.4s * ($row + $column);
				}
			}
		}
	}

	@keyframes lds-grid {
		0%,
		100% {
			opacity: 1;
		}

		50% {
			opacity: 0.5;
		}
	}
</style>
