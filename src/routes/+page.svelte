<script lang="ts">
	import StagingZone from '$lib/components/tier-list/StagingZone.svelte';
	import TierList from '$lib/components/tier-list/TierList.svelte';
	import { TierListController } from '$lib/state/tier-list.svelte';

	const tierList = new TierListController();
</script>

<div class="flex flex-col gap-10">
	<TierList {tierList} />
	<StagingZone {tierList} />
</div>
