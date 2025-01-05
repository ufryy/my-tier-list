import { nanoid } from 'nanoid';

import type { InsertType, UpdateSpec } from 'dexie';
import { defaultTierList } from './constants';
import type AppDB from './db';
import type { Item, Tier, TierList } from './types';

export const emptyItem: Item = Object.freeze({
	id: '',
	label: ''
});

export class TierListController {
	#db: AppDB;
	#id: number = -1;
	#staging: Item[] = $state([]);
	#tiers: Tier[] = $state([]);

	constructor(db: AppDB) {
		this.#db = db;
		this.#db.tierLists
			.limit(1)
			.first()
			.then((tierList) => {
				if (tierList) {
					console.debug('Loaded tier list from DB:', tierList);
					this.#id = tierList.id;
					this.#staging = tierList.staging;
					this.#tiers = tierList.tiers;
				} else {
					console.debug('No tier list found in DB, creating default one');
					this.#db.tierLists.add(defaultTierList).then((id) => {
						this.#id = id;
						this.#staging = defaultTierList.staging;
						this.#tiers = defaultTierList.tiers;
					});
				}
			});
	}

	#save(what: 'all' | 'staging' | 'tiers') {
		const changes: UpdateSpec<InsertType<TierList, 'id'>> = {};
		if (what === 'all' || what === 'staging') {
			changes.staging = $state.snapshot(this.#staging);
		}
		if (what === 'all' || what === 'tiers') {
			changes.tiers = $state.snapshot(this.#tiers);
		}

		console.debug('Saving tier list to DB:', this.#id, changes);
		this.#db.tierLists.update(this.#id, changes);
	}

	get staging() {
		return this.#staging;
	}

	get tiers() {
		return this.#tiers;
	}

	addEntry() {
		this.#tiers.push({
			id: nanoid(),
			label: 'New Tier',
			bgColor: 'bg-gray-700',
			textColor: '#ffffff',
			items: []
		});
		this.#save('tiers');
	}

	editEntry(index: number, entry: Partial<Omit<Tier, 'id' | 'items'>>) {
		// @ts-expect-error id and items are not allowed, this is enforced
		const { id: _, items: __, ..._entry } = entry;
		this.#tiers[index] = { ...this.#tiers[index], ..._entry };
		this.#save('tiers');
	}

	moveEntry(from: number, to: number) {
		if (
			from === to ||
			from < 0 ||
			to < 0 ||
			from >= this.#tiers.entries.length ||
			to >= this.#tiers.entries.length
		) {
			return;
		}

		const entry = this.#tiers[from];
		if (from < to) {
			this.#tiers = [
				...this.#tiers.slice(0, from),
				...this.#tiers.slice(from + 1, to + 1),
				entry,
				...this.#tiers.slice(to + 1)
			];
		} else {
			this.#tiers = [
				...this.#tiers.slice(0, to),
				entry,
				...this.#tiers.slice(to, from),
				...this.#tiers.slice(from + 1)
			];
		}

		this.#save('tiers');
	}

	deleteEntry(index: number) {
		this.#staging.push(...this.#tiers[index].items);
		this.#tiers.splice(index, 1);
		this.#save('all');
	}

	addStagingItem({ id = nanoid(), label = 'New item', image }: Partial<Item>) {
		this.#staging.push({ id, label, image });
	}

	addItem(tierId: string, { id = nanoid(), label = 'New item', image }: Partial<Item>) {
		const entryIndex = this.#tiers.findIndex((t) => t.id === tierId);
		if (entryIndex === -1) {
			return;
		}
		this.#tiers[entryIndex].items.push({ id, label, image });
		this.#save('tiers');
	}

	removeItem(entryIndex: number, itemIndex: number) {
		this.#tiers[entryIndex].items.splice(itemIndex, 1);
		this.#save('tiers');
	}

	moveItem(item: Item, fromTierId: string, toTierId: string) {
		const fromTier = this.#tiers.find((t) => t.id === fromTierId);
		const toTier = this.#tiers.find((t) => t.id === toTierId);

		if (!fromTier || !toTier) {
			return;
		}

		fromTier.items = fromTier.items.filter((i) => i.id !== item.id);
		toTier.items.push(item);
		this.#save('tiers');
	}

	moveFromStaging(item: Item, toTierId: string) {
		const toEntry = this.#tiers.find((t) => t.id === toTierId);

		if (!toEntry) {
			return;
		}

		this.#staging = this.#staging.filter((i) => i.id !== item.id);
		toEntry.items.push(item);
		this.#save('all');
	}

	moveToStaging(item: Item, fromTierId: string) {
		const fromEntry = this.#tiers.find((t) => t.id === fromTierId);

		if (!fromEntry) {
			return;
		}

		fromEntry.items = fromEntry.items.filter((i) => i.id !== item.id);
		this.#staging.push(item);
		this.#save('all');
	}
}
