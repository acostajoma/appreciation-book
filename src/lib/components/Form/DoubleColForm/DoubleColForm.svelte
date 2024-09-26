<script lang="ts">
	import { dev } from '$app/environment';
	import { PUBLIC_DEBUG } from '$env/static/public';
	import { getContext, type Snippet } from 'svelte';
	import SuperDebug, { type SuperForm } from 'sveltekit-superforms';

	type Props = {
		formName: string;
		action?: string;
		children: Snippet;
	};
	let { action, formName, children }: Props = $props();

	const superformStore: SuperForm<any> = getContext(formName) || {};

	const { form, enhance } = superformStore;
</script>

<div class="space-y-10 divide-y divide-gray-900/10">
	<form
		class="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3"
		{action}
		method="post"
		name={formName}
		use:enhance
	>
		{@render children()}
	</form>
</div>

{#if dev && PUBLIC_DEBUG === '1'}
	<div class="min-w-80 pt-10">
		<p>This SuperDebug Section will only appear on dev mode</p>
		<SuperDebug data={$form} />
	</div>
{/if}

<!-- @component
	Provides a two column form.
	Example: 
	```svelte
<DoubleColForm {formName} action="?/saveData">
	<DoubleColFormSection
		{formName}
		{flashMsgContextName}
		title="Información Personal"
		description="This is a brief description"
	>
		<div class="sm:col-span-3">
			<Input
				label="Número de Teléfono"
				id="phone-profile"
				name="phone"
				required
				type="tel"
				autocomplete="tel"
				{formName}
			/>
		</div>
		</DoubleColFormSection>
</DoubleColForm>
	```
-->
