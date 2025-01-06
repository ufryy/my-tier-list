export type Palette = [string, string][];

export type TierList = {
	id: number;
	staging: StagingTier;
	tiers: Tier[];
};

export type Tier = {
	id: string;
	label: string;
	bgColor: string;
	textColor: string;
	items: Item[];
};

export type StagingTier = Pick<Tier, "id" | "items">;

export type TierLike = Tier | StagingTier | undefined;

export type Item = {
	id: string;
	label: string;
	image?: string;
};

export type TierListEntryPosition = 'first' | 'middle' | 'last';
