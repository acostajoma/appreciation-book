<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import { getContext, type Snippet } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { type SuperForm } from 'sveltekit-superforms';

	type Props = {
		formName: string;
		title: string;
		description: string;
		children: Snippet;
		isSingleSection?: boolean;
		isLastItem?: boolean;
		saveButtonText?: string;
		flashMsgContextName?: string;
		cancelOrResetButton?: Snippet;
	};
	let {
		formName,
		title,
		description,
		isSingleSection = true,
		children,
		isLastItem = isSingleSection ? true : false,
		saveButtonText = 'Guardar',
		flashMsgContextName,
		cancelOrResetButton,
	}: Props = $props();

	const superformStore: SuperForm<any> = getContext(formName) || {};
	const flashMsgContext:
		| Writable<
				| {
						type: 'success' | 'error';
						message: string;
				  }
				| undefined
		  >
		| undefined = isLastItem ? getContext(flashMsgContextName) : undefined;
	const { submitting } = superformStore;
</script>

<div class="px-4 sm:px-0">
	<h2 class="text-base font-semibold leading-7 text-gray-900">{title}</h2>
	<p class="mt-1 text-sm leading-6 text-gray-600">
		{description}
	</p>
</div>
<div
	class="bg-white sm:rounded-xl md:col-span-2{isSingleSection
		? ' shadow-sm ring-1 ring-gray-900/5'
		: ''}"
>
	<div
		class="px-4 py-6 sm:p-8 {!isSingleSection && !isLastItem
			? ' border-b border-gray-900/10 '
			: ''}"
	>
		<div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
			{@render children()}
		</div>
	</div>

	{#if isLastItem}
		<div
			class="flex items-center justify-between gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8"
		>
			<div>
				{#if $flashMsgContext}
					{@const textColor = $flashMsgContext.type === 'error' ? 'text-red-600' : 'text-green-600'}
					<p class={`my-2 text-sm pl-8 ${textColor}`}>
						{$flashMsgContext.message}
					</p>
				{/if}
			</div>
			<div>
				{#if $submitting}
					<Loader />
				{:else}
					{@render cancelOrResetButton?.()}
					<Button type="submit" {formName}>
						{saveButtonText}
					</Button>
				{/if}
			</div>
		</div>
	{/if}
</div>
