<script lang="ts">
	import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
	import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
	import { dropTargetForExternal } from '@atlaskit/pragmatic-drag-and-drop/external/adapter';
	import type { Action } from 'svelte/action';

	import { getCtxTierList } from '$lib/context';
	import type { Tier } from '$lib/data/types';
	import TierListItem from './TierListItem.svelte';

	type Props = {
		tier: Tier;
	};

	let { tier }: Props = $props();

	const tierList = getCtxTierList();

	let draggedOver = $state(false);

	const makeDropZone: Action = (element) => {
		const cleanup = combine(
			dropTargetForElements({
				element,
				getData: () => ({ tier: $state.snapshot(tier) }),
				onDragEnter: () => (draggedOver = true),
				onDragLeave: () => (draggedOver = false),
				onDrop: () => (draggedOver = false)
			}),
			dropTargetForExternal({
				element,
				getData: () => ({ tier: $state.snapshot(tier) }),
				onDragEnter: () => (draggedOver = true),
				onDragLeave: () => (draggedOver = false),
				onDrop: () => (draggedOver = false)
			})
		);

		return {
			destroy() {
				cleanup();
			}
		};
	};
</script>

<section
	class="flex h-full min-h-22 w-full flex-1 flex-wrap border border-transparent"
	style={draggedOver ? `border-color: ${tier.bgColor}` : ''}
	use:makeDropZone
>
	{#each tier.items as item}
		<TierListItem {item} onDelete={() => tierList.deleteItem(item.id)} />
	{/each}
</section>
