<script lang="ts">
	import { getContext, untrack } from 'svelte';
	import Label from './Label.svelte';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms';

	type Props = {
		label: string;
		id: string;
		required: boolean;
		formName: string;
		name: string;
		options: (string | number)[] | readonly [string, ...string[]];
		containerClasses?: string;
		disabled?: boolean;
		selectFirstOptionOnCreation?: boolean;
		customFirstOption?: string;
	};

	let {
		label,
		options,
		id,
		required,
		formName,
		name,
		containerClasses,
		disabled,
		selectFirstOptionOnCreation,
		customFirstOption,
	}: Props = $props();

	const superformStore: SuperForm<any> = getContext(formName);
	const { value, errors, constraints } = formFieldProxy(superformStore, name);

	$effect(() => {
		if (untrack(() => selectFirstOptionOnCreation)) {
			untrack(() => value).set(options[0]);
		}
	});
</script>

<div class={containerClasses}>
	<Label forId={id} {required} inputName={name}>
		{label}
	</Label>
	<select
		bind:value={$value}
		{id}
		{name}
		class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
		{disabled}
		{...$constraints}
	>
		{#if customFirstOption}
			<option disabled>{customFirstOption}</option>
		{/if}

		{#each options as option (option)}
			<option>{option}</option>
		{/each}
	</select>

	{#if $errors}
		<p class="mt-2 text-sm text-red-600" id={`${name}-error`}>{$errors}</p>
	{/if}
</div>
