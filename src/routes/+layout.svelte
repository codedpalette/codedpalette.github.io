<slot />

<style lang="scss" global>
	/* stylelint-disable-next-line import-notation */
	@import url($fonts-url);

	html,
	body,
	div#main {
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
	}

	* {
		box-sizing: border-box;
	}

	body {
		background: $white;
		font-family: $main-font-family;
	}
</style>
