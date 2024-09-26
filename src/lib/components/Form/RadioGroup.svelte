<script lang="ts">
	import { getContext } from 'svelte';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms';
	import Label from './Label.svelte';

	type Props = {
		legend: string;
		name: string;
		formName: string;
		options: {
			label: string;
			id: string;
			radioValue: string | boolean | number;
			disabled?: boolean;
		}[];
		required?: boolean;
	};
	let { legend, name, formName, options, required = true }: Props = $props();

	const superformStore: SuperForm<any> = getContext(formName);
	const { value, errors } = formFieldProxy(superformStore, name);
</script>

<fieldset>
	<div class="flex justify-between">
		<legend class="text-sm font-semibold leading-6 text-gray-90">
			{legend}
		</legend>
		{#if !required}
			<span class="text-sm leading-6 text-gray-500" id={`${name}-optional`}>Opcional</span>
		{/if}
	</div>
	<div class="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
		{#each options as { label, id, radioValue, disabled } (label)}
			{@const checked = radioValue === $value}
			<div class="relative flex items-start py-4">
				<div class="min-w-0 flex-1 text-sm leading-6">
					<Label forId={id} required inputName={name} additionalClasses="w-full w-full min-h-6">
						{label}
					</Label>
				</div>
				<div class="ml-3 flex h-6 items-center">
					<input
						value={radioValue}
						bind:group={$value}
						{disabled}
						{checked}
						aria-checked={checked}
						{id}
						{name}
						type="radio"
						class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
					/>
				</div>
			</div>
		{/each}
	</div>
	{#if $errors}
		<p class="mt-2 text-sm text-red-600" id={`${name}-error`}>{$errors}</p>
	{/if}
</fieldset>
