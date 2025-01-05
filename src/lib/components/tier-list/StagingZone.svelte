<script lang="ts">
	import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
	import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
	import { dropTargetForExternal } from '@atlaskit/pragmatic-drag-and-drop/external/adapter';
	import { toast } from 'svelte-sonner';
	import type { Action } from 'svelte/action';

	import type { TierListController } from '$lib/state/tier-list.svelte';
	import { isValidUrl, readFileAsDataURL } from '$lib/utils';
	import TierListItem from './TierListItem.svelte';

	type Props = {
		tierList: TierListController;
	};

	let { tierList }: Props = $props();

	function handlePaste(e: ClipboardEvent) {
		e.preventDefault();

		for (const clipboardItem of e.clipboardData?.files ?? []) {
			if (clipboardItem.type.startsWith('image/')) {
				readFileAsDataURL(clipboardItem)
					.then((dataUrl) => {
						tierList.addStagingItem({
							label: clipboardItem.name,
							image: dataUrl
						});
					})
					.catch(() => {
						toast.error('Failed to read file');
					});
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
		const cleanup = combine(
			dropTargetForElements({
				element,
				getData: () => ({ staging: true })
			}),
			dropTargetForExternal({
				element,
				getData: () => ({ staging: true })
			})
		);

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
		'flex min-h-60 w-full flex-wrap border-4 border-dashed',
		!tierList.staging.length && 'items-center justify-center'
	]}
	use:makeStagingDropZone
>
	{#each tierList.staging as item}
		<TierListItem {item} />
	{:else}
		<p class="text-center m-auto text-slate-600 text-lg">Paste or drop here an image or URL</p>
	{/each}
</section>
