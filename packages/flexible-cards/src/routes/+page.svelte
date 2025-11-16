<script lang='ts'>
	import { type FlexibleCardsItem, FlexibleCards } from '$lib/index.ts'
	let cards: FlexibleCardsItem[] = [
		{
			background: '#e88',
			text: 'Hello',
			href: 'https://n.bearcu.id',
			type: 'link',
		},
		{
			background: '#88e',
			text: 'world',
		},
		{
			background: '#88e',
			text: 'is this',
		},
		{
			background: '#88e',
			text: 'really',
		},
		{
			background: '#88e',
			text: 'okay',
		},
	]
</script>

<FlexibleCards {cards} orientation='vertical' />
<FlexibleCards {cards} orientation='horizontal' style='height: 50vh' wheel />
<FlexibleCards {cards} orientation='vertical' />

<style>
	:global(body) {
		scroll-behavior: smooth;
	}
</style>
