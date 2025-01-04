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

export type TierListEntryPosition = 'first' | 'middle' | 'last';

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
			items: []
		},
		{
			id: nanoid(),
			label: 'A',
			bgColor: '#A16207',
			textColor: '#ffffff',
			items: []
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
	staging: Item[] = $state([]);

	addEntry() {
		this.current.entries.push({
			id: nanoid(),
			label: 'New Tier',
			bgColor: 'bg-gray-700',
			textColor: '#ffffff',
			items: []
		});
	}

	editEntry(index: number, entry: Partial<Omit<TierListEntry, 'id' | 'items'>>) {
		// @ts-expect-error id and items are not allowed, this is enforced
		const { id: _, items: __, ..._entry } = entry;
		this.current.entries[index] = { ...this.current.entries[index], ..._entry };
	}

	moveEntry(from: number, to: number) {
		if (
			from === to ||
			from < 0 ||
			to < 0 ||
			from >= this.current.entries.length ||
			to >= this.current.entries.length
		) {
			return;
		}

		const entry = this.current.entries[from];
		if (from < to) {
			this.current.entries = [
				...this.current.entries.slice(0, from),
				...this.current.entries.slice(from + 1, to + 1),
				entry,
				...this.current.entries.slice(to + 1)
			];
		} else {
			this.current.entries = [
				...this.current.entries.slice(0, to),
				entry,
				...this.current.entries.slice(to, from),
				...this.current.entries.slice(from + 1)
			];
		}
	}

	removeEntry(index: number) {
		this.current.entries.splice(index, 1);
	}

	addStagingItem({ id = nanoid(), label = 'New item', image }: Partial<Item>) {
		this.staging.push({ id, label, image });
	}

	addItem(entry: TierListEntry, { id = nanoid(), label = 'New item', image }: Partial<Item>) {
		const entryIndex = this.current.entries.findIndex((e) => e.id === entry.id);
		if (entryIndex === -1) {
			return;
		}
		this.current.entries[entryIndex].items.push({ id, label, image });
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

	moveFromStaging(item: Item, to: TierListEntry) {
		const toEntry = this.current.entries.find((e) => e.id === to.id);

		if (!toEntry) {
			return;
		}

		this.staging = this.staging.filter((i) => i.id !== item.id);
		toEntry.items.push(item);
	}

	moveToStaging(item: Item, from: TierListEntry) {
		const fromEntry = this.current.entries.find((e) => e.id === from.id);

		if (!fromEntry) {
			return;
		}

		fromEntry.items = fromEntry.items.filter((i) => i.id !== item.id);
		this.staging.push(item);
	}
}
