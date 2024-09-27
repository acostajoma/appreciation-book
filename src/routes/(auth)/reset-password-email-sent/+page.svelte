<script lang="ts">
	import CenteredLayout from '$lib/components/CenteredLayout.svelte';
	import EmailSent from '$lib/icons/EmailSent.svelte';
	import Button from '$lib/components/Button.svelte';
</script>

<CenteredLayout>
	<div class="h-24 w-24 text-green-600">
		<EmailSent />
	</div>
	<h1 class="text-base font-semibold leading-7 text-gray-900 text-center mt-10 mb-3">
		The email with instructions to reset the password has been sent successfully.
	</h1>
	<!-- @todo edit this url -->
	<Button additionalClasses="mt-5" href="/">Ir a inicio</Button>
</CenteredLayout>
