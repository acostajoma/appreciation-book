<script lang="ts">
	import { facebookSignInUrl } from '$lib/constants/urls';
</script>

<a
	href={facebookSignInUrl}
	class="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
>
	<svg enable-background="new 0 0 100 100" viewBox="0 0 100 100" class="h-5 w-5" aria-hidden="true"
		><g id="Layer_1"></g><g id="Layer_2"
			><g
				><path
					d="m50 2.5c-58.892 1.725-64.898 84.363-7.46 95h7.46 7.46c57.451-10.647 51.419-93.281-7.46-95z"
					fill="#1877f2"
				></path><path
					d="m57.46 64.104h11.125l2.117-13.814h-13.242v-8.965c0-3.779 1.85-7.463 7.781-7.463h6.021v-11.761c-12.894-2.323-28.385-1.616-28.722 17.66v10.529h-12.123v13.814h12.123v33.396h7.46 7.46z"
					fill="#f1f1f1"
				></path></g
			></g
		></svg
	>
	<span class="text-sm font-semibold leading-6">Facebook</span>
</a>
