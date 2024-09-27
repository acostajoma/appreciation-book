<script lang="ts">
	import CenteredLayout from '$lib/components/CenteredLayout.svelte';
	import Button from '$lib/components/Button.svelte';
	import Success from '$lib/icons/Success.svelte';
</script>

<CenteredLayout>
	<div class="h-24 w-24 text-green-600">
		<Success />
	</div>
	<h1 class="text-base font-semibold leading-7 text-gray-900 text-center mt-10 mb-3">
		The password has been successfully changed.
	</h1>
	<Button additionalClasses="mt-5" href="/">Go to homepage</Button>
</CenteredLayout>
