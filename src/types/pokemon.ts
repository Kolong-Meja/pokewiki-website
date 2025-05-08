export type PokemonTypes = {
  type: PokemonType;
};

type PokemonType = {
  name: string;
  url: string;
};

type PokemonStats = {
  base_stat: number;
  stat: PokemonDetailStats;
};

type PokemonDetailStats = {
  name: string;
  url: string;
};

type PokemonPastAbilities = {
  abilities: PokemonAbilities[];
  generation: PokemonGeneration;
};

type PokemonAbilities = {
  ability: string | null;
  is_hidden: boolean;
  slot: number;
};

type PokemonSpecies = {
  name: string;
  url: string;
  detail: PokemonSpeciesDetail | null;
};

type PokemonSpeciesDetail = {
  base_happiness: number;
  capture_rate: number;
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
  back_shiny: string | null;
  back_shiny_female: string | null;
  front_default: string | null;
  front_female: string | null;
  front_shiny: string | null;
  front_shiny_female: string | null;
};

type PokemonDetail = {
  id: number;
  base_exp: number;
  stats: PokemonStats[];
  types: PokemonTypes[];
  past_abilities: PokemonPastAbilities[];
  species: PokemonSpecies;
  sprites: PokemonSprites;
  height: number;
  weight: number;
};

export type Pokemon = {
  name: string;
  url: string;
  detail: PokemonDetail | null;
};

// FETCH ALL POKEMONS RESPONSE.
export type PokemonResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
};
