<script lang="ts">
	import { getCtxTierList } from '$lib/context';
	import type {
		TierListController,
		TierListEntry,
		TierListEntryPosition
	} from '$lib/state/tier-list.svelte';
	import TierListEntryItemsZone from './TierListEntryItemsZone.svelte';
	import TierListEntryLabel from './TierListEntryLabel.svelte';

	type Props = {
		entry: TierListEntry;
		index: number;
	};

	let { entry, index }: Props = $props();

	const tierList: TierListController = getCtxTierList();
	const position: TierListEntryPosition = $derived(
		index === 0 ? 'first' : index === tierList.current.entries.length - 1 ? 'last' : 'middle'
	);

	function onEditLabel(label: string) {
		tierList.editEntry(index, { label });
	}

	function onEditBgColor(color: string) {
		tierList.editEntry(index, { bgColor: color });
	}

	function onEditTextColor(color: string) {
		tierList.editEntry(index, { textColor: color });
	}

	function onMoveUp() {
		tierList.moveEntry(index, index - 1);
	}

	function onMoveDown() {
		tierList.moveEntry(index, index + 1);
	}
</script>

<section class="flex flex-col border-4 border-t-0 first:border-t-4 xs:flex-row">
	<TierListEntryLabel
		label={entry.label}
		bgColor={entry.bgColor}
		textColor={entry.textColor}
		{position}
		{onEditLabel}
		{onEditBgColor}
		{onEditTextColor}
		{onMoveDown}
		{onMoveUp}
	/>
	<div aria-hidden="true" class="border-2"></div>
	<TierListEntryItemsZone {entry} />
</section>
