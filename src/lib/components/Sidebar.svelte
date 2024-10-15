<script lang="ts">
	import type { Snippet } from 'svelte';

	import Add from '$lib/icons/Add.svelte';

	type Props = {
		items: {
			name: string;
			action: () => void;
		}[];
		children?: Snippet;
	};

	let { items, children }: Props = $props();
</script>

<div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
	<!-- Sidebar component, swap this element with another sidebar if you like -->
	<div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
		<div class="flex h-16 shrink-0 items-center">
			<img
				class="h-8 w-auto"
				src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
				alt="Your Company"
			/>
		</div>
		<nav class="flex flex-1 flex-col">
			<ul role="list" class="flex flex-1 flex-col gap-y-7">
				{#if children}
					<li>
						<ul>
							{@render children()}
						</ul>
					</li>
				{/if}
				<li class="mb-10">
					<ul role="list" class="-mx-2 space-y-1">
						{#each items as { name, action } (name)}
							<li class="text-gray-700 hover:text-indigo-600">
								<button class="flex" type="button" onclick={action}>
									<Add />
									<p class="ml-2">{name}</p>
								</button>
							</li>
						{/each}
					</ul>
				</li>
			</ul>
		</nav>
	</div>
</div>
