<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { clickOutside } from '$lib/actions/clickOutside';
	import HamburgerMenu from '$lib/icons/hamburgerMenu.svelte';
	import { fadeScale } from '$lib/utils/transitions';
	import { sineIn, sineOut } from 'svelte/easing';
	import { hamburgerMenuUrls } from '$lib/constants/urls';
	import { page } from '$app/stores';

	let open = $state(false);

	const toggleOpenState: (event: MouseEvent) => void = (event) => {
		event?.stopPropagation();
		open = !open;
	};

	let { pathname } = $derived($page.url);
</script>

<div class="relative ml-3">
	<div>
		<button
			type="button"
			class="relative flex rounded-full bg-gray-800 text-sm focus:outline-none text-gray-400 hover:text-white"
			id="user-menu-button"
			aria-expanded="false"
			aria-haspopup="true"
			onclick={toggleOpenState}
		>
			<span class="absolute -inset-1.5"></span>
			<span class="sr-only">Open user menu</span>
			<HamburgerMenu />
		</button>
	</div>
	{#if open}
		<div
			use:clickOutside={toggleOpenState}
			class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
			role="menu"
			aria-orientation="vertical"
			aria-labelledby="user-menu-button"
			tabindex="-1"
			in:fadeScale={{ duration: 200, easing: sineOut }}
			out:fadeScale={{ duration: 200, easing: sineIn }}
		>
			{#each hamburgerMenuUrls as { href, text, isForm } (href)}
				{@const isActive = pathname === href}
				{#if isForm}
					<form method="post" action={href} class="w-full">
						<!-- We don't use button component here because we need something completely custom -->
						<button
							type="submit"
							onclick={() => invalidate('dependency:logout')}
							class=" w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-400 text-start"
							role="menuitem"
							tabindex="-1"
							id="user-menu-item-0">{text}</button
						>
					</form>
				{:else}
					<a
						{href}
						class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-400"
						class:bg-gray-100={isActive}
						role="menuitem"
						tabindex="-1"
						id="user-menu-item-0">{text}</a
					>
				{/if}
			{/each}
		</div>
	{/if}
</div>
