<script lang="ts">
	import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
	import type { Action } from 'svelte/action';

	import type { Item, TierListController, TierListEntry } from '$lib/state/tier-list.svelte';
	import TierListEntryBox from './TierListEntry.svelte';

	type Props = {
		tierList: TierListController;
	};

	let { tierList }: Props = $props();

	const makeDragDropMonitor: Action = () => {
		const cleanup = monitorForElements({
			onDrop: ({ source, location }) => {
				const startTargets = location.initial.dropTargets;
				const destTargets = location.current.dropTargets;

				if (
					!startTargets.length ||
					!destTargets.length ||
					startTargets[0].element === destTargets[0].element
				) {
					return;
				}

				console.debug({ source, location });
				const startEntry = startTargets[0].data.entry as TierListEntry;
				const destEntry = destTargets[0].data.entry as TierListEntry;
				tierList.moveItem(source.data.item as Item, startEntry, destEntry);
			}
		});

		return {
			destroy() {
				cleanup();
			}
		};
	};
</script>

<div class="border-y-2" use:makeDragDropMonitor>
	{#each tierList.current.entries as entry}
		<TierListEntryBox {entry} />
	{/each}
</div>
