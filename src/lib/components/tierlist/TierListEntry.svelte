<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import type { TierListEntry } from '$lib/state/tier-list.svelte';
	import ResizableHandle from '../ui/resizable/resizable-handle.svelte';
	import TierListEntryItem from './TierListEntryItem.svelte';
	import TierListEntryItemsZone from './TierListEntryItemsZone.svelte';
	import TierListEntryLabel from './TierListEntryLabel.svelte';

	type Props = {
		entry: TierListEntry;
	};

	let { entry }: Props = $props();
</script>

<Resizable.PaneGroup direction="horizontal" class="border-2">
	<Resizable.Pane defaultSize={10} maxSize={20} minSize={10}>
		<TierListEntryLabel label={entry.label} bgColor={entry.bgColor} textColor={entry.textColor} />
	</Resizable.Pane>
	<ResizableHandle />
	<Resizable.Pane class="border-r-2">
		<TierListEntryItemsZone {entry} />
	</Resizable.Pane>
</Resizable.PaneGroup>
