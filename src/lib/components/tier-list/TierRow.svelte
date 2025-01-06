<script lang="ts">
	import { getCtxTierList } from '$lib/context';
	import type { TierListController } from '$lib/data/tier-list.svelte';
	import type { Tier, TierListEntryPosition } from '$lib/data/types';
	import TierRowItems from './TierRowItems.svelte';
	import TierRowLabelEditor from './TierRowLabelEditor.svelte';

	type Props = {
		tier: Tier;
		index: number;
	};

	let { tier, index }: Props = $props();

	const tierList: TierListController = getCtxTierList();
	const position: TierListEntryPosition = $derived(
		index === 0 ? 'first' : index === tierList.tiers.length - 1 ? 'last' : 'middle'
	);

	function onEditLabel(label: string) {
		tierList.editTier(index, { label });
	}

	function onEditBgColor(color: string) {
		tierList.editTier(index, { bgColor: color });
	}

	function onEditTextColor(color: string) {
		tierList.editTier(index, { textColor: color });
	}

	function onMoveUp() {
		tierList.moveTier(index, index - 1);
	}

	function onMoveDown() {
		tierList.moveTier(index, index + 1);
	}

	function onDelete() {
		tierList.deleteTier(index);
	}
</script>

<section class="flex flex-col border-4 border-t-0 first:border-t-4 xs:flex-row">
	<TierRowLabelEditor
		label={tier.label}
		bgColor={tier.bgColor}
		textColor={tier.textColor}
		{position}
		{onEditLabel}
		{onEditBgColor}
		{onEditTextColor}
		{onMoveDown}
		{onMoveUp}
		{onDelete}
	/>
	<div aria-hidden="true" class="border-2"></div>
	<TierRowItems {tier} {index} />
</section>
