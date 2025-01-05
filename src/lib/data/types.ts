export type Palette = [string, string][];

export type TierList = {
	id: number;
	staging: Item[];
	tiers: Tier[];
};

export type Tier = {
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

export type TierListEntryPosition = 'first' | 'middle' | 'last';
