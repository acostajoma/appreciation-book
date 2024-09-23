<script lang="ts">
	import Page from '$lib/components/book/Page.svelte';

	type Props = {
		pages: Book.Page[];
	};

	let { pages }: Props = $props();
	// Maximum Range is 24 pages
	let pageRange = $derived(Array.from({ length: pages.length + 1 }, (_, index) => index));
</script>

<div class="wrapper">
	<div class="book">
		{#each pageRange as pageNumber}
			<input type="radio" name="book-1" id="c{pageNumber}" />
		{/each}

		{#each pages as { backPageTitle, frontPageTitle, frontPageImage }, index}
			<Page sheetNumber={index} {backPageTitle} {frontPageTitle} {frontPageImage} />
		{/each}
	</div>
</div>

<style>
	.wrapper {
		/* or any other parent wrapper */
		margin: 0 auto;
		display: flex;
		height: 100lvh;
		width: 100%;
		perspective: 1000px;
		font: 16px/1.4 sans-serif;
		overflow: hidden;
		background-color: #232425;
	}

	.book {
		--c: 0;
		display: flex;
		margin: auto;
		width: 150px;
		/*1* let pointer event go trough pages of lower Z than .book */
		pointer-events: none;
		transform-style: preserve-3d;
		transition: translate 1s;
		translate: calc(min(var(--c), 1) * 50%) 0%;
		/* DEMO ONLY: incline on the X axis for pages preview */
		rotate: 1 0 0 25deg;

		[name^='book'] {
			display: none;
		}
		&:has(#c0:checked) {
			--c: 0;
		}
		&:has(#c1:checked) {
			--c: 1;
		}
		&:has(#c2:checked) {
			--c: 2;
		}
		&:has(#c3:checked) {
			--c: 3;
		}
		&:has(#c4:checked) {
			--c: 4;
		}
		&:has(#c5:checked) {
			--c: 5;
		}
		&:has(#c6:checked) {
			--c: 6;
		}
		&:has(#c7:checked) {
			--c: 7;
		}
		&:has(#c8:checked) {
			--c: 8;
		}
		&:has(#c9:checked) {
			--c: 9;
		}
		&:has(#c10:checked) {
			--c: 10;
		}
		&:has(#c11:checked) {
			--c: 11;
		}
		&:has(#c12:checked) {
			--c: 12;
		}
	}
	@media (min-width: 520px) {
		.book {
			width: 220px;
		}
	}
	@media (min-width: 768px) {
		.book {
			width: 330px;
		}
	}

	@media (min-width: 1024px) {
		.book {
			width: 440px;
		}
	}
	@media (min-width: 1280px) {
		.book {
			width: 520px;
		}
	}
	@media (min-width: 1536px) {
		.book {
			width: 650px;
			rotate: 1 0 0 20deg;
		}
	}
</style>
