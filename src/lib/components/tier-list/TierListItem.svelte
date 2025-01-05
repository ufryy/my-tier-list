<script lang="ts">
	import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
	import type { Action } from 'svelte/action';

	import type { Item } from '$lib/data/types';

	type Props = {
		item: Item;
	};

	let { item }: Props = $props();

	let dragging = $state(false);

	const makeDraggable: Action = (element) => {
		const cleanup = draggable({
			element,
			getInitialData: () => ({ item: $state.snapshot(item) }),
			onDragStart: () => (dragging = true),
			onDrop: () => (dragging = false)
		});

		return {
			destroy() {
				cleanup();
			}
		};
	};
</script>

<div
	class={[
		'flex h-20 w-20 items-center justify-center overflow-hidden text-center',
		dragging && 'cursor-grab opacity-50 saturate-0'
	]}
	use:makeDraggable
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
