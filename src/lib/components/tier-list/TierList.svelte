<script lang="ts">
	import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
	import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
	import { monitorForExternal } from '@atlaskit/pragmatic-drag-and-drop/external/adapter';
	import { containsFiles, getFiles } from '@atlaskit/pragmatic-drag-and-drop/external/file';
	import { some } from '@atlaskit/pragmatic-drag-and-drop/external/some';
	import { containsURLs, getURLs } from '@atlaskit/pragmatic-drag-and-drop/external/url';
	import { preventUnhandled } from '@atlaskit/pragmatic-drag-and-drop/prevent-unhandled';
	import { toast } from 'svelte-sonner';
	import type { Action } from 'svelte/action';

	import { setCtxTierList } from '$lib/context';
	import type { TierListController } from '$lib/data/tier-list.svelte';
	import type { Item, TierLike } from '$lib/data/types';
	import { compressImage, readFileAsDataURL } from '$lib/utils/files';
	import TierRow from './TierRow.svelte';

	type Props = {
		tierList: TierListController;
	};

	let { tierList }: Props = $props();

	setCtxTierList(tierList);

	const makeDragDropMonitor: Action = () => {
		const cleanup = combine(
			monitorForElements({
				onDrop: ({ source, location }) => {
					const startTargets = location.initial.dropTargets;
					const destTargets = location.current.dropTargets;

					if (
						!startTargets.length ||
						!destTargets.length ||
						startTargets[0].element === destTargets[0].element
					) {
						return;
					}

					const from = startTargets[0].data.tier as TierLike;
					const to = destTargets[0].data.tier as TierLike;
					if (!from || !to) {
						return;
					}
					tierList.moveItem(source.data.item as Item, from.id, to.id);
				}
			}),

			monitorForExternal({
				canMonitor: some(containsFiles, containsURLs),
				onDragStart: () => preventUnhandled.start(),
				onDrop: ({ source, location }) => {
					const destTargets = location.current.dropTargets;
					const tier = destTargets[0].data.tier as TierLike;
					if (!tier) {
						return;
					}

					const files = getFiles({ source });
					const urls = getURLs({ source });
					if (!files.length && !urls.length) {
						return;
					}

					for (const file of files) {
						getFileURL(file)
							.then((image) => tierList.createItem(tier.id, { label: file.name, image }))
							.catch(fileReadErrorHandler);
					}
				}
			})
		);

		return {
			destroy() {
				cleanup();
			}
		};
	};

	async function getFileURL(file: File): Promise<string> {
		const dataURL = await readFileAsDataURL(file);
		return compressImage(dataURL);
	}

	function fileReadErrorHandler() {
		toast.error('Failed to read file');
	}
</script>

<div id="tier-list" use:makeDragDropMonitor>
	{#each tierList.tiers as tier, index (tier.id)}
		<TierRow {tier} {index} />
	{/each}
</div>
