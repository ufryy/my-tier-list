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
	import type { Item, TierListController, TierListEntry } from '$lib/state/tier-list.svelte';
	import { readFileAsDataURL } from '$lib/utils';
	import TierListEntryBox from './TierListEntry.svelte';

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
						const entry = destData.entry as TierListEntry;
						tierList.moveFromStaging(source.data.item as Item, entry);
						return;
					} else if (destData.staging) {
						const entry = startData.entry as TierListEntry;
						tierList.moveToStaging(source.data.item as Item, entry);
						return;
					} else {
						const startEntry = startData.entry as TierListEntry;
						const destEntry = destData.entry as TierListEntry;
						tierList.moveItem(source.data.item as Item, startEntry, destEntry);
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

					if (!destTargets.length || destTargets[0].data.staging) {
						for (const file of files) {
							readFileAsDataURL(file)
								.then((image) => {
									tierList.addStagingItem({
										label: file.name,
										image
									});
								})
								.catch(fileReadErrorHandler);
						}
					} else if (destTargets[0].data.entry) {
						const entry = destTargets[0].data.entry as TierListEntry;
						for (const file of files) {
							readFileAsDataURL(file)
								.then((image) => {
									tierList.addItem(entry, {
										label: file.name,
										image
									});
								})
								.catch(fileReadErrorHandler);
						}
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

	function fileReadErrorHandler() {
		toast.error('Failed to read file');
	}
</script>

<div use:makeDragDropMonitor>
	{#each tierList.current.entries as entry, index}
		<TierListEntryBox {entry} {index} />
	{/each}
</div>
