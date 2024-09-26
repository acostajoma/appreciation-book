<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		title: string;
		questionsAndAnswers: {
			question: string;
			snippet?: () => ReturnType<Snippet>;
			text?: string;
		}[];
	};
	let { title, questionsAndAnswers }: Props = $props();
</script>

<div class="bg-white">
	<div class="mx-auto max-w-7xl divide-y divide-gray-900/10 px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
		<h2 class="text-2xl font-bold leading-10 tracking-tight text-gray-900">
			{title}
		</h2>
		<dl class="mt-10 space-y-8 divide-y divide-gray-900/10">
			{#each questionsAndAnswers as { question, snippet, text } (question)}
				<div class="pt-8 lg:grid lg:grid-cols-12 lg:gap-8">
					<dt class="text-base font-semibold leading-7 text-gray-900 lg:col-span-5">
						{question}
					</dt>
					<dd class="mt-4 lg:col-span-7 lg:mt-0">
						<p class="text-base leading-7 text-gray-600">
							{#if snippet}
								{@render snippet()}
							{/if}
							{#if text}
								{text}
							{/if}
						</p>
					</dd>
				</div>
			{/each}
		</dl>
	</div>
</div>
