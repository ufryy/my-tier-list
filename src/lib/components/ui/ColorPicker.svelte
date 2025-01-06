<script lang="ts">
	import type { Snippet } from 'svelte';
	import ColorPicker from 'svelte-awesome-color-picker';

	import { noop } from 'es-toolkit';
	import { mode } from 'mode-watcher';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Button, type ButtonSize, type ButtonVariant } from './button';

	type Props = {
		hex: string;
		children?: Snippet;
		class?: HTMLButtonAttributes['class'];
		colorPickerSize?: string;
		variant?: ButtonVariant;
		size?: ButtonSize;
		onColorChange?: (hex: string) => void;
	};

	let {
		hex = $bindable(),
		children,
		colorPickerSize = '1.25rem',
		onColorChange = noop,
		...buttonProps
	}: Props = $props();

	let button: HTMLButtonElement | null = $state(null);
	let isOpen = $state(false);

	function toggle(e: Event) {
		const [target] = e.composedPath();
		if (target === button) {
			isOpen = !isOpen;
		}
	}
</script>

<Button {...buttonProps} onclick={toggle} bind:ref={button}>
	<div class={[$mode === 'dark' && 'dark']} style="--input-size: {colorPickerSize}">
		<ColorPicker
			bind:hex
			{isOpen}
			label=""
			position="responsive"
			isAlpha={false}
			isTextInput={false}
			on:input={(e) => e.detail.hex && onColorChange(e.detail.hex) && e.stopPropagation()}
		/>
	</div>
	{@render children?.()}
</Button>

<style>
	.dark {
		--cp-bg-color: #333;
		--cp-border-color: white;
		--cp-text-color: white;
		--cp-input-color: #555;
		--cp-button-hover-color: #777;
	}
</style>
