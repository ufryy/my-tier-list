<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';

	import Header from '$lib/components/layout/Header.svelte';
	import { Toaster } from '$lib/components/ui/sonner';

	let { children } = $props();
</script>

<ModeWatcher />
<Toaster />
<main class="container pb-10">
	<Header />
	{@render children()}
</main>
