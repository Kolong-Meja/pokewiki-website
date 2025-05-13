export type BerryResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Berry[];
};

export type Berry = {
  name: string;
  url: string;
  detail: BerryDetail | null;
};

export type BerryDetail = {
  id: number;
  name: string;
  growth_time: number;
  max_harvest: number;
  natural_gift_power: number;
  size: number;
  smoothness: number;
  soil_dryness: number;
  firmness: BerryFirmness;
  item: BerryItem;
  natural_gift_type: BerryNaturalGiftType;
  flavors: BerryFlavors[];
};

type BerryFirmness = {
  name: string;
  url: string;
};

type BerryFlavors = {
  flavor: BerryFlavor;
  potency: number;
};

type BerryFlavor = {
  name: string;
  url: string;
};

type BerryItem = {
  name: string;
  url: string;
  detail: BerryItemDetail | null;
};

export type BerryItemDetail = {
  id: number;
  name: string;
  cost: number;
  game_indices: BerryItemGameIndices[];
  sprites: BerryItemSprites;
  effect_entries: BerryItemEffectEntries[];
};

type BerryItemSprites = {
  default: string;
};

type BerryItemGameIndices = {
  game_index: number;
  generation: BerryItemGeneration;
};

type BerryItemGeneration = {
  name: string;
  url: string;
};

type BerryItemEffectEntries = {
  effect: string;
  short_effect: string;
};

type BerryNaturalGiftType = {
  name: string;
  url: string;
};
