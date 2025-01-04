<script lang="ts">
	import type { TierListEntry } from '$lib/state/tier-list.svelte';
	import TierListEntryItemsZone from './TierListEntryItemsZone.svelte';
	import TierListEntryLabel from './TierListEntryLabel.svelte';

	type Props = {
		entry: TierListEntry;
	};

	let { entry }: Props = $props();
</script>

<section class="xs:flex-row flex flex-col border-4 border-t-0 first:border-t-4">
	<TierListEntryLabel label={entry.label} bgColor={entry.bgColor} textColor={entry.textColor} />
	<TierListEntryItemsZone {entry} />
</section>
