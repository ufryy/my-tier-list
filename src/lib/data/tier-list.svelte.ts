import { nanoid } from 'nanoid';

import type { InsertType, UpdateSpec } from 'dexie';
import { defaultTierList, STAGING_TIER_ID, stagingTier } from './constants';
import type AppDB from './db';
import type { Item, StagingTier, Tier, TierList } from './types';

export class TierListController {
	#db: AppDB;
	#id: number = -1;
	#staging: StagingTier = $state({ ...stagingTier });
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

	createTier() {
		this.#tiers.push({
			id: nanoid(),
			label: 'New Tier',
			bgColor: 'bg-gray-700',
			textColor: '#ffffff',
			items: []
		});
		this.#save('tiers');
	}

	editTier(index: number, entry: Partial<Omit<Tier, 'id' | 'items'>>) {
		// @ts-expect-error id and items are not allowed, this is enforced
		const { id: _, items: __, ..._entry } = entry;
		this.#tiers[index] = { ...this.#tiers[index], ..._entry };
		this.#save('tiers');
	}

	moveTier(from: number, to: number) {
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

	deleteTier(index: number) {
		this.#staging.items.push(...this.#tiers[index].items);
		this.#tiers.splice(index, 1);
		this.#save('all');
	}

	createItem(tierId: string, { label = 'New item', image }: Partial<Omit<Item, 'id'>>) {
		if (tierId === this.#staging.id) {
			this.#staging.items.push({ id: nanoid(), label, image });
			this.#save('staging');
		} else {
			const tierIndex = this.#tiers.findIndex((t) => t.id === tierId);
			if (tierIndex === -1) {
				console.warn('Tier not found:', tierId);
				return;
			}
			this.#tiers[tierIndex].items.push({ id: nanoid(), label, image });
			this.#save('tiers');
		}
	}

	/**
	 * Deletes a tier list item from the staging area or a specific tier, if provided
	 * @param itemId Id of the item to be deleted
	 * @param entryIndex Optional index of the tier where the item is located, if not provided the item is searched in the staging area
	 * @returns
	 */
	deleteItem(itemId: string, entryIndex?: number) {
		if (entryIndex != null) {
			const itemIndex = this.#tiers[entryIndex].items.findIndex((i) => i.id === itemId);
			if (itemIndex === -1) {
				return;
			}
			this.#tiers[entryIndex].items.splice(itemIndex, 1);
			this.#save('tiers');
		} else {
			const itemIndex = this.staging.items.findIndex((i) => i.id === itemId);
			if (itemIndex === -1) {
				return;
			}
			this.#staging.items.splice(itemIndex, 1);
			this.#save('staging');
		}
	}

	moveItem(item: Item, fromTierId: string, toTierId: string) {
		const from =
			fromTierId === STAGING_TIER_ID ? this.#staging : this.#tiers.find((t) => t.id === fromTierId);
		const to =
			toTierId === STAGING_TIER_ID ? this.#staging : this.#tiers.find((t) => t.id === toTierId);

		if (!from || !to) {
			return;
		}

		console.debug({ from, to });

		from.items = from.items.filter((i) => i.id !== item.id);
		to.items.push(item);
		this.#save('all');
	}

	// moveItemFromStaging(item: Item, toTierId: string) {
	// 	const toEntry = this.#tiers.find((t) => t.id === toTierId);

	// 	if (!toEntry) {
	// 		return;
	// 	}

	// 	this.#staging = this.#staging.filter((i) => i.id !== item.id);
	// 	toEntry.items.push(item);
	// 	this.#save('all');
	// }

	// moveItemToStaging(item: Item, fromTierId: string) {
	// 	const fromEntry = this.#tiers.find((t) => t.id === fromTierId);

	// 	if (!fromEntry) {
	// 		return;
	// 	}

	// 	fromEntry.items = fromEntry.items.filter((i) => i.id !== item.id);
	// 	this.#staging.push(item);
	// 	this.#save('all');
	// }
}
