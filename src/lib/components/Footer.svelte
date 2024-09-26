<script lang="ts">
	import { page } from '$app/stores';
	import {
		loginUrl,
		signupUrl,
		passwordResetEmailConfirmation,
		validateUserUrl,
		authFAQ,
	} from '$lib/constants/urls';
	import Button from './Button.svelte';

	let {
		url: { pathname },
	} = $derived($page);
</script>

<!-- Snippet for login and sign-up pages -->
{#snippet footer(href: string, text: string)}
	<footer class="py-6 text-center">
		<Button {href} useButtonStyle={false}>
			{text}
		</Button>
	</footer>
{/snippet}

{#if pathname === loginUrl}
	{@render footer(signupUrl, '¿Aun no tienes una cuenta? Regístrate')}
{:else if pathname === signupUrl}
	{@render footer(loginUrl, '¿Ya tienes una cuenta? Inicia Sesión')}
{:else if pathname === passwordResetEmailConfirmation}
	{@render footer(authFAQ, '¿No recibiste un link para cambiar tu contraseña?')}
{:else if pathname === validateUserUrl}
	<!-- @todo Crear FAQ y dirigir al usuario hacia la pagina  -->
	{@render footer(authFAQ, '¿No recibiste el código en tu correo?')}
{/if}
