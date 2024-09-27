<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import CenteredLayout from '$lib/components/CenteredLayout.svelte';
	import Form from '$lib/components/Form/Form.svelte';
	import Input from '$lib/components/Form/Input.svelte';
	import { setContext } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import AuthProviders from '$lib/components/SignupLinks/AuthProviders.svelte';
	import { loginUrl } from '$lib/constants/urls';
	import CenteredCard from '$lib/components/CenteredCard.svelte';

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();

	const formName = 'sign-up';
	setContext(
		formName,
		superForm(data.form, {
			onError: 'apply',
		}),
	);
</script>

<CenteredLayout title="Create an account">
	<CenteredCard>
		<Form name={formName} class="w-full max-w-sm flex flex-col  mx-auto space-y-6">
			<Input
				label="Email Address"
				id="email-sign-up"
				name="email"
				required
				placeholder="ejemplo@gmail.com"
				type="email"
				autocomplete="email"
				{formName}
			/>
			<Input
				label="Password"
				id="password-sign-up"
				name="password"
				required
				type="password"
				autocomplete="new-password"
				{formName}
			/>
			<Input
				label="Password Confirmation"
				id="confirm-sign-up"
				name="confirm_password"
				required
				type="password"
				autocomplete="new-password"
				{formName}
			/>

			<Button {formName} additionalClasses="mt-4">Sign Up</Button>
		</Form>
		<AuthProviders />

		{#snippet belowCard()}
			<p class="mt-10 text-center text-sm text-gray-500">
				Have an account?
				<a href={loginUrl} class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
					>Log In</a
				>
			</p>
		{/snippet}
	</CenteredCard>
</CenteredLayout>
