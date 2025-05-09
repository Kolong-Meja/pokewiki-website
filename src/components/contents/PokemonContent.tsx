"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Pokemon, PokemonResponse } from "@/types/pokemon";
import SearchBar from "../SearchBar";
import PokemonTable from "../tables/PokemonTable";
import SortButton from "../buttons/SortButton";
import SimplePagination from "../SimplePagination";

async function sortPokemons(
  pokemons: Pokemon[],
  sortValue: string
): Promise<Pokemon[]> {
  switch (sortValue) {
    case "asc":
      return [...pokemons].sort((a, b) =>
        a.name.localeCompare(b.name, "en", { sensitivity: "base" })
      );
    case "desc":
      return [...pokemons].sort((a, b) =>
        b.name.localeCompare(a.name, "en", { sensitivity: "base" })
      );
    case "default":
      return [...pokemons];
    default:
      return [...pokemons];

    // case "region":
    //   return [...pokemons].sort((a, b) => {
    //     const initialRegion = a.detail?.species.detail?.generation.detail
    //       ?.main_region.name as string;
    //     const nextRegion = b.detail?.species.detail?.generation.detail
    //       ?.main_region.name as string;
    //     return initialRegion?.localeCompare(nextRegion, "en", {
    //       sensitivity: "base",
    //     });
    //   });
    // case "powerful":
    //   return [...pokemons].sort((a, b) => {
    //     const initial =
    //       a.detail?.stats.reduce((sum, stat) => sum + stat.base_stat, 0) ?? 0;
    //     const last =
    //       b.detail?.stats.reduce((sum, stat) => sum + stat.base_stat, 0) ?? 0;
    //     return last - initial;
    //   });
    // case "weakest":
    //   return [...pokemons].sort((a, b) => {
    //     const initial =
    //       a.detail?.stats.reduce((sum, stat) => sum + stat.base_stat, 0) ?? 0;
    //     const last =
    //       b.detail?.stats.reduce((sum, stat) => sum + stat.base_stat, 0) ?? 0;
    //     return initial - last;
    //   });
  }
}

async function getAllPokemons(
  offset: number,
  limit: number
): Promise<PokemonResponse> {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
  );
  if (!response.ok) throw new Error("Failed to fetch pokemons.");
  const data = await response.json();

  return data;
}

async function getAllSortedPokemons(
  sortValue: string,
  offset: number,
  limit: number
): Promise<PokemonResponse> {
  let pokemons;
  const cachedPokemons = localStorage.getItem("pokemons");

  if (!cachedPokemons) {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=1302"
    );
    if (!response.ok) throw new Error("Failed to fetch pokemons.");

    pokemons = await response.json();
    localStorage.setItem("pokemons", JSON.stringify(pokemons));
  } else {
    pokemons = JSON.parse(cachedPokemons);
  }

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
  maxSuggestions: number = 20
): Promise<PokemonResponse> {
  let pokemons;
  const cachedPokemons = localStorage.getItem("pokemons");

  if (!cachedPokemons) {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=1302"
    );

    if (!response.ok) throw new Error("Failed to fetch pokemons.");

    pokemons = await response.json();
    localStorage.setItem("pokemons", JSON.stringify(pokemons));
  } else {
    pokemons = JSON.parse(cachedPokemons);
  }

  const pokemonNames = pokemons.results.map((pokemon: Pokemon) => pokemon.name);
  const matches = pokemonNames
    .filter((name: string) => name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, maxSuggestions);
  const results = await Promise.all(
    matches.map((name: string) => getOnePokemonByNameWithDetail(name))
  );

  const response: PokemonResponse = {
    count: results.length,
    next: null,
    previous: null,
    results,
  };

  return response;
}

async function getOnePokemonByNameWithDetail(name: string): Promise<Pokemon> {
  const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(
    (res) => res.json()
  );
  const species = await fetch(pokemon.species.url).then((res) => res.json());
  const generation = await fetch(species.generation.url).then((res) =>
    res.json()
  );

  const result: Pokemon = {
    name: pokemon.name,
    url: `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`,
    detail: {
      id: pokemon.id,
      stats: pokemon.stats,
      types: pokemon.types,
      species: {
        name: pokemon.species.name,
        url: pokemon.species.url,
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
      sprites: pokemon.sprites,
    },
  };

  return result;
}

async function getOnePokemonWithDetail(target: Pokemon): Promise<Pokemon> {
  const pokemon = await fetch(target.url).then((res) => res.json());
  const species = await fetch(pokemon.species.url).then((res) => res.json());
  const generation = await fetch(species.generation.url).then((res) =>
    res.json()
  );

  const result: Pokemon = {
    name: pokemon.name,
    url: pokemon.url,
    detail: {
      id: pokemon.id,
      stats: pokemon.stats,
      types: pokemon.types,
      species: {
        name: pokemon.species.name,
        url: pokemon.species.url,
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
      sprites: pokemon.sprites,
    },
  };

  return result;
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
          ? await getAllSuggestedPokemons(query, limit)
          : sort
          ? await getAllSortedPokemons(sort, offset, limit)
          : await getAllPokemons(offset, limit);

        if (query && data.count < 1) {
          throw new Error(`Pokemon like '${query}' not found.`);
        }

        const results = await Promise.all(
          data.results.map(getOnePokemonWithDetail)
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
          error instanceof Error ? error.message : "An unknown error occurred."
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
          <div className="flex flex-row space-x-4 items-center">
            {/* SEARCH BAR */}
            <SearchBar placeholder="Search pokemon..." />

            {/* SORT BUTTON */}
            <SortButton />
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
