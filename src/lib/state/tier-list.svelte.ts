import { nanoid } from 'nanoid';

export type TierList = {
	entries: TierListEntry[];
};

export type TierListEntry = {
	id: string;
	label: string;
	bgColor: string;
	textColor: string;
	items: Item[];
};

export type Item = {
	id: string;
	label: string;
	image?: string;
};

export const emptyItem: Item = Object.freeze({
	id: '',
	label: ''
});

const initialTierList: TierList = {
	entries: [
		{
			id: nanoid(),
			label: 'S',
			bgColor: '#B91C1C',
			textColor: '#ffffff',
			items: [
				{
					id: nanoid(),
					label: 'Test'
				}
			]
		},
		{
			id: nanoid(),
			label: 'A',
			bgColor: '#A16207',
			textColor: '#ffffff',
			items: [
				{
					id: nanoid(),
					label: 'Test image',
					image: 'https://picsum.photos/200/300'
				},
				{
					id: nanoid(),
					label: 'Test image 2',
					image: 'https://picsum.photos/500/400'
				}
			]
		},
		{
			id: nanoid(),
			label: 'B',
			bgColor: '#4d7c0f',
			textColor: '#ffffff',
			items: []
		},
		{
			id: nanoid(),
			label: 'C',
			bgColor: '#1d4ed8',
			textColor: '#ffffff',
			items: []
		},
		{
			id: nanoid(),
			label: 'D',
			bgColor: '#7e22ce',
			textColor: '#ffffff',
			items: []
		}
	]
};

export class TierListController {
	current: TierList = $state({ ...initialTierList });

	addEntry() {
		this.current.entries.push({
			id: nanoid(),
			label: 'New Tier',
			bgColor: 'bg-gray-700',
			textColor: '#ffffff',
			items: []
		});
	}

	removeEntry(index: number) {
		this.current.entries.splice(index, 1);
	}

	addItem(entryIndex: number) {
		this.current.entries[entryIndex].items.push({
			id: nanoid(),
			label: 'New Item'
		});
	}

	removeItem(entryIndex: number, itemIndex: number) {
		this.current.entries[entryIndex].items.splice(itemIndex, 1);
	}

	moveItem(item: Item, from: TierListEntry, to: TierListEntry) {
		const fromEntry = this.current.entries.find((e) => e.id === from.id);
		const toEntry = this.current.entries.find((e) => e.id === to.id);

		if (!fromEntry || !toEntry) {
			return;
		}

		fromEntry.items = from.items.filter((i) => i.id !== item.id);
		toEntry.items.push(item);
	}
}
