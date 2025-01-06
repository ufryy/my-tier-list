<script lang="ts">
	import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
	import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
	import { dropTargetForExternal } from '@atlaskit/pragmatic-drag-and-drop/external/adapter';
	import { toast } from 'svelte-sonner';
	import type { Action } from 'svelte/action';

	import type { TierListController } from '$lib/data/tier-list.svelte';
	import { compressImage, readFileAsDataURL, testImageURL } from '$lib/utils/files';
	import { isValidUrl } from '$lib/utils/strings';
	import TierListItem from './TierListItem.svelte';

	type Props = {
		tierList: TierListController;
	};

	let { tierList }: Props = $props();

	async function handlePaste(e: ClipboardEvent) {
		e.preventDefault();

		for (const clipboardItem of e.clipboardData?.files ?? []) {
			if (clipboardItem.type.startsWith('image/')) {
				try {
					const dataURL = await readFileAsDataURL(clipboardItem);
					const compressedDataURL = await compressImage(dataURL);
					tierList.addStagingItem({
						label: clipboardItem.name,
						image: compressedDataURL
					});
				} catch (e) {
					toast.error('Failed to read file');
				}
			}
		}

		const url = e.clipboardData?.getData('text/plain');
		if (url && isValidUrl(url)) {
			testImageURL(url).then((ok) => {
				if (ok) {
					tierList.addStagingItem({
						label: '',
						image: url
					});
				} else {
					toast.error('Invalid image URL');
				}
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
		'relative mb-10 flex min-h-60 w-full flex-wrap border-4 border-dashed',
		!tierList.staging.length && 'items-center justify-center'
	]}
	use:makeStagingDropZone
>
	{#each tierList.staging as item}
		<TierListItem {item} onDelete={() => tierList.deleteItem(item.id)} />
	{:else}
		<p class="text-center m-auto text-slate-600 text-lg">Paste or drop here an image or URL</p>
	{/each}

	{#if !!tierList.staging.length}
		<p
			class="absolute bottom-full left-1/2 m-auto -translate-x-1/2 -translate-y-2 text-center text-slate-600"
		>
			Paste or drop here an image or URL
		</p>
	{/if}
</section>
