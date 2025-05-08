"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Pokemon, PokemonResponse } from "@/types/pokemon";
import SearchBar from "../SearchBar/page";
import Pagination from "../Pagination/page";
import PokemonTable from "../PokemonTable/page";

async function getAllPokemons(offset: number, limit: number) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
  );
  await new Promise((resolve) => setTimeout(resolve, 800));
  if (!response.ok) throw new Error("Failed to fetch pokemons.");
  const data = await response.json();
  return data;
}

async function getSuggestedPokemonNames(query: string): Promise<string[]> {
  let pokemonsData;
  const cached = localStorage.getItem("pokemons");

  if (!cached) {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=1302"
    );
    if (!response.ok) throw new Error("Failed to fetch pokemons.");
    await new Promise((resolve) => setTimeout(resolve, 800));
    pokemonsData = await response.json();
    localStorage.setItem("pokemons", JSON.stringify(pokemonsData));
  } else {
    pokemonsData = JSON.parse(cached);
  }

  const pokemonNames = pokemonsData.results.map(
    (pokemon: Pokemon) => pokemon.name
  );
  const input = query.toLowerCase();
  return pokemonNames.filter((name: string) =>
    name.toLowerCase().includes(input)
  );
}

async function getPokemonDetail(name: string): Promise<Pokemon> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const data = await response.json();

  const speciesRes = await fetch(data.species.url);
  const speciesData = await speciesRes.json();

  const generationRes = await fetch(speciesData.generation.url);
  const generationData = await generationRes.json();

  return {
    name: data.name,
    url: `https://pokeapi.co/api/v2/pokemon/${data.name}`,
    detail: {
      id: data.id,
      base_exp: data.base_experience,
      stats: data.stats,
      types: data.types,
      past_abilities: data.past_abilities,
      species: {
        name: data.species.name,
        url: data.species.url,
        detail: {
          base_happiness: speciesData.base_happiness,
          capture_rate: speciesData.capture_rate,
          color: speciesData.color,
          generation: {
            name: speciesData.generation.name,
            url: speciesData.generation.url,
            detail: {
              id: generationData.id,
              main_region: {
                name: generationData.main_region.name,
                url: generationData.main_region.url,
              },
            },
          },
        },
      },
      sprites: data.sprites,
      height: data.height,
      weight: data.weight,
    },
  };
}

async function getAllSuggestedPokemons(
  query: string,
  maxSuggestions: number = 20
) {
  const names = await getSuggestedPokemonNames(query);

  const selectedNames = names.slice(0, maxSuggestions);

  const results = await Promise.all(
    selectedNames.map((name) => getPokemonDetail(name))
  );

  return {
    count: results.length,
    next: null,
    previous: null,
    results,
  };
}

export default function Content() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase();
  const offset = Number(searchParams.get("offset")) || 0;
  const limit = Number(searchParams.get("limit")) || 20;

  const [pokemons, setPokemons] = useState<PokemonResponse>();
  const [error, setError] = useState<string>("");
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    async function findAll() {
      setError("");

      try {
        if (!query) {
          const data = await getAllPokemons(offset, limit);
          setCount(data.count);

          const results = await Promise.all(
            data.results.map(async (pokemon: Pokemon) => {
              // FETCH DETAIL.
              const detailResponse = await fetch(pokemon.url);
              const detailData = await detailResponse.json();

              // FETCH SPECIES
              const speciesResponse = await fetch(detailData.species.url);
              const speciesData = await speciesResponse.json();

              // FETCH GENERATION
              const generationRes = await fetch(speciesData.generation.url);
              const generationData = await generationRes.json();

              return {
                name: pokemon.name,
                url: pokemon.url,
                detail: {
                  id: detailData.id,
                  base_exp: detailData.base_experience,
                  stats: detailData.stats,
                  types: detailData.types,
                  past_abilities: detailData.past_abilities,
                  species: {
                    name: detailData.species.name,
                    url: detailData.species.url,
                    detail: {
                      base_happiness: speciesData.base_happiness,
                      capture_rate: speciesData.capture_rate,
                      color: speciesData.color,
                      generation: {
                        name: speciesData.generation.name,
                        url: speciesData.generation.url,
                        detail: {
                          id: generationData.id,
                          main_region: {
                            name: generationData.main_region.name,
                            url: generationData.main_region.url,
                          },
                        },
                      },
                    },
                  },
                  sprites: detailData.sprites,
                  height: detailData.height,
                  weight: detailData.weight,
                },
              };
            })
          );

          setPokemons({
            count: data.count,
            next: data.next,
            previous: data.previous,
            results: results,
          });
        } else {
          const data = await getAllSuggestedPokemons(query, limit);
          setCount(data.count);

          if (count < 1) {
            throw new Error(`Pokemon like '${query}' not found.`);
          }

          setPokemons(data);
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred.");
        }
      }
    }

    findAll();
  }, [count, limit, offset, query]);

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
          {/* SEARCH BAR */}
          <SearchBar placeholder="Search pokemon..." />

          {/* TABLE */}
          <PokemonTable pokemons={pokemons as PokemonResponse} />
          <Pagination total={count} offset={offset} limit={limit} />
        </div>
      </div>
    </section>
  );
}
