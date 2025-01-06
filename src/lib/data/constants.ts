import { nanoid } from 'nanoid';

import type { Item, Palette, StagingTier, TierList } from './types';

export const basicPalette1: Palette = [
	['#F24722', '#FFFFFF'],
	['#FEA629', '#000000'],
	['#FFCD2A', '#000000'],
	['#13AE5C', '#FFFFFF'],
	['#0B99FF', '#FFFFFF'],
	['#9847FF', '#FFFFFF'],
	['#FB47FF', '#FFFFFF']
];

export const basicPalette2: Palette = [
	['#FF7F7F', '#000000'],
	['#FFBF7F', '#000000'],
	['#FFDF80', '#000000'],
	['#FFFF7F', '#000000'],
	['#BFFF7F', '#000000'],
	['#7FFF7F', '#000000'],
	['#7FD6FF', '#000000']
];

export const emptyItem: Item = Object.freeze({
	id: '',
	label: ''
});

export const STAGING_TIER_ID = 'staging';

export const stagingTier: StagingTier = Object.freeze({
	id: STAGING_TIER_ID,
	items: []
});

export const defaultTierList: Omit<TierList, 'id'> = {
	staging: stagingTier,
	tiers: basicPalette2.map(([bgColor, textColor], index) => ({
		id: nanoid(),
		label: index === 0 ? 'S' : String.fromCharCode(65 + index - 1),
		bgColor,
		textColor,
		items: []
	}))
};
