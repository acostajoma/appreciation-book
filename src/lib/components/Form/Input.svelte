<script lang="ts">
	import { getContext } from 'svelte';
	import { type FullAutoFill, type HTMLInputTypeAttribute } from 'svelte/elements';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms';
	import Label from './Label.svelte';

	type Props = {
		label: string;
		id: string;
		name: string;
		type: HTMLInputTypeAttribute;
		required: boolean;
		formName: string;
		disabled?: boolean;
		placeholder?: string;
		autocomplete?: FullAutoFill | null | undefined;
	};
	let {
		label,
		id,
		name,
		type,
		formName,
		placeholder,
		required,
		disabled = false,
		autocomplete,
	}: Props = $props();

	const superformStore: SuperForm<any> = getContext(formName);
	const { value, errors, constraints } = formFieldProxy(superformStore, name);
</script>

<div>
	<Label forId={id} {required} inputName={name}>
		{label}
	</Label>
	<div class="relative mt-2 rounded-md shadow-sm">
		<input
			{id}
			{name}
			{type}
			{placeholder}
			{required}
			{disabled}
			{autocomplete}
			aria-describedby={!required ? `${name}-optional` : undefined}
			aria-errormessage={`${name}-error`}
			aria-required={required}
			aria-invalid={$errors ? 'true' : undefined}
			bind:value={$value}
			class={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6
            ${$errors ? '!text-red-900 !ring-red-300 focus:!ring-red-500' : ''}`}
			{...$constraints}
		/>
		{#if $errors}
			<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
				<svg
					class="h-5 w-5 text-red-600"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						fill-rule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
						clip-rule="evenodd"
					></path>
				</svg>
			</div>
		{/if}
	</div>

	{#if $errors}
		<p class="mt-2 text-sm text-red-600" id={`${name}-error`}>{$errors}</p>
	{/if}
</div>
