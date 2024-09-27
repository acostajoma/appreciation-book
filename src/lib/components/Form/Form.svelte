<script lang="ts">
	import { dev } from '$app/environment';
	import { PUBLIC_DEBUG } from '$env/static/public';
	import { getContext, type Snippet } from 'svelte';
	import SuperDebug, { type SuperForm } from 'sveltekit-superforms';

	type Props = {
		children: Snippet;
		action?: string;
		name?: string;
		class?: string;
	};
	let { children, action, name, class: _class }: Props = $props();

	const superformStore: SuperForm<any> = getContext(name) || {};
	const { form, message, enhance } = superformStore;
</script>

<form method="post" {action} {name} use:enhance class={_class}>
	{@render children()}

	{#if $message}
		<p
			class="mt-2 text-sm"
			class:text-green-600={$message.success}
			class:text-red-600={!$message.success}
		>
			{$message.message}
		</p>
	{/if}
</form>

{#if dev && PUBLIC_DEBUG === '1'}
	<div class="min-w-80 pt-10 fixed bottom-10">
		<p>This SuperDebug Section will only appear on dev mode</p>
		<SuperDebug data={$form} />
	</div>
{/if}
