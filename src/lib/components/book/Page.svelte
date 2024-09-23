<script lang="ts">
	let {
		frontPageTitle,
		backPageTitle,
		frontPageImage,
		backPageImage,
		sheetNumber
	}: Book.Page & { sheetNumber: number } = $props();
</script>

<div class="page" style="--i:{sheetNumber};">
	<div class="front">
		<label for="c{sheetNumber + 1}"></label>
		<h2>
			{frontPageTitle}
		</h2>
		{#if frontPageImage}
			<img src={frontPageImage} alt="img {sheetNumber + 1}" />
		{/if}
	</div>
	<div class="back">
		<label for="c{sheetNumber}"></label>
		<h2>
			{backPageTitle}
		</h2>
		{#if backPageImage}
			<img src={backPageImage} alt="img {(sheetNumber + 1) * 2}" />
		{/if}
	</div>
</div>

<style>
	.page {
		--thickness: 5;
		/* PS: Don't go below thickness 0.4 or the pages might transpare */
		flex: none;
		display: flex;
		width: 100%;
		/*1* allow pointer events on pages */
		pointer-events: all;
		user-select: none;
		transform-style: preserve-3d;
		border: 1px solid #0008;
		transform-origin: left center;
		transition:
			transform 1s,
			rotate 1s ease-in calc((min(var(--i), var(--c)) - max(var(--i), var(--c))) * 50ms);
		translate: calc(var(--i) * -100%) 0px 0px;
		transform: translateZ(calc((var(--c) - var(--i) - 0.5) * calc(var(--thickness) * 1px)));
		rotate: 0 1 0 calc(clamp(0, var(--c) - var(--i), 1) * -180deg);

		label {
			position: absolute;
			top: 0;
			left: 0;
			background: red;
			display: block;
			width: 100%;
			height: 100%;
			opacity: 0;
		}

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	.front,
	.back {
		flex: none;
		width: 100%;
		padding: 2rem;
		backface-visibility: hidden;
		background-color: #fff;
		/* Fix backface visibility Firefox: */
		translate: 0px;
	}

	.back {
		background-image: linear-gradient(to right, #fff 80%, #ddd 100%);
		translate: -100% 0;
		rotate: 0 1 0 180deg;
	}
</style>
