<script lang="ts">
	import type { TierListController } from '$lib/state/tier-list.svelte';
	import TierListEntry from './TierListEntry.svelte';

	type Props = {
		tierList: TierListController;
	};

	let { tierList }: Props = $props();
</script>

{#each tierList.current.entries as entry}
	<TierListEntry {entry} />
{/each}
