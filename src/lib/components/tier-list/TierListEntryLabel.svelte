<script lang="ts">
	import { debounce } from 'es-toolkit';

	type Props = {
		label: string;
		bgColor: string;
		textColor: string;
		onEditLabel: (label: string) => void;
	};

	let { label, bgColor, textColor, onEditLabel }: Props = $props();

	let newLabel = $state(label);

	const debouncedEditLabel = debounce(editLabel, 500);

	function editLabel() {
		if (label !== newLabel) {
			onEditLabel(newLabel);
		}
	}
</script>

<div
	class="flex min-h-20 w-full flex-none select-none items-center justify-center p-4 text-center xs:w-32"
	style="background-color: {bgColor}; color: {textColor}"
	contenteditable="true"
	oninput={debouncedEditLabel}
	bind:innerText={newLabel}
>
	{label}
</div>

<style>
	div {
		overflow-wrap: break-word;
		white-space: normal;
		word-break: break-word;
	}
</style>
