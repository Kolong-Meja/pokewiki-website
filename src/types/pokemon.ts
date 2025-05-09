export type PokemonResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
};

export type Pokemon = {
  name: string;
  url: string;
  detail: PokemonDetail | null;
};

type PokemonDetail = {
  id: number;
  stats: PokemonStats[];
  types: PokemonTypes[];
  species: PokemonSpecies;
  sprites: PokemonSprites;
};

type PokemonStats = {
  base_stat: number;
  stat: PokemonDetailStats;
};

type PokemonDetailStats = {
  name: string;
  url: string;
};

export type PokemonTypes = {
  type: PokemonType;
};

type PokemonType = {
  name: string;
  url: string;
};

type PokemonSpecies = {
  name: string;
  url: string;
  detail: PokemonSpeciesDetail | null;
};

type PokemonSpeciesDetail = {
  color: PokemonColor;
  generation: PokemonGeneration;
};

type PokemonColor = {
  name: string;
  url: string;
};

type PokemonGeneration = {
  name: string;
  url: string;
  detail: PokemonGenerationDetail | null;
};

type PokemonGenerationDetail = {
  id: number;
  main_region: PokemonMainRegion;
};

type PokemonMainRegion = {
  name: string;
  url: string;
};

type PokemonSprites = {
  back_default: string | null;
  back_female: string | null;
  front_default: string | null;
  front_female: string | null;
};
