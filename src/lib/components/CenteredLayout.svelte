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
		<div class="sm:mx-auto sm:w-full sm:max-w-md mb-10">
			<h1 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
				{title}
			</h1>
		</div>
	{/if}

	{@render children()}
</main>
