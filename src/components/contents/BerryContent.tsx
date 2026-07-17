import {
  Berry,
  BerryDetail,
  BerryItemDetail,
  BerryResponse,
  BerrySortInfo,
} from "@/types/berry";
import { SortOption } from "@/types/sort";
import {
  extractIdFromUrl,
  fetchInBatches,
  getCached,
  setCached,
} from "@/utils/sort";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SearchBar from "../SearchBar";
import CategoryButton from "../buttons/CategoryButton";
import BerryTable from "../tables/BerryTable";
import SimplePagination from "../SimplePagination";
import SortButton from "../buttons/SortButton";

const BERRY_SORT_OPTIONS: SortOption[] = [
  { value: "default", label: "Sort by Default" },
  { value: "asc", label: "[ A-Z ] Sort by Name" },
  { value: "desc", label: "[ Z-A ] Sort by Name" },
  { value: "id-asc", label: "[ Low-High ] Sort by ID" },
  { value: "id-desc", label: "[ High-Low ] Sort by ID" },
  { value: "growth-asc", label: "[ Fastest ] Sort by Growth Time" },
  { value: "growth-desc", label: "[ Slowest ] Sort by Growth Time" },
  { value: "size-asc", label: "[ Smallest ] Sort by Size" },
  { value: "size-desc", label: "[ Largest ] Sort by Size" },
  { value: "firmness-asc", label: "[ Softest ] Sort by Firmness" },
  { value: "firmness-desc", label: "[ Hardest ] Sort by Firmness" },
];

async function getBerries(): Promise<BerryResponse> {
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

  return berries;
}

async function getAllBerries(
  offset: number,
  limit: number,
): Promise<BerryResponse> {
  const response = await fetch(
    `https://pokeapi.co/api/v2/berry?offset=${offset}&limit=${limit}`,
  );
  if (!response.ok) throw new Error("Failed to fetch berries.");
  const data = await response.json();

  return data;
}

async function getBerrySortInfoMap(): Promise<Record<string, BerrySortInfo>> {
  const cacheKey = "berry-sort-info-map";
  const cached = getCached<Record<string, BerrySortInfo>>(cacheKey);
  if (cached) return cached;

  const berries = await getBerries();

  const entries = await fetchInBatches(
    berries.results,
    async (berry: Berry) => {
      const detail: BerryDetail = await fetch(berry.url).then((res) =>
        res.json(),
      );
      const info: BerrySortInfo = {
        growthTime: detail.growth_time,
        size: detail.size,
        firmnessRank: extractIdFromUrl(detail.firmness.url),
      };
      return [berry.name, info] as const;
    },
    20,
  );

  const map = Object.fromEntries(entries);
  setCached(cacheKey, map);
  return map;
}

async function sortBerries(
  berries: Berry[],
  sortValue: string,
): Promise<Berry[]> {
  switch (sortValue) {
    case "asc":
      return [...berries].sort((i, l) =>
        i.name.localeCompare(l.name, "en", { sensitivity: "base" }),
      );
    case "desc":
      return [...berries].sort((i, l) =>
        l.name.localeCompare(i.name, "en", { sensitivity: "base" }),
      );
    case "id-asc":
      return [...berries].sort(
        (i, l) => extractIdFromUrl(i.url) - extractIdFromUrl(l.url),
      );
    case "id-desc":
      return [...berries].sort(
        (i, l) => extractIdFromUrl(l.url) - extractIdFromUrl(i.url),
      );
    case "growth-asc": {
      const info = await getBerrySortInfoMap();
      return [...berries].sort(
        (i, l) =>
          (info[i.name]?.growthTime ?? 0) - (info[l.name]?.growthTime ?? 0),
      );
    }
    case "growth-desc": {
      const info = await getBerrySortInfoMap();
      return [...berries].sort(
        (i, l) =>
          (info[l.name]?.growthTime ?? 0) - (info[i.name]?.growthTime ?? 0),
      );
    }
    case "size-asc": {
      const info = await getBerrySortInfoMap();
      return [...berries].sort(
        (i, l) => (info[i.name]?.size ?? 0) - (info[l.name]?.size ?? 0),
      );
    }
    case "size-desc": {
      const info = await getBerrySortInfoMap();
      return [...berries].sort(
        (i, l) => (info[l.name]?.size ?? 0) - (info[i.name]?.size ?? 0),
      );
    }
    case "firmness-asc": {
      const info = await getBerrySortInfoMap();
      return [...berries].sort(
        (i, l) =>
          (info[i.name]?.firmnessRank ?? 0) - (info[l.name]?.firmnessRank ?? 0),
      );
    }
    case "firmness-desc": {
      const info = await getBerrySortInfoMap();
      return [...berries].sort(
        (i, l) =>
          (info[l.name]?.firmnessRank ?? 0) - (info[i.name]?.firmnessRank ?? 0),
      );
    }
    case "default":
    default:
      return [...berries];
  }
}

async function getAllSortedBerries(
  sortValue: string,
  offset: number,
  limit: number,
): Promise<BerryResponse> {
  const berries = await getBerries();
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
  maxSuggestions: number = 10,
): Promise<BerryResponse> {
  const berries = await getBerries();
  const berryNames = berries.results.map((berry: Berry) => berry.name);
  const matches = berryNames
    .filter((name: string) => name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, maxSuggestions);
  const results = await Promise.all(
    matches.map((name: string) => getOneBerryByNameWithDetail(name)),
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
    `https://pokeapi.co/api/v2/berry/${name}`,
  ).then((res) => res.json());
  const itemDetail: BerryItemDetail = await fetch(berryDetail.item.url).then(
    (res) => res.json(),
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
    res.json(),
  );
  const itemDetail: BerryItemDetail = await fetch(berryDetail.item.url).then(
    (res) => res.json(),
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
          ? await getAllSuggestedBerries(query)
          : sort
            ? await getAllSortedBerries(sort, offset, limit)
            : await getAllBerries(offset, limit);

        if (query && data.count < 1) {
          throw new Error(`Berry like '${query}' not found.`);
        }

        const results = await Promise.all(
          data.results.map(getOneBerryWithDetail),
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
          error instanceof Error ? error.message : "An unknown error occurred.",
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
              <SortButton options={BERRY_SORT_OPTIONS} />

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
