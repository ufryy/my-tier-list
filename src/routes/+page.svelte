<script lang="ts">
	import StagingZone from '$lib/components/tier-list/StagingZone.svelte';
	import TierList from '$lib/components/tier-list/TierList.svelte';
	import AppDB from '$lib/data/db';
	import { TierListController } from '$lib/data/tier-list.svelte';

	const db = new AppDB();
	const tierList = new TierListController(db);
</script>

<div class="flex flex-col gap-10">
	<TierList {tierList} />
	<StagingZone {tierList} />
</div>
