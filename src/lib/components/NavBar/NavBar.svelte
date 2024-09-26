<script lang="ts">
	import { page } from '$app/stores';
	import { invalidate } from '$app/navigation';
	import { hamburgerMenuUrls, highlightedUrls } from '$lib/constants/urls';
	import AdditionSign from '$lib/icons/additionSign.svelte';
	import Button from '../Button.svelte';
	import DropdownMenu from './DropdownMenu.svelte';

	type Props = {
		authenticatedUser: boolean;
	};

	let { authenticatedUser }: Props = $props();

	let {
		href: highlightedHref,
		text: highlightedText,
		useLogo,
	} = $derived(highlightedUrls[authenticatedUser ? 'logged' : 'notLogged']);

	let open = $state(false);
	let { pathname } = $derived($page.url);
</script>

{#snippet link(href: string, isActive: boolean, i: number, text: string)}
	<a
		{href}
		class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
		class:bg-gray-900={isActive}
		role="menuitem"
		tabindex="-1"
		id="user-menu-item-{i}">{text}</a
	>
{/snippet}

<nav class="bg-gray-800 mb-4">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 justify-between">
			<div class="flex">
				<div class="-ml-2 mr-2 flex items-center md:hidden">
					<!-- Mobile menu button -->
					<button
						type="button"
						class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
						aria-controls="mobile-menu"
						aria-expanded="false"
						onclick={() => (open = !open)}
					>
						<span class="absolute -inset-0.5"></span>
						<span class="sr-only">Open main menu</span>

						<svg
							class="block h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							aria-hidden="true"
							class:hidden={open}
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
							></path>
						</svg>

						<svg
							class="hidden h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							aria-hidden="true"
							class:hidden={!open}
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</button>
				</div>
				<div class="flex flex-shrink-0 items-center">
					<a href="/">
						<img
							class="h-8 w-auto"
							src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
							alt="Your Company"
						/>
					</a>
				</div>
				<div class="hidden md:ml-6 md:flex md:items-center md:space-x-4">
					<!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
					<a
						href="#"
						class="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
						aria-current="page">Dashboard</a
					>
					<a
						href="#"
						class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
						>Team</a
					>
					<a
						href="#"
						class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
						>Projects</a
					>
					<a
						href="#"
						class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
						>Calendar</a
					>
				</div>
			</div>
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<Button href={highlightedHref}>
						{highlightedText}
						{#snippet icon()}
							{#if useLogo}
								<AdditionSign />
							{/if}
						{/snippet}
					</Button>
				</div>
				<div class="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
					<button
						type="button"
						class="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
					>
						<span class="absolute -inset-1.5"></span>
						<span class="sr-only">View notifications</span>
						<svg
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
							></path>
						</svg>
					</button>

					{#if authenticatedUser}
						<DropdownMenu />
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Mobile menu, show/hide based on menu state. -->
	<div class="md:hidden" id="mobile-menu" class:not-visible={!open} class:visible={open}>
		<div class="space-y-1 px-2 pb-3 pt-2 sm:px-3">
			<!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->

			<a
				href="#"
				class="block rounded-md px-3 py-2 text-base font-medium text-white"
				aria-current="page">Dashboard</a
			>
			<a
				href="#"
				class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
				>Team</a
			>
			<a
				href="#"
				class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
				>Projects</a
			>
			<a
				href="#"
				class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
				>Calendar</a
			>
		</div>
		<div class="border-t border-gray-700 pb-3 pt-2">
			<div class="mt-3 space-y-1 px-2 sm:px-3">
				{#each hamburgerMenuUrls as { href, text, isForm }, i (href)}
					{@const isActive = pathname === href}
					{#if isForm}
						<form method="post" action={href} class="w-full">
							<!-- We don't use button component here because we need something completely custom -->
							<button
								type="submit"
								onclick={() => invalidate('dependency:logout')}
								class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
								role="menuitem"
								tabindex="-1"
								id="user-menu-item-{i}">{text}</button
							>
						</form>
					{:else}
						{@render link(href, isActive, i, text)}
					{/if}
				{/each}
			</div>
		</div>
	</div>
</nav>

<style>
	.not-visible {
		visibility: hidden;
		opacity: 0;
		transform: scale(0.9);
		height: 0;
		transition:
			opacity 0.5s ease,
			transform 0.5s ease,
			height 0.5s ease;
	}

	.visible {
		visibility: visible;
		opacity: 1;
		transform: scale(1);
		height: 375px;
		transition:
			opacity 0.5s ease,
			transform 0.5s ease,
			height 0.5s ease;
	}
</style>
