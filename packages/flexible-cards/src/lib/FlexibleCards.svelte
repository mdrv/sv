<script lang='ts'>
	import { onMount } from 'svelte'
	import type { ClassValue } from 'svelte/elements'
	import type { FlexibleCardsItem } from './Card.svelte'
	import Card from './Card.svelte'

	type CardStackProps = {
		cards: FlexibleCardsItem[]
		orientation: 'horizontal' | 'vertical'
		style?: string
		class?: ClassValue
		wheel?: boolean
	}

	let { cards, orientation, style, class: className, wheel = false }:
		CardStackProps = $props()

	let container: HTMLDivElement | null = null

	let isDragging = false
	let startX = 0
	let startY = 0
	let scrollLeft = 0
	let scrollTop = 0

	function onPointerDown(e: PointerEvent) {
		if (!container) return
		if (e.button !== 0) return
		isDragging = true
		startX = e.pageX - container.offsetLeft
		startY = e.pageY - container.offsetTop
		scrollLeft = container.scrollLeft
		scrollTop = container.scrollTop
		container.style.cursor = 'grabbing'
	}
	function onPointerMove(e: PointerEvent) {
		if (!container) return
		if (!isDragging) return
		e.preventDefault()
		const x = e.pageX - container.offsetLeft
		const y = e.pageY - container.offsetTop
		if (orientation === 'horizontal') {
			container.scrollLeft = scrollLeft - (x - startX)
		} else {
			container.scrollTop = scrollTop - (y - startY)
		}
	}
	function onPointerUp() {
		if (!container) return
		isDragging = false
		container.style.cursor = 'grab'
	}

	onMount(() => {
		// Ref: https://alvarotrigo.com/blog/scroll-horizontally-with-mouse-wheel-vanilla-java/
		if (!container) return
		if (orientation === 'horizontal' && wheel) {
			container.addEventListener('wheel', (e: WheelEvent) => {
				if (!container) return
				const bBox = container.getBoundingClientRect()

				// check if the element is inside viewport
				// if (bBox.top < 0 || bBox.bottom > window.innerHeight) {
				// 	return
				// }

				// handle leftmost
				if (
					e.deltaY < 0
					&& container.scrollLeft === 0
				) {
					return
				}

				// handle rightmost
				if (
					e.deltaY > 0
					&& container.scrollLeft + container.clientWidth
						>= container.scrollWidth
				) {
					return
				}

				e.preventDefault()
				container.scrollLeft += e.deltaY
			})
		}
	})
</script>

<div
	bind:this={container}
	class={['stack', className]}
	onpointerdown={onPointerDown}
	onpointermove={onPointerMove}
	onpointerup={onPointerUp}
	onpointerleave={onPointerUp}
	role='region'
	style:display='flex'
	style:flex-direction={orientation === 'horizontal' ? 'row' : 'column'}
	style:overflow-x={orientation === 'horizontal' ? 'auto' : 'hidden'}
	style:overflow-y={orientation === 'vertical' ? 'auto' : 'hidden'}
	style:cursor='grab'
	style:overflow='auto'
	style:white-space='nowrap'
	style:scroll-behavior='smooth'
	style:user-select='none'
	{style}
>
	{#each cards as card}
		<Card {...card} {orientation} />
	{/each}
</div>

<style>
	.stack.horizontal {
		display: flex;
		flex-direction: row;
		overflow-x: auto;
		overflow-y: hidden;
	}
	.stack.vertical {
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		overflow-x: hidden;
	}
</style>
