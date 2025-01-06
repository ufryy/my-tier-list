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

	fromJSONString(json: string): boolean {
		try {
			const { staging, tiers } = JSON.parse(json);
			if (!this.isStagingValid(staging)) {
				console.error('Invalid staging tier:', staging);
				return false;
			}
			if (!this.areTiersValid(tiers)) {
				console.error('Invalid tiers:', tiers);
				return false;
			}

			this.#staging = staging;
			this.#tiers = tiers;
			this.#save('all');
			return true;
		} catch (err) {
			console.error('Error parsing JSON:', err);
			return false;
		}
	}

	toJSONString(): string {
		return JSON.stringify({
			staging: $state.snapshot(this.#staging),
			tiers: $state.snapshot(this.#tiers)
		});
	}

	isStagingValid(staging: unknown): boolean {
		return (
			typeof staging === 'object' &&
			staging != null &&
			'id' in staging &&
			typeof staging.id === 'string' &&
			staging.id.length > 0 &&
			'items' in staging &&
			Array.isArray(staging.items)
		);
	}

	areTiersValid(tiers: unknown): boolean {
		return (
			Array.isArray(tiers) &&
			tiers.every(
				(t: unknown) =>
					typeof t === 'object' &&
					t != null &&
					'id' in t &&
					typeof t.id === 'string' &&
					t.id.length > 0 &&
					'label' in t &&
					typeof t.label === 'string' &&
					t.label.length > 0 &&
					'bgColor' in t &&
					typeof t.bgColor === 'string' &&
					t.bgColor.length > 0 &&
					'textColor' in t &&
					typeof t.textColor === 'string' &&
					t.textColor.length > 0 &&
					'items' in t &&
					Array.isArray(t.items) &&
					t.items.every(
						(i: unknown) =>
							typeof i === 'object' &&
							i != null &&
							'id' in i &&
							typeof i.id === 'string' &&
							i.id.length > 0 &&
							'label' in i &&
							typeof i.label === 'string' &&
							i.label.length > 0
					)
			)
		);
	}
}
