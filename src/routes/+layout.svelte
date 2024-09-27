<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../app.css';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<div class="flex min-h-screen flex-1 flex-col overflow-hidden bg-gray-50">
	{@render children()}
</div>
