import { getContext, setContext } from 'svelte';

import { TierListController } from './state/tier-list.svelte';

const CTX_TIER_LIST = Symbol('CTX_TIER_LIST');

export function getCtxTierList(): TierListController {
	const tl = getContext(CTX_TIER_LIST);
	if (!(tl instanceof TierListController)) {
		console.error('CTX_TIER_LIST', tl);
		throw new Error('Instance of TierList not found in context');
	}
	return tl as TierListController;
}

export function setCtxTierList(tl: TierListController) {
	if (!(tl instanceof TierListController)) {
		console.error('CTX_TIER_LIST', tl);
		throw new Error('Trying to set invalid TierList instance');
	}
	setContext(CTX_TIER_LIST, tl);
}
