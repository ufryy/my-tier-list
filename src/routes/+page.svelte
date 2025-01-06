<script lang="ts">
	import StagingZone from '$lib/components/tier-list/StagingZone.svelte';
	import TierList from '$lib/components/tier-list/TierList.svelte';
	import { getCtxTierList } from '$lib/context';

	const tierList = getCtxTierList();
</script>

<div class="flex flex-col gap-20">
	<TierList {tierList} />
	<StagingZone {tierList} />
</div>
