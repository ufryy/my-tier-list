<script lang="ts">
	import TierList from '$lib/components/tierlist/TierList.svelte';
	import { TierListController } from '$lib/state/tier-list.svelte';

	const tierList = new TierListController();
</script>

<TierList {tierList} />
