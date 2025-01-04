<script lang="ts">
	import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
	import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
	import { dropTargetForExternal } from '@atlaskit/pragmatic-drag-and-drop/external/adapter';
	import type { Action } from 'svelte/action';

	import type { TierListEntry } from '$lib/state/tier-list.svelte';
	import TierListItem from './TierListItem.svelte';

	type Props = {
		entry: TierListEntry;
	};

	let { entry }: Props = $props();

	let draggedOver = $state(false);

	const makeDropZone: Action = (element) => {
		const cleanup = combine(
			dropTargetForElements({
				element,
				getData: () => ({ entry: $state.snapshot(entry) }),
				onDragEnter: () => (draggedOver = true),
				onDragLeave: () => (draggedOver = false),
				onDrop: () => (draggedOver = false)
			}),
			dropTargetForExternal({
				element,
				getData: () => ({ entry: $state.snapshot(entry) }),
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
	class="min-h-22 flex h-full w-full flex-wrap border border-transparent"
	style={draggedOver ? `border-color: ${entry.bgColor}` : ''}
	use:makeDropZone
>
	{#each entry.items as item}
		<TierListItem {item} />
	{/each}
</section>
