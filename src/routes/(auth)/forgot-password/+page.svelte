<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { setContext } from 'svelte';
	import CenteredLayout from '$lib/components/CenteredLayout.svelte';
	import Input from '$lib/components/Form/Input.svelte';
	import Form from '$lib/components/Form/Form.svelte';
	import Button from '$lib/components/Button.svelte';
	import CenteredCard from '$lib/components/CenteredCard.svelte';
	import { loginUrl } from '$lib/constants/urls';

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();

	const formName = 'forgot-password';
	setContext(
		formName,
		superForm(data.form, {
			onError: 'apply',
		}),
	);
</script>

<CenteredLayout title="Forgot your password?">
	<CenteredCard>
		<Form name={formName} class="w-full max-w-sm flex flex-col gap-2 mx-auto">
			<Input
				label="Email Address"
				id="email-log-in"
				name="email"
				required
				placeholder="ejemplo@gmail.com"
				type="email"
				autocomplete="email"
				{formName}
			/>
			<Button {formName} additionalClasses="mt-4">Receive password reset instructions</Button>
		</Form>
		{#snippet belowCard()}
			<p class="mt-10 text-center text-sm text-gray-500">
				Didn't forgot your password?
				<a href={loginUrl} class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
					>Go back to login page</a
				>
			</p>
		{/snippet}
	</CenteredCard>
</CenteredLayout>
