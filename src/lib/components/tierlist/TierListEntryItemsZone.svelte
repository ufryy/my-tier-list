<script lang="ts">
	import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
	import type { Action } from 'svelte/action';

	import type { TierListEntry } from '$lib/state/tier-list.svelte';
	import TierListEntryItem from './TierListEntryItem.svelte';

	type Props = {
		entry: TierListEntry;
	};

	let { entry }: Props = $props();

	let draggedOver = $state(false);

	const makeDropZone: Action = (element) => {
		const cleanup = dropTargetForElements({
			element,
			getData: () => ({ entry: $state.snapshot(entry) }),
			onDragEnter: () => (draggedOver = true),
			onDragLeave: () => (draggedOver = false),
			onDrop: () => (draggedOver = false)
		});

		return {
			destroy() {
				cleanup();
			}
		};
	};
</script>

<section
	class="flex h-full w-full flex-wrap border border-transparent"
	style={draggedOver ? `border-color: ${entry.bgColor}` : ''}
	use:makeDropZone
>
	{#each entry.items as item}
		<TierListEntryItem {item} />
	{/each}
</section>
