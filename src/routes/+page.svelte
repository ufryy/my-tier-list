<script lang="ts">
	import StagingZone from '$lib/components/tier-list/StagingZone.svelte';
	import TierList from '$lib/components/tier-list/TierList.svelte';
	import { Button } from '$lib/components/ui/button';
	import { getCtxTierList } from '$lib/context';
	import { Plus } from 'lucide-svelte';

	const tierList = getCtxTierList();
</script>

<div class="flex flex-col gap-20">
	<div>
		<TierList {tierList} />
		<Button variant="ghost" class="mt-2" size="sm" onclick={() => tierList.createTier()}>
			<Plus />
			Add tier
		</Button>
	</div>
	<StagingZone {tierList} />
</div>
