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
	import type { Item, Tier } from '$lib/data/types';
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

					const startData = startTargets[0].data;
					const destData = destTargets[0].data;

					if (startData.staging) {
						const tier = destData.tier as Tier;
						tierList.moveFromStaging(source.data.item as Item, tier.id);
					} else if (destData.staging) {
						const tier = startData.tier as Tier;
						tierList.moveToStaging(source.data.item as Item, tier.id);
					} else {
						const startTier = startData.tier as Tier;
						const destTier = destData.tier as Tier;
						tierList.moveItem(source.data.item as Item, startTier.id, destTier.id);
					}
				}
			}),

			monitorForExternal({
				canMonitor: some(containsFiles, containsURLs),
				onDragStart: () => preventUnhandled.start(),
				onDrop: ({ source, location }) => {
					const files = getFiles({ source });
					const urls = getURLs({ source });

					if (!files.length && !urls.length) {
						return;
					}

					const destTargets = location.current.dropTargets;

					const tier = destTargets[0].data.tier as Tier | undefined;
					const addFileItem = tier
						? (file: File, image: string) => tierList.addItem(tier.id, { label: file.name, image })
						: (file: File, image: string) => tierList.addStagingItem({ label: file.name, image });

					for (const file of files) {
						getFileURL(file)
							.then((image) => addFileItem(file, image))
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

<div use:makeDragDropMonitor>
	{#each tierList.tiers as tier, index (tier.id)}
		<TierRow {tier} {index} />
	{/each}
</div>
