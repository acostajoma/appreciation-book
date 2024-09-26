<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import CenteredLayout from '$lib/components/CenteredLayout.svelte';
	import Form from '$lib/components/Form/Form.svelte';
	import Input from '$lib/components/Form/Input.svelte';
	import { forgotPasswordUrl } from '$lib/constants/urls';
	import { setContext } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';

	type Props = { data: PageData };
	let { data }: Props = $props();
	const formName = 'log-in';
	setContext(formName, superForm(data.form, { onError: 'apply' }));
</script>

<CenteredLayout title="Inicia Sesión">
	<Form name={formName} class="mx-auto flex w-full max-w-sm flex-col gap-2">
		<Input
			label="Correo Electrónico"
			id="email-log-in"
			name="email"
			required
			placeholder="ejemplo@gmail.com"
			type="email"
			autocomplete="email"
			{formName}
		/>
		<Input
			label="Contraseña"
			id="password-sign-up"
			name="password"
			required
			type="password"
			autocomplete="current-password"
			{formName}
		/>
		<Button {formName} additionalClasses="mt-4">Iniciar Sesión</Button>
		<Button
			href={forgotPasswordUrl}
			useButtonStyle={false}
			additionalClasses="mt-4 text-center text-gray-800"
		>
			¿Olvidaste tu contraseña?
		</Button>
	</Form>
	<a href="/login/google">Sign in with Google</a>
</CenteredLayout>
