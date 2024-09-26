<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import type { SuperForm } from 'sveltekit-superforms';
	import Loader from './Loader.svelte';

	type Props = {
		children: Snippet;
		icon?: Snippet;
		class?: string;
		additionalClasses?: string;
		type?: 'button' | 'submit' | 'reset' | null | undefined;
		href?: string;
		formName?: string;
		formaction?: string;
		useButtonStyle?: boolean;
	};
	let {
		children,
		icon,
		additionalClasses = '',
		class: providedClass, // this is for components that need a different look
		href = $bindable(undefined),
		type = href ? undefined : 'submit',
		formaction,
		formName,
		useButtonStyle = true,
	}: Props = $props();

	const _class =
		providedClass ??
		`rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-slate-100 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none${icon ? ' relative inline-flex items-center gap-x-1.5' : ''}`;
	const linkClass = 'text-sm hover:underline';
	const superFormStore: SuperForm<any> | undefined = formName
		? getContext<SuperForm<any>>(formName)
		: undefined;

	let tainted = $derived(superFormStore?.tainted);
	let submitting = $derived(superFormStore?.submitting);
	let disabled = $derived(!superFormStore?.isTainted($tainted));
</script>

{#if !$submitting}
	<svelte:element
		this={href ? 'a' : 'button'}
		{formaction}
		{type}
		{disabled}
		{href}
		class={`${useButtonStyle ? _class : linkClass} ${additionalClasses}`}
	>
		{#if icon}
			{@render icon()}
		{/if}
		{@render children()}
	</svelte:element>
{:else}
	<Loader />
{/if}
