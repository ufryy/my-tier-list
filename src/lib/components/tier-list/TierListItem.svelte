<script lang="ts">
	import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
	import { Trash2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import type { Action } from 'svelte/action';

	import * as ContextMenu from '$lib/components/ui/context-menu/index.js';
	import type { Item } from '$lib/data/types';

	type Props = {
		item: Item;
		onDelete: (item: Item) => void;
	};

	let { item, onDelete }: Props = $props();

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

	function onImageError() {
		toast.error('Failed to load image');
		onDelete(item);
	}
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger>
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
					onerror={onImageError}
				/>
			{:else}
				{item.label}
			{/if}
		</div>
	</ContextMenu.Trigger>
	<ContextMenu.Content>
		<ContextMenu.Item
			class="flex gap-2 text-red-700 hover:cursor-pointer hover:bg-red-700 hover:text-white dark:text-red-400"
			onclick={() => onDelete(item)}
		>
			<Trash2 class="h-4 w-4" />
			Delete item
		</ContextMenu.Item>
	</ContextMenu.Content>
</ContextMenu.Root>

<style>
	:global(.neodrag-dragging) {
		position: absolute;
		z-index: 1000;
	}
</style>
