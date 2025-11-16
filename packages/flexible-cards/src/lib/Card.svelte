<script module lang='ts'>
	export type FlexibleCardsItem = {
		type?: 'snippet' | 'button' | 'link'
		background?: string
		image?: string
		text?: string
		href?: string
		orientation?: 'horizontal' | 'vertical'
	}
</script>

<script lang='ts'>
	let {
		type = 'snippet',
		background = '#fff',
		image = '',
		text = '',
		href = '',
		orientation = 'horizontal',
	}: FlexibleCardsItem = $props()
</script>

<div class='card' style:background={background}>
	{#if image}
		<img src={image} alt='' class='card-image' />
	{/if}
	{#if type === 'button'}
		<button class='card-content'>{text}</button>
	{:else if type === 'link'}
		<a href={href} class='card-content link-overlay' draggable='false'>{
			text
		}</a>
	{:else}
		<div class='card-content'>{text}</div>
	{/if}
</div>

<style>
	a {
		text-decoration: inherit;
		color: inherit;
		/* cursor: auto; */
	}

	.link-overlay::before {
		content: "";
		position: absolute;
		inset: 0;
		z-index: 0;
	}

	.card {
		min-width: 200px;
		min-height: 120px;
		margin: 8px;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		position: relative;
	}
	.card-image {
		width: 100%;
		height: 80px;
		object-fit: cover;
	}
	.card-content {
		padding: 12px;
		text-align: center;
	}
</style>
