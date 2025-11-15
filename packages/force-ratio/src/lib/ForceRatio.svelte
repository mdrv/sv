<!--
@component

A constrainer to specific aspect ratio. Default to 1x1.
-->

<script module lang='ts'>
	import type * as CSS from 'csstype'
	import type { Snippet } from 'svelte'
	import type { ClassValue } from 'svelte/elements'
	import { MediaQuery } from 'svelte/reactivity'

	export type ForceRatioMode = {
		width: number
		height: number
		restrictWidth?: boolean
		restrictHeight?: boolean
		padding: number | string | null
	}

	const DEFAULT_MODE: ForceRatioMode = {
		width: 1,
		height: 1,
		padding: 0,
	}
	const DEFAULT_CONTAINER_TYPE: CSS.Properties['containerType'] = 'size'
</script>

<script lang='ts'>
	let {
		children,
		modes,
		defaultMode = DEFAULT_MODE,
		currentMode = $bindable(),
		containerType = DEFAULT_CONTAINER_TYPE,
		outerClass,
		gridClass,
		innerClass,
	}: {
		/**
		 * Default to stacking grid; encapsulate with flex if you wish
		 */
		children: Snippet
		/**
		 * @example
		 * ```js
		 * {
		 * 		'orientation: landscape': {
		 * 			width: 8,
		 * 			height: 5,
		 * 			wider: true,
		 * 			padding: '4cqmin',
		 * 		},
		 * 		'orientation: portrait': {
		 * 			width: 5,
		 * 			height: 8,
		 * 			taller: true,
		 * 			padding: null,
		 * 		},
		 * }
		 * ```
		 */
		modes: Record<string, ForceRatioMode>
		defaultMode?: ForceRatioMode
		currentMode?: ForceRatioMode | undefined
		containerType?: CSS.Properties['containerType']
		outerClass?: ClassValue
		gridClass?: ClassValue
		innerClass?: ClassValue
	} = $props()

	let queries = $derived(
		Object.entries(modes).filter(([_, v]) => !!v).map(([query, mode]) => ({
			mode,
			reactive: new MediaQuery(query),
		})),
	)
	$effect(() => {
		currentMode = queries.find(({ reactive }) =>
			reactive.current === true
		)?.mode
			?? defaultMode
	})

	let { width, height } = $derived(currentMode ?? defaultMode)
	let { restrictWidth, restrictHeight } = $derived({
		restrictWidth: width < height,
		restrictHeight: height < width,
		...(currentMode ?? defaultMode),
	})
	let padding = $derived(
		currentMode ? (currentMode.padding ?? 0) : defaultMode.padding ?? 0,
	)
</script>

<div
	class={[
		'force-ratio-outer',
		outerClass,
	]}
	style:position='absolute'
	style:inset='0'
	style:z-index='-1'
	style:overflow='hidden'
	style:display='grid'
	style:place-items='center'
	style:container-type={containerType}
>
	<div
		class={[
			'force-ratio-grid',
			gridClass,
		]}
		style:display='grid'
		style:grid-template-areas="'. . .' '. a .' '. . .'"
		style:grid-template-rows={padding + ' 1fr ' + padding}
		style:grid-template-columns={padding + ' 1fr ' + padding}
		style:width={restrictWidth ? `min(100cqw,calc(${width}/${height}*100cqh))` : '100cqw'}
		style:height={restrictHeight ? `min(100cqh,calc(${height}/${width}*100cqw))` : '100cqh'}
	>
		<div
			class={[
				'force-ratio-inner',
				innerClass,
			]}
			style:grid-area='a'
			style:container-type={containerType}
		>
			{@render children()}
		</div>
	</div>
</div>
