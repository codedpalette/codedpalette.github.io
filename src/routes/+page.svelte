<canvas id="background"></canvas>
<div id="flex-container">
	<div id="content-container">
		<!-- TODO: Rewrite text-->
		<h1>Hello, world</h1>
		<h2>my name is Daniel</h2>
		<h3>and I enjoy making computers draw beautiful stuff</h3>
		<nav>
			<ul>
				<li><a href="/about">About</a></li>
				<li><a href="/gallery">Gallery</a></li>
				<li><a href="mailto:daniel.blindr@gmail.com">Contact</a></li>
			</ul>
		</nav>
	</div>
</div>

<style>
	#background {
		background: rgb(23, 25, 28);
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}
	#flex-container {
		color: rgb(232, 230, 227);
		width: 100vw;
		height: 100vh;
		display: flex;
		overflow: hidden;
		position: relative;
		max-width: 100%;
		text-align: center;
		align-items: center;
		text-transform: uppercase;
		justify-content: center;
	}
	#content-container {
		text-shadow: rgb(200, 202, 205) 0px 0px 10px;
		font-family: sans-serif; /* TODO: custom font */
		padding: 18px !important;
		max-width: 550px;
		width: 100%;
	}
	h1,
	h2,
	h3 {
		font-weight: 900;
	}
	h1 {
		font-family: monospace;
		font-size: 4em;
	}
	h2 {
		font-size: 2em;
		margin: 0px;
	}
	h3 {
		margin-top: 0px;
	}
	nav {
		font-style: italic;
		font-weight: 600;
		text-transform: uppercase;
		align-items: start;
	}
	ul {
		margin: 0px;
		display: flex;
		padding: 0px;
		list-style: none;
		flex-direction: row;
		justify-content: center;
	}
	a {
		display: block;
		padding: 18px 36px;
		text-decoration: none;
		color: inherit;
		border-bottom: 4px solid transparent;
		background-color: transparent;
	}
</style>
