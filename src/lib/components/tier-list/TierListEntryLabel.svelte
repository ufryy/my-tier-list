<script lang="ts">
	import * as Drawer from '../ui/drawer/index.js';

	type Props = {
		label: string;
		bgColor: string;
		textColor: string;
	};

	let { label, bgColor, textColor }: Props = $props();
</script>

<Drawer.Root>
	<Drawer.Trigger
		class="h-full min-h-20 w-full select-none border-x-2 p-4"
		style="background-color: {bgColor}; color: {textColor}"
	>
		{label}
	</Drawer.Trigger>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Are you sure absolutely sure?</Drawer.Title>
			<Drawer.Description>This action cannot be undone.</Drawer.Description>
		</Drawer.Header>
		<Drawer.Footer>
			<Drawer.Close>Cancel</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
