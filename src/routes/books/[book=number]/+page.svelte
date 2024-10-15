<script>
	import Book from '$lib/components/Book/Book.svelte';
</script>

<Book
	pages={[
		{ frontPageTitle: 'Pagina 1', backPageTitle: 'Pagina 2' },
		{ frontPageTitle: 'Pagina 3', backPageTitle: 'Pagina 4', frontPageImage: '/test-image.webp' },
		{ frontPageTitle: 'Pagina 5', backPageTitle: 'Pagina 6' },
		{ frontPageTitle: 'Pagina 7', backPageTitle: 'Pagina 8' },
		{ frontPageTitle: 'Pagina 9', backPageTitle: 'Pagina 10' },
		{ frontPageTitle: 'Pagina 12', backPageTitle: 'Pagina 12' },
		{ frontPageTitle: 'Pagina 13', backPageTitle: 'Pagina 14' },
		{ frontPageTitle: 'Pagina 15', backPageTitle: 'Pagina 16' },
		{ frontPageTitle: 'Pagina 17', backPageTitle: 'Pagina 18' },
		{ frontPageTitle: 'Pagina 19', backPageTitle: 'Pagina 20' },
		{ frontPageTitle: 'Pagina 21', backPageTitle: 'Pagina 22' },
		{ frontPageTitle: 'Pagina 23', backPageTitle: 'Pagina 24' },
	]}
/>

<style>
	:global(main) {
		/* or any other parent wrapper */
		margin: 0;
		display: flex;
		height: 100dvh;
		perspective: 1000px;
		font: 16px/1.4 sans-serif;
		overflow: hidden;
		background-color: #232425;
	}
</style>
