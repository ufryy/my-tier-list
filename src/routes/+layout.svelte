<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';

	import Header from '$lib/components/layout/Header.svelte';
	import { Toaster } from '$lib/components/ui/sonner';

	import AppDB from '$lib/data/db';
	import { TierListController } from '$lib/data/tier-list.svelte';
	import { setCtxTierList } from '$lib/context';

	let { children } = $props();

	const db = new AppDB();
	const tierList = new TierListController(db);
	setCtxTierList(tierList);
</script>

<ModeWatcher />
<Toaster />
<main class="container pb-10">
	<Header {tierList} />
	{@render children()}
</main>
