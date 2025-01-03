<script lang="ts">
	import { draggable, type DragEventData } from '@neodrag/svelte';

	import type { Item } from '$lib/state/tier-list.svelte';

	type Props = {
		item: Item;
	};

	let { item }: Props = $props();

	function onDragging(e: CustomEvent<DragEventData>) {
		console.debug('dragging', e.detail);
	}

	function onDragEnd(e: CustomEvent<DragEventData>) {
		e.detail.rootNode.style.removeProperty('translate');
	}
</script>

<div
	class="flex h-20 w-20 items-center justify-center overflow-hidden text-center"
	use:draggable={{ bounds: document.body, ignoreMultitouch: true }}
	on:neodrag={onDragging}
	on:neodrag:end={onDragEnd}
>
	{#if item.image}
		<img
			src={item.image}
			alt={item.label}
			crossorigin="anonymous"
			draggable="false"
			class="h-full w-full select-none object-cover"
		/>
	{:else}
		{item.label}
	{/if}
</div>

<style>
	:global(.neodrag-dragging) {
		position: absolute;
		z-index: 1000;
	}
</style>
