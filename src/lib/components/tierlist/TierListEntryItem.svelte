<script lang="ts">
	import type { Item } from '$lib/state/tier-list.svelte';

	type Props = {
		item: Item;
	};

	let { item }: Props = $props();
</script>

<div class="flex h-20 w-20 items-center justify-center text-center">
	{#if item.image}
		<img src={item.image} alt={item.label} crossorigin="anonymous" class="object-cover" />
	{:else}
		{item.label}
	{/if}
</div>
