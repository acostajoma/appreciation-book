<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		belowCard?: Snippet;
	};
	let { children, belowCard }: Props = $props();
</script>

<div class="sm:mx-auto sm:w-full sm:max-w-[480px]">
	<div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
		{@render children()}
	</div>

	{@render belowCard?.()}
</div>
