<script lang="ts">
	import { debounce } from 'es-toolkit';
	import { ChevronDown, ChevronUp, Trash2 } from 'lucide-svelte';
	import { MediaQuery } from 'svelte/reactivity';

	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import type { TierListEntryPosition } from '$lib/data/types';
	import ColorPicker from '../ui/ColorPicker.svelte';

	type Props = {
		label: string;
		bgColor: string;
		textColor: string;
		position: TierListEntryPosition;
		onEditLabel: (label: string) => void;
		onEditBgColor: (color: string) => void;
		onEditTextColor: (color: string) => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
		onDelete: () => void;
	};

	let {
		label,
		bgColor,
		textColor,
		position,
		onEditLabel,
		onEditBgColor,
		onEditTextColor,
		onMoveDown,
		onMoveUp,
		onDelete
	}: Props = $props();

	let newLabel = $state(label);
	let open = $state(false);

	const debouncedEditLabel = debounce(editLabel, 500);
	const desktop = new MediaQuery('(min-width: 768px)');

	function editLabel() {
		if (label !== newLabel) {
			onEditLabel(newLabel);
		}
	}
</script>

{#snippet editor()}
	<form
		class="mt-4 grid items-start gap-4"
		onsubmit={(e) => {
			e.preventDefault();
			open = false;
		}}
	>
		<div class="grid gap-2">
			<Label for="label">Label</Label>
			<Input type="text" id="label" bind:value={newLabel} onchange={debouncedEditLabel} />
		</div>
		<ColorPicker hex={bgColor} variant="outline" class="w-full" onColorChange={onEditBgColor}>
			Change background color
		</ColorPicker>
		<ColorPicker hex={textColor} variant="outline" class="w-full" onColorChange={onEditTextColor}>
			Change label color
		</ColorPicker>
		<div class="flex items-center gap-4">
			<Button
				type="button"
				disabled={position === 'first'}
				variant="outline"
				class="flex-1"
				onclick={onMoveUp}
			>
				<ChevronUp class="h-4 w-4" />
				Move up
			</Button>
			<Button
				type="button"
				disabled={position === 'last'}
				variant="outline"
				class="flex-1"
				onclick={onMoveDown}
			>
				<ChevronDown class="h-4 w-4" />
				Move down
			</Button>
		</div>
		<Button
			type="button"
			variant="destructive"
			class="w-full"
			onclick={() => {
				onDelete();
				open = false;
			}}
		>
			<Trash2 class="h-4 w-4" />
			Delete tier
		</Button>
	</form>
{/snippet}

{#if desktop.current}
	<Dialog.Root bind:open>
		<Dialog.Trigger
			class="flex min-h-20 w-full flex-none select-none items-center justify-center p-4 text-center xs:w-32"
			style="background-color: {bgColor}; color: {textColor}"
		>
			{newLabel}
		</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Customize entry</Dialog.Title>
			</Dialog.Header>

			{@render editor()}
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open>
		<Drawer.Trigger
			class="flex min-h-20 w-full flex-none select-none items-center justify-center p-4 text-center xs:w-32"
			style="background-color: {bgColor}; color: {textColor}"
		>
			{newLabel}
		</Drawer.Trigger>
		<Drawer.Content>
			<Drawer.Header class="text-left">
				<Drawer.Title>Customize entry</Drawer.Title>
			</Drawer.Header>

			<div class="p-4">
				{@render editor()}
			</div>

			<Drawer.Footer class="pt-2">
				<Drawer.Close class={buttonVariants({ variant: 'outline' })}>Close</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}
