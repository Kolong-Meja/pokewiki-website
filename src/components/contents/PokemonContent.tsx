"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  Pokemon,
  PokemonDetail,
  PokemonResponse,
  PokemonStats,
  PokemonWithTotalStats,
  PokemonGenerationInfo,
} from "@/types/pokemon";
import { SortOption } from "@/types/sort";
import {
  extractIdFromUrl,
  fetchInBatches,
  getCached,
  setCached,
} from "@/utils/sort";
import SearchBar from "../SearchBar";
import PokemonTable from "../tables/PokemonTable";
import SortButton from "../buttons/SortButton";
import SimplePagination from "../SimplePagination";
import CategoryButton from "../buttons/CategoryButton";

const POKEMON_SORT_OPTIONS: SortOption[] = [
  { value: "default", label: "Sort by Default" },
  { value: "asc", label: "[ A-Z ] Sort by Name" },
  { value: "desc", label: "[ Z-A ] Sort by Name" },
  { value: "id-asc", label: "[ Low-High ] Sort by Pokédex No." },
  { value: "id-desc", label: "[ High-Low ] Sort by Pokédex No." },
  { value: "power-desc", label: "[ Strongest ] Sort by Total Stats" },
  { value: "power-asc", label: "[ Weakest ] Sort by Total Stats" },
  { value: "generation-asc", label: "[ Oldest-Newest ] Sort by Generation" },
  { value: "generation-desc", label: "[ Newest-Oldest ] Sort by Generation" },
];

async function getPokemons(): Promise<PokemonResponse> {
  let pokemons;
  const cachedPokemons = localStorage.getItem("pokemons");

  if (!cachedPokemons) {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=1302",
    );
    if (!response.ok) throw new Error("Failed to fetch pokemons.");

    pokemons = await response.json();
    localStorage.setItem("pokemons", JSON.stringify(pokemons));
  } else {
    pokemons = JSON.parse(cachedPokemons);
  }

  return pokemons;
}

async function getAllPokemons(
  offset: number,
  limit: number,
): Promise<PokemonResponse> {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`,
  );
  if (!response.ok) throw new Error("Failed to fetch pokemons.");
  const data = await response.json();

  return data;
}

async function getPokemonStatsMap(): Promise<Record<string, number>> {
  const cacheKey = "pokemon-stats-map";
  const cached = getCached<Record<string, number>>(cacheKey);
  if (cached) return cached;

  const pokemons = await getPokemons();
  const entries = await fetchInBatches(
    pokemons.results,
    async (pokemon: Pokemon) => {
      const detail: PokemonDetail = await fetch(pokemon.url).then((res) =>
        res.json(),
      );
      const total = detail.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
      return [pokemon.name, total] as const;
    },
    50,
  );

  const map = Object.fromEntries(entries);
  setCached(cacheKey, map);
  return map;
}

async function getPokemonGenerationMap(): Promise<
  Record<string, PokemonGenerationInfo>
> {
  const cacheKey = "pokemon-generation-map";
  const cached = getCached<Record<string, PokemonGenerationInfo>>(cacheKey);
  if (cached) return cached;

  const generationList: { results: { name: string; url: string }[] } =
    await fetch("https://pokeapi.co/api/v2/generation").then((res) =>
      res.json(),
    );

  const map: Record<string, PokemonGenerationInfo> = {};

  await fetchInBatches(
    generationList.results,
    async (generation) => {
      const detail: {
        main_region: { name: string };
        pokemon_species: { name: string }[];
      } = await fetch(generation.url).then((res) => res.json());

      const order = extractIdFromUrl(generation.url);

      for (const species of detail.pokemon_species) {
        map[species.name] = {
          generationName: generation.name,
          regionName: detail.main_region.name,
          order,
        };
      }
    },
    10,
  );

  setCached(cacheKey, map);
  return map;
}

async function sortPokemons(
  pokemons: PokemonWithTotalStats[],
  sortValue: string,
): Promise<PokemonWithTotalStats[]> {
  switch (sortValue) {
    case "asc":
      return [...pokemons].sort((a, b) =>
        a.name.localeCompare(b.name, "en", { sensitivity: "base" }),
      );
    case "desc":
      return [...pokemons].sort((a, b) =>
        b.name.localeCompare(a.name, "en", { sensitivity: "base" }),
      );
    case "id-asc":
      return [...pokemons].sort(
        (a, b) => extractIdFromUrl(a.url) - extractIdFromUrl(b.url),
      );
    case "id-desc":
      return [...pokemons].sort(
        (a, b) => extractIdFromUrl(b.url) - extractIdFromUrl(a.url),
      );
    case "power-asc": {
      const stats = await getPokemonStatsMap();
      return [...pokemons].sort(
        (a, b) => (stats[a.name] ?? 0) - (stats[b.name] ?? 0),
      );
    }
    case "power-desc": {
      const stats = await getPokemonStatsMap();
      return [...pokemons].sort(
        (a, b) => (stats[b.name] ?? 0) - (stats[a.name] ?? 0),
      );
    }
    case "generation-asc": {
      const generations = await getPokemonGenerationMap();
      return [...pokemons].sort(
        (a, b) =>
          (generations[a.name]?.order ?? Number.MAX_SAFE_INTEGER) -
          (generations[b.name]?.order ?? Number.MAX_SAFE_INTEGER),
      );
    }
    case "generation-desc": {
      const generations = await getPokemonGenerationMap();
      return [...pokemons].sort(
        (a, b) =>
          (generations[b.name]?.order ?? -1) -
          (generations[a.name]?.order ?? -1),
      );
    }
    case "default":
    default:
      return [...pokemons];
  }
}

async function getAllSortedPokemons(
  sortValue: string,
  offset: number,
  limit: number,
): Promise<PokemonResponse> {
  const pokemons = await getPokemons();
  const sorted = await sortPokemons(pokemons.results, sortValue);
  const results = sorted.slice(offset, offset + limit);
  const response: PokemonResponse = {
    count: pokemons.count,
    next: pokemons.next,
    previous: pokemons.previous,
    results: results,
  };

  return response;
}

async function getAllSuggestedPokemons(
  query: string,
  maxSuggestions: number = 10,
): Promise<PokemonResponse> {
  const pokemons = await getPokemons();
  const pokemonNames = pokemons.results.map((pokemon: Pokemon) => pokemon.name);
  const matches = pokemonNames
    .filter((name: string) => name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, maxSuggestions);
  const results = await Promise.all(
    matches.map((name: string) => getOnePokemonByNameWithDetail(name)),
  );

  const response: PokemonResponse = {
    count: results.length,
    next: null,
    previous: null,
    results,
  };

  return response;
}

async function getOnePokemonByNameWithDetail(
  name: string,
): Promise<PokemonWithTotalStats> {
  const pokemonDetail: PokemonDetail = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${name}`,
  ).then((res) => res.json());
  const species = await fetch(pokemonDetail.species.url).then((res) =>
    res.json(),
  );
  const generation = await fetch(species.generation.url).then((res) =>
    res.json(),
  );
  const totalStat = pokemonDetail.stats.reduce(
    (sum: number, stat: PokemonStats) => sum + stat.base_stat,
    0,
  );

  return {
    name: pokemonDetail.name,
    url: `https://pokeapi.co/api/v2/pokemon/${pokemonDetail.name}`,
    totalStats: totalStat,
    detail: {
      id: pokemonDetail.id,
      name: pokemonDetail.name,
      stats: pokemonDetail.stats,
      types: pokemonDetail.types,
      species: {
        name: pokemonDetail.species.name,
        url: pokemonDetail.species.url,
        detail: {
          color: species.color,
          generation: {
            name: species.generation.name,
            url: species.generation.url,
            detail: {
              id: generation.id,
              main_region: {
                name: generation.main_region.name,
                url: generation.main_region.url,
              },
            },
          },
        },
      },
      sprites: pokemonDetail.sprites,
    },
  };
}

async function getOnePokemonWithDetail(
  target: Pokemon,
): Promise<PokemonWithTotalStats> {
  const pokemonDetail: PokemonDetail = await fetch(target.url).then((res) =>
    res.json(),
  );
  const species = await fetch(pokemonDetail.species.url).then((res) =>
    res.json(),
  );
  const generation = await fetch(species.generation.url).then((res) =>
    res.json(),
  );
  const totalStat = pokemonDetail.stats.reduce(
    (sum: number, stat: PokemonStats) => sum + stat.base_stat,
    0,
  );

  return {
    name: pokemonDetail.name,
    url: target.url,
    totalStats: totalStat,
    detail: {
      id: pokemonDetail.id,
      name: pokemonDetail.name,
      stats: pokemonDetail.stats,
      types: pokemonDetail.types,
      species: {
        name: pokemonDetail.species.name,
        url: pokemonDetail.species.url,
        detail: {
          color: species.color,
          generation: {
            name: species.generation.name,
            url: species.generation.url,
            detail: {
              id: generation.id,
              main_region: {
                name: generation.main_region.name,
                url: generation.main_region.url,
              },
            },
          },
        },
      },
      sprites: pokemonDetail.sprites,
    },
  };
}

export default function PokemonContent() {
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "";
  const query = searchParams.get("q")?.toLowerCase() || "";
  const offset = Number(searchParams.get("offset")) || 0;
  const limit = Number(searchParams.get("limit")) || 20;

  const [pokemons, setPokemons] = useState<PokemonResponse>();
  const [error, setError] = useState<string>("");
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    async function findAll(): Promise<void> {
      try {
        setError("");

        const data = query
          ? await getAllSuggestedPokemons(query)
          : sort
            ? await getAllSortedPokemons(sort, offset, limit)
            : await getAllPokemons(offset, limit);

        if (query && data.count < 1) {
          throw new Error(`Pokemon like '${query}' not found.`);
        }

        const results = await Promise.all(
          data.results.map(getOnePokemonWithDetail),
        );

        setCount(data.count);
        setPokemons({
          count: data.count,
          next: data.next,
          previous: data.previous,
          results: results,
        });
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred.",
        );
      }
    }

    findAll();
  }, [limit, offset, query, sort]);

  if (error)
    return (
      <section
        id="content"
        className="max-h-full min-h-screen w-screen max-w-full bg-black dark:bg-soft-black  transition-colors duration-300 ease-in-out"
      >
        <div className="container mx-auto">
          <div className="flex flex-col space-y-8 px-4 py-8">
            <p className="font-bold text-xl text-center text-gray-50 dark:text-white">
              {error}
            </p>

            {/* SEARCH BAR */}
            <SearchBar placeholder="Search pokemon by name..." />
          </div>
        </div>
      </section>
    );

  return (
    <section
      id="content"
      className="max-h-full min-h-screen w-screen max-w-full bg-black dark:bg-soft-black  transition-colors duration-300 ease-in-out"
    >
      <div className="container mx-auto">
        <div className="flex flex-col space-y-8 px-4 py-8">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 items-center">
            {/* SEARCH BAR */}
            <SearchBar placeholder="Search pokemon..." />

            <div className="flex flex-row space-x-4 items-center">
              {/* SORT BUTTON */}
              <SortButton options={POKEMON_SORT_OPTIONS} />

              {/* CATEGORY BUTTON */}
              <CategoryButton />
            </div>
          </div>
          {/* TABLE */}
          <PokemonTable
            offset={offset}
            pokemons={pokemons as PokemonResponse}
          />
          <SimplePagination total={count} offset={offset} limit={limit} />
        </div>
      </div>
    </section>
  );
}
