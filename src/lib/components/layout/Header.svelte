<script lang="ts">
	import { toPng } from 'html-to-image';
	import { Camera, Download, Import, Moon, Sun } from 'lucide-svelte';
	import { toggleMode } from 'mode-watcher';

	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import type { TierListController } from '$lib/data/tier-list.svelte';
	import { saveImageFile, saveJSONFile } from '$lib/utils/files';
	import { toast } from 'svelte-sonner';
	import type { ChangeEventHandler } from 'svelte/elements';

	type Props = {
		tierList?: TierListController;
	};

	let { tierList }: Props = $props();

	let inputRef: HTMLInputElement | undefined = $state();

	const importTierList: ChangeEventHandler<HTMLInputElement> = (e) => {
		if (!tierList) {
			toast.error('Application error');
			return;
		}

		const { files } = e.currentTarget;
		if (files && files.length) {
			const file = files[0];
			const reader = new FileReader();
			reader.onload = () => {
				const data = reader.result as string;
				const ok = tierList.fromJSONString(data);
				if (ok) {
					toast.success('Tier list imported');
				} else {
					toast.error('Error importing tier list');
				}
				inputRef!.value = '';
			};
			reader.onerror = () => {
				toast.error('Error reading file');
				inputRef!.value = '';
			};
			reader.readAsText(file);
		}
	};

	function exportTierList() {
		if (tierList) {
			saveJSONFile(tierList.toJSONString(), 'my-tier-list.json');
		}
	}

	function exportTierListAsImage() {
		const tierListNode = document.getElementById('tier-list');
		if (tierListNode) {
			toPng(tierListNode)
				.then((dataUrl) => {
					saveImageFile(dataUrl, 'my-tier-list.png');
				})
				.catch((err) => {
					console.error(err);
					toast.error('Error taking a photo of the tier list');
				});
		} else {
			console.error('Tier list node not found');
			toast.error('Error taking a photo of the tier list');
		}
	}
</script>

<nav class="header sticky top-0 flex flex-wrap items-center justify-between gap-4 pb-8 pt-4">
	<a href="/" class="inline-flex min-h-10 items-center text-lg font-extrabold">MyTierList</a>

	<div class="flex flex-wrap gap-2">
		{#if tierList}
			<Button variant="outline" onclick={exportTierListAsImage}>
				<Camera class="btn-header" />
				Take a photo
			</Button>

			<Button variant="outline" onclick={exportTierList}>
				<Download class="btn-header" />
				Export
			</Button>

			<label class="{buttonVariants({ variant: 'outline', size: 'default' })} cursor-pointer">
				<Import class="btn-header" />
				Import
				<input
					type="file"
					accept="application/json"
					class="sr-only"
					onchange={importTierList}
					bind:this={inputRef}
				/>
			</label>
		{/if}

		<Button onclick={toggleMode} variant="outline" size="icon">
			<Sun class="btn-header rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<Moon
				class="btn-header absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	</div>
</nav>
