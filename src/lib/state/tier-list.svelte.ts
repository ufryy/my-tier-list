export type TierList = {
	entries: TierListEntry[];
};

export type TierListEntry = {
	label: string;
	bgColor: string;
	textColor: string;
	items: Item[];
};

export type Item = {
	label: string;
	image?: string;
};

const initialTierList: TierList = {
	entries: [
		{
			label: 'S',
			bgColor: 'bg-red-700',
			textColor: 'text-white',
			items: [
				{
					label: 'Test'
				}
			]
		},
		{
			label: 'A',
			bgColor: 'bg-yellow-700',
			textColor: 'text-white',
			items: [
				{
					label: 'Test image',
					image: 'https://picsum.photos/200/300'
				}
			]
		},
		{
			label: 'B',
			bgColor: 'bg-green-700',
			textColor: 'text-white',
			items: []
		},
		{
			label: 'C',
			bgColor: 'bg-blue-700',
			textColor: 'text-white',
			items: []
		},
		{
			label: 'D',
			bgColor: 'bg-purple-700',
			textColor: 'text-white',
			items: []
		}
	]
};

export class TierListController {
	current: TierList = $state({ ...initialTierList });

	addEntry() {
		this.current.entries.push({
			label: 'New Tier',
			bgColor: 'bg-gray-700',
			textColor: 'text-white',
			items: []
		});
	}

	removeEntry(index: number) {
		this.current.entries.splice(index, 1);
	}

	addItem(entryIndex: number) {
		this.current.entries[entryIndex].items.push({
			label: 'New Item'
		});
	}

	removeItem(entryIndex: number, itemIndex: number) {
		this.current.entries[entryIndex].items.splice(itemIndex, 1);
	}
}
