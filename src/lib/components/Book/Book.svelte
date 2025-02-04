<script lang="ts">
	import Page from '$lib/components/Book/Page.svelte';
	import Button from '../Button.svelte';

	type Props = {
		pages: Book.Page[];
	};

	let { pages }: Props = $props();
	// Maximum Range is 24 pages
	let pageRange = $derived(Array.from({ length: pages.length + 1 }, (_, index) => index));
	let isFullScreen = $state(false);

	const fullScreen = () =>
		isFullScreen ? document.exitFullscreen() : document.body.requestFullscreen();
</script>

<svelte:document onfullscreenchange={() => (isFullScreen = !isFullScreen)} />

<div class="wrapper">
	<div class="book" class:full-screen={isFullScreen}>
		{#each pageRange as pageNumber}
			<input type="radio" name="book-1" id="c{pageNumber}" />
		{/each}

		{#each pages as { backPageTitle, frontPageTitle, frontPageImage, id }, index (id)}
			<Page sheetNumber={index} {backPageTitle} {frontPageTitle} {id} {frontPageImage} />
		{/each}
	</div>
</div>

<div class="button-container">
	<Button onclick={fullScreen} additionalClasses="text-xs w-32"
		>{isFullScreen ? 'Exit ' : ''}Full screen</Button
	>
</div>

<style>
	.wrapper {
		/* or any other parent wrapper */
		margin: 0 auto;
		display: flex;
		flex-direction: column;
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
		min-height: 600px;
		width: 160px;
		/*1* let pointer event go trough pages of lower Z than .book */
		pointer-events: none;
		transform-style: preserve-3d;
		transition: translate 1s;
		translate: calc(min(var(--c), 1) * 50%) 0%;
		rotate: 1 0 0 30deg;

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

	.book.full-screen {
		width: 250px;
		transform: rotateZ(90deg) rotateX(-15deg);
		translate: 0% calc(min(var(--c), 1) * 50%);
		rotate: 1 0 0 0deg;
	}

	.button-container {
		position: absolute;
		bottom: 0px;
		right: 0px;
	}
	@media all and (display-mode: fullscreen) {
		.button-container {
			transform: translate(-20px, -116px) rotate(90deg);
			left: 100%;
		}
	}

	@media (min-width: 520px) {
		.book.full-screen {
			transform: rotateZ(0);
			translate: calc(min(var(--c), 1) * 50%), 0%;
			rotate: 1 0 0 30deg;
		}
		.book {
			width: 220px;
		}
		.button-container {
			display: none;
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
