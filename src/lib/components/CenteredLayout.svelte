<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		title?: string;
	};

	let { children, title }: Props = $props();
</script>

<main class="flex flex-1 flex-col items-center justify-center pb-24">
	{#if title}
		<h1 class="text-base font-semibold leading-7 text-gray-900 text-center my-10">
			{title}
		</h1>
	{/if}

	{@render children()}
</main>
