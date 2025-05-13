import {
  Berry,
  BerryDetail,
  BerryItemDetail,
  BerryResponse,
} from "@/types/berry";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SearchBar from "../SearchBar";
import CategoryButton from "../buttons/CategoryButton";
import BerryTable from "../tables/BerryTable";
import SimplePagination from "../SimplePagination";
import SortButton from "../buttons/SortButton";

async function sortBerries(
  berries: Berry[],
  sortValue: string
): Promise<Berry[]> {
  switch (sortValue) {
    case "asc":
      return [...berries].sort((a, b) =>
        a.name.localeCompare(b.name, "en", { sensitivity: "base" })
      );
    case "desc":
      return [...berries].sort((a, b) =>
        b.name.localeCompare(a.name, "en", { sensitivity: "base" })
      );
    case "default":
      return [...berries];
    default:
      return [...berries];
  }
}

async function getAllBerries(
  offset: number,
  limit: number
): Promise<BerryResponse> {
  const response = await fetch(
    `https://pokeapi.co/api/v2/berry?offset=${offset}&limit=${limit}`
  );
  if (!response.ok) throw new Error("Failed to fetch berries.");
  const data = await response.json();

  return data;
}

async function getAllSortedBerries(
  sortValue: string,
  offset: number,
  limit: number
): Promise<BerryResponse> {
  let berries;
  const cachedBerries = localStorage.getItem("berries");

  if (!cachedBerries) {
    const response = await fetch("https://pokeapi.co/api/v2/berry?limit=64");
    if (!response.ok) throw new Error("Failed to fetch berries.");

    berries = await response.json();
    localStorage.setItem("berries", JSON.stringify(berries));
  } else {
    berries = JSON.parse(cachedBerries);
  }

  const sorted = await sortBerries(berries.results, sortValue);
  const results = sorted.slice(offset, offset + limit);
  const response: BerryResponse = {
    count: berries.count,
    next: berries.next,
    previous: berries.previous,
    results: results,
  };

  return response;
}

async function getAllSuggestedBerries(
  query: string,
  maxSuggestions: number = 20
): Promise<BerryResponse> {
  let berries;
  const cachedBerries = localStorage.getItem("berries");

  if (!cachedBerries) {
    const response = await fetch("https://pokeapi.co/api/v2/berry?limit=64");

    if (!response.ok) throw new Error("Failed to fetch berries.");

    berries = await response.json();
    localStorage.setItem("berries", JSON.stringify(berries));
  } else {
    berries = JSON.parse(cachedBerries);
  }

  const berryNames = berries.results.map((berry: Berry) => berry.name);
  const matches = berryNames
    .filter((name: string) => name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, maxSuggestions);
  const results = await Promise.all(
    matches.map((name: string) => getOneBerryByNameWithDetail(name))
  );

  const response: BerryResponse = {
    count: results.length,
    next: null,
    previous: null,
    results,
  };

  return response;
}

async function getOneBerryByNameWithDetail(name: string): Promise<Berry> {
  const berryDetail: BerryDetail = await fetch(
    `https://pokeapi.co/api/v2/berry/${name}`
  ).then((res) => res.json());
  const itemDetail: BerryItemDetail = await fetch(berryDetail.item.url).then(
    (res) => res.json()
  );

  const result: Berry = {
    name: berryDetail.name,
    url: `https://pokeapi.co/api/v2/berry/${berryDetail.name}`,
    detail: {
      id: berryDetail.id,
      name: berryDetail.name,
      growth_time: berryDetail.growth_time,
      max_harvest: berryDetail.max_harvest,
      natural_gift_power: berryDetail.natural_gift_power,
      size: berryDetail.size,
      smoothness: berryDetail.smoothness,
      soil_dryness: berryDetail.soil_dryness,
      firmness: berryDetail.firmness,
      item: {
        name: berryDetail.item.name,
        url: berryDetail.item.url,
        detail: {
          id: itemDetail.id,
          name: itemDetail.name,
          cost: itemDetail.cost,
          game_indices: itemDetail.game_indices,
          sprites: itemDetail.sprites,
          effect_entries: itemDetail.effect_entries,
        },
      },
      natural_gift_type: berryDetail.natural_gift_type,
      flavors: berryDetail.flavors,
    },
  };

  return result;
}

async function getOneBerryWithDetail(target: Berry): Promise<Berry> {
  const berryDetail: BerryDetail = await fetch(target.url).then((res) =>
    res.json()
  );
  const itemDetail: BerryItemDetail = await fetch(berryDetail.item.url).then(
    (res) => res.json()
  );

  const result: Berry = {
    name: berryDetail.name,
    url: `https://pokeapi.co/api/v2/berry/${berryDetail.name}`,
    detail: {
      id: berryDetail.id,
      name: berryDetail.name,
      growth_time: berryDetail.growth_time,
      max_harvest: berryDetail.max_harvest,
      natural_gift_power: berryDetail.natural_gift_power,
      size: berryDetail.size,
      smoothness: berryDetail.smoothness,
      soil_dryness: berryDetail.soil_dryness,
      firmness: berryDetail.firmness,
      item: {
        name: berryDetail.item.name,
        url: berryDetail.item.url,
        detail: {
          id: itemDetail.id,
          name: itemDetail.name,
          cost: itemDetail.cost,
          game_indices: itemDetail.game_indices,
          sprites: itemDetail.sprites,
          effect_entries: itemDetail.effect_entries,
        },
      },
      natural_gift_type: berryDetail.natural_gift_type,
      flavors: berryDetail.flavors,
    },
  };

  return result;
}

export default function BerryContent() {
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "";
  const query = searchParams.get("q")?.toLowerCase() || "";
  const offset = Number(searchParams.get("offset")) || 0;
  const limit = Number(searchParams.get("limit")) || 20;

  const [berries, setBerries] = useState<BerryResponse>();
  const [error, setError] = useState<string>("");
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    async function findAll(): Promise<void> {
      try {
        setError("");

        const data = query
          ? await getAllSuggestedBerries(query, limit)
          : sort
          ? await getAllSortedBerries(sort, offset, limit)
          : await getAllBerries(offset, limit);

        if (query && data.count < 1) {
          throw new Error(`Berry like '${query}' not found.`);
        }

        const results = await Promise.all(
          data.results.map(getOneBerryWithDetail)
        );

        setCount(data.count);
        setBerries({
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
  }, [count, limit, offset, query, sort]);

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
            <SearchBar placeholder="Search berry by name..." />
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
            <SearchBar placeholder="Search berry..." />

            <div className="flex flex-row space-x-4 items-center">
              {/* SORT BUTTON */}
              <SortButton />

              {/* CATEGORY BUTTON */}
              <CategoryButton />
            </div>
          </div>
          {/* TABLE */}
          <BerryTable offset={offset} berries={berries as BerryResponse} />
          <SimplePagination total={count} offset={offset} limit={limit} />
        </div>
      </div>
    </section>
  );
}
