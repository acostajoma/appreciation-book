<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import CenteredLayout from '$lib/components/CenteredLayout.svelte';
	import Form from '$lib/components/Form/Form.svelte';
	import Input from '$lib/components/Form/Input.svelte';
	import { forgotPasswordUrl, signupUrl } from '$lib/constants/urls';
	import { setContext } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import AuthProviders from '$lib/components/SignupLinks/AuthProviders.svelte';
	import CenteredCard from '$lib/components/CenteredCard.svelte';

	type Props = { data: PageData };
	let { data }: Props = $props();
	const formName = 'log-in';
	setContext(formName, superForm(data.form, { onError: 'apply' }));
</script>

<CenteredLayout title="Sign in to your account">
	<CenteredCard>
		<Form name={formName} class="mx-auto flex w-full max-w-sm flex-col space-y-6">
			<Input
				label="Email Address"
				id="email-log-in"
				name="email"
				required
				placeholder="example@gmail.com"
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
				autocomplete="current-password"
				{formName}
			/>
			<Button {formName} additionalClasses="mt-4">Sign In</Button>
			<Button
				href={forgotPasswordUrl}
				useButtonStyle={false}
				additionalClasses="mt-4 text-center text-gray-800"
			>
				Forgot your password?
			</Button>
		</Form>
		<AuthProviders />

		{#snippet belowCard()}
			<p class="mt-10 text-center text-sm text-gray-500">
				Not a member?
				<a href={signupUrl} class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
					>Create an account</a
				>
			</p>
		{/snippet}
	</CenteredCard>
</CenteredLayout>
