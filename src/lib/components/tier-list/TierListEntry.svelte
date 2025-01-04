<script lang="ts">
	import { getCtxTierList } from '$lib/context';
	import type { TierListController, TierListEntry } from '$lib/state/tier-list.svelte';
	import TierListEntryItemsZone from './TierListEntryItemsZone.svelte';
	import TierListEntryLabel from './TierListEntryLabel.svelte';

	type Props = {
		entry: TierListEntry;
		index: number;
	};

	let { entry, index }: Props = $props();

	const tierList: TierListController = getCtxTierList();

	function onEditLabel(label: string) {
		tierList.editEntry(index, { label });
	}
</script>

<section class="flex flex-col border-4 border-t-0 first:border-t-4 xs:flex-row">
	<TierListEntryLabel
		label={entry.label}
		bgColor={entry.bgColor}
		textColor={entry.textColor}
		{onEditLabel}
	/>
	<div aria-hidden="true" class="border-2"></div>
	<TierListEntryItemsZone {entry} />
</section>
