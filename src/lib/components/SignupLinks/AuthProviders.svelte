<script lang="ts">
	import FacebookSignUp from './FacebookSignUp.svelte';
	import GoogleSignUp from './GoogleSignUp.svelte';
</script>

<div>
	<div class="relative mt-10">
		<div class="absolute inset-0 flex items-center" aria-hidden="true">
			<div class="w-full border-t border-gray-200"></div>
		</div>
		<div class="relative flex justify-center text-sm font-medium leading-6">
			<span class="bg-white px-6 text-gray-900">Or continue with</span>
		</div>
	</div>

	<div class="mt-6 grid grid-cols-2 gap-4">
		<GoogleSignUp />
		<FacebookSignUp />
	</div>
</div>
