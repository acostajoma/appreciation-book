<script lang="ts">
	import type { PageData } from './$types';
	import { untrack } from 'svelte';
	import { setContext } from 'svelte';
	import { superForm } from 'sveltekit-superforms';

	import Sidebar from '$lib/components/Sidebar.svelte';
	import Form from '$lib/components/Form/Form.svelte';
	import Input from '$lib/components/Form/Input.svelte';
	import Book from '$lib/components/Book/Book.svelte';

	type Props = { data: PageData };
	let { data }: Props = $props();
	const formName = 'book-creation';
	const superform = superForm(data.form, { onError: 'apply', dataType: 'json' });
	const { form } = superform;
	setContext(formName, superform);
</script>

<Sidebar
	items={[
		{
			name: 'Add Page',
			action: () => {
				// $form.textArray.push({ frontPageTitle: '', backPageTitle: '', id: crypto.randomUUID() });
				form.set({
					textArray: [
						...$form.textArray,
						{ frontPageTitle: '', backPageTitle: '', id: crypto.randomUUID() },
					],
				});
			},
		},
	]}
>
	<Form
		name={formName}
		class="mx-auto flex w-full max-w-sm flex-col space-y-6"
		superdebugHorizontalLocation="right-0"
	>
		{#each $form.textArray as { id }, index (id)}
			<p class="text-indigo-700 font-bold text-lg mt-3">Sheet #{index + 1}</p>
			<Input
				{formName}
				label="Front Page Title"
				id="front-page-{id}"
				name="front-page-{id}"
				required={false}
				type="text"
				oninput={(event) =>
					($form.textArray[index].frontPageTitle = (event.target as HTMLInputElement).value)}
			/>
			<Input
				{formName}
				label="Back Page Title"
				id="back-page-{id}"
				name="back-page-{id}"
				required={false}
				type="text"
				oninput={(event) =>
					($form.textArray[index].backPageTitle = (event.target as HTMLInputElement).value)}
			/>
		{/each}
	</Form>
</Sidebar>

<main class="ml-72">
	<Book pages={$form.textArray} />
</main>
