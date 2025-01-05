import Dexie, { type EntityTable, type Transaction } from 'dexie';

import { defaultTierList } from './constants';
import type { TierList } from './types';

export default class AppDB extends Dexie {
	tierLists!: EntityTable<TierList, 'id'>;

	constructor() {
		super('TierListsDB');

		this.version(1).stores({
			tierLists: '++id'
		});

		// Fires once at the beginning of the first time the database is opened
		this.on('populate', (tx: Transaction) => {
			tx.table('tierLists').add(defaultTierList);
		});
	}
}

export const db = new AppDB();
