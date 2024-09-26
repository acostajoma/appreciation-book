<script lang="ts">
	import SelectMenu from '$lib/components/Form/SelectMenu.svelte';
	import { getContext } from 'svelte';
	import { locationMap } from '$lib/utils/locationData.svelte';
	import { type SuperForm } from 'sveltekit-superforms';
	import type { SvelteMap, SvelteSet } from 'svelte/reactivity';
	import TextArea from '$lib/components/Form/TextArea.svelte';

	type Props = {
		formName: string;
	};
	let { formName }: Props = $props();

	const superformStore: SuperForm<any> = getContext(formName) || {};
	const { form } = superformStore;

	let { province, canton, district } = $derived($form);

	const provinces = Array.from(locationMap.keys());
	// svelte-ignore state_referenced_locally
	const provinceCustomFirstOption = province;
	// svelte-ignore state_referenced_locally
	const cantonCustomFirstOption = canton;
	// svelte-ignore state_referenced_locally
	const districtCustomFirstOption = district;

	// Avoid using derived state inside derived state to prevent UI re-renders
	let cantons = $state<SvelteMap<string, SvelteSet<string>> | undefined>(undefined);
	$effect(() => {
		cantons = locationMap.get(province);
	});

	let districts = $state<SvelteSet<string> | undefined>(undefined);
	$effect(() => {
		districts = cantons?.get(canton);
	});

	let cantonsArray = $derived(cantons ? Array.from(cantons.keys()) : []);
	let districtArray = $derived(districts ? Array.from(districts.keys()) : []);
</script>

<div class="sm:col-span-full">
	<TextArea label="Dirección" id="post-address" name="address" required={false} {formName} />
</div>
<div class="sm:col-span-3">
	<SelectMenu
		label="Provincia"
		options={provinces}
		id="post-province"
		name="province"
		required
		{formName}
		customFirstOption={provinceCustomFirstOption}
	/>
</div>
<div class="sm:col-span-3">
	<SelectMenu
		label="Cantón"
		options={cantonsArray}
		id="post-canton"
		name="canton"
		disabled={cantonsArray.length === 0}
		required
		{formName}
		customFirstOption={cantonCustomFirstOption}
	/>
</div>
<div class="sm:col-span-3">
	<SelectMenu
		label="Distrito"
		options={districtArray}
		id="post-district"
		name="district"
		disabled={districtArray.length === 0}
		required
		customFirstOption={districtCustomFirstOption}
		{formName}
	/>
</div>
