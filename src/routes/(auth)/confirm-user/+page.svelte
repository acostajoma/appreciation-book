<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Form from '$lib/components/Form/Form.svelte';
	import Input from '$lib/components/Form/Input.svelte';
	import { setContext } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import CenteredLayout from '$lib/components/CenteredLayout.svelte';
	import CenteredCard from '$lib/components/CenteredCard.svelte';
	import { authFAQ } from '$lib/constants/urls';

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();

	const formName = 'confirm-user';
	setContext(
		formName,
		superForm(data.form, {
			onError: 'apply',
		}),
	);
</script>

<CenteredLayout title="Confirm Login">
	<CenteredCard>
		<Form name={formName} class="w-full max-w-sm flex flex-col gap-2 mx-auto">
			<Input
				label="Verification Code"
				id="verification-confirm-user"
				name="verificationCode"
				required
				type="number"
				{formName}
			/>
			<Button {formName} additionalClasses="mt-4">Confirm</Button>
		</Form>
		{#snippet belowCard()}
			<p class="mt-10 text-center text-sm text-gray-500">
				Didn't receive a confirmation code?
				<a href={authFAQ} class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
					>Read what to do</a
				>
			</p>
		{/snippet}
	</CenteredCard>
</CenteredLayout>
