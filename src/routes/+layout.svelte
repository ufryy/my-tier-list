<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';

	import Header from '$lib/components/layout/Header.svelte';

	let { children } = $props();
</script>

<ModeWatcher />
<main class="container">
	<Header />
	{@render children()}
</main>
