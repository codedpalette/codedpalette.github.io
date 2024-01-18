<script lang="ts">
	import Flex from '$lib/components/Flex.svelte';

	import Content from './Content.svelte';
</script>

<Flex stretch width="wide">
	<a href="/about/pdf" download="resume.pdf">Save as pdf</a>
	<Content />
</Flex>
