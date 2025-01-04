<script lang="ts">
	import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
	import type { Action } from 'svelte/action';

	import type { TierListController } from '$lib/state/tier-list.svelte';
	import { isValidUrl } from '$lib/utils';
	import TierListItem from './TierListItem.svelte';

	type Props = {
		tierList: TierListController;
	};

	let { tierList }: Props = $props();

	function handlePaste(e: ClipboardEvent) {
		e.preventDefault();

		for (const clipboardItem of e.clipboardData?.files ?? []) {
			if (clipboardItem.type.startsWith('image/')) {
				const reader = new FileReader();
				reader.addEventListener(
					'load',
					() => {
						tierList.addStagingItem({
							label: clipboardItem.name,
							image: reader.result as string
						});
					},
					false
				);
				reader.readAsDataURL(clipboardItem);
			}
		}

		const url = e.clipboardData?.getData('text/plain');
		if (url && isValidUrl(url)) {
			tierList.addStagingItem({
				label: '',
				image: url
			});
		}
	}

	const makeStagingDropZone: Action = (element) => {
		const cleanup = dropTargetForElements({
			element,
			getData: () => ({ staging: true })
		});

		return {
			destroy() {
				cleanup();
			}
		};
	};
</script>

<svelte:window onpaste={handlePaste} />

<section
	class={[
		'flex min-h-40 w-full flex-wrap border-4 border-dashed',
		!tierList.staging.length && 'items-center justify-center'
	]}
	use:makeStagingDropZone
>
	{#each tierList.staging as item}
		<TierListItem {item} />
	{:else}
		<p class="text-center m-auto text-slate-600 text-lg">Paste or drop an image or URL</p>
	{/each}
</section>
