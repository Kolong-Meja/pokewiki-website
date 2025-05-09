import { capitalize, renewal } from "@/utils/string";
import { PokemonResponse, PokemonTypes } from "@/types/pokemon";
import PokemonTableSkeleton from "../components/skeletons/PokemonTableSkeleton";
import Image from "next/image";
import { JSX } from "react";

type PokemonTableProps = {
  offset: number;
  pokemons: PokemonResponse;
};

function pokemonTypeBadge(types: PokemonTypes[]): JSX.Element {
  return (
    <div className="flex flex-nowrap gap-1">
      {types.map((t) => {
        const typeName = t.type.name;
        const baseClass =
          "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset";
        switch (typeName) {
          case "fire":
            return (
              <span
                key={typeName}
                className={`${baseClass} bg-red-50 text-red-700 ring-red-600/10`}
              >
                {capitalize(typeName)}
              </span>
            );
          case "grass":
            return (
              <span
                key={typeName}
                className={`${baseClass} bg-green-50 text-green-700 ring-green-600/10`}
              >
                {capitalize(typeName)}
              </span>
            );
          case "water":
            return (
              <span
                key={typeName}
                className={`${baseClass} bg-blue-50 text-blue-700 ring-blue-600/10`}
              >
                {capitalize(typeName)}
              </span>
            );
          case "electric":
            return (
              <span
                key={typeName}
                className={`${baseClass} bg-yellow-50 text-yellow-700 ring-yellow-600/10`}
              >
                {capitalize(typeName)}
              </span>
            );
          case "normal":
            return (
              <span
                key={typeName}
                className={`${baseClass} bg-gray-50 text-gray-700 ring-gray-600/10`}
              >
                {capitalize(typeName)}
              </span>
            );
          case "flying":
            return (
              <span
                key={typeName}
                className={`${baseClass} bg-sky-50 text-sky-600 ring-sky-500/10`}
              >
                {capitalize(typeName)}
              </span>
            );
          case "poison":
            return (
              <span
                key={typeName}
                className={`${baseClass} bg-purple-50 text-purple-700 ring-purple-600/10`}
              >
                {capitalize(typeName)}
              </span>
            );
          case "bug":
            return (
              <span
                key={typeName}
                className={`${baseClass} bg-lime-50 text-lime-700 ring-lime-600/10`}
              >
                {capitalize(typeName)}
              </span>
            );
          case "steel":
            return (
              <span
                key={typeName}
                className={`${baseClass} bg-slate-50 text-slate-700 ring-slate-600/10`}
              >
                {capitalize(typeName)}
              </span>
            );
          case "fighting":
            return (
              <span
                key={typeName}
                className={`${baseClass} bg-amber-50 text-amber-900 ring-amber-600/10`}
              >
                {capitalize(typeName)}
              </span>
            );
          case "ground":
            return (
              <span
                key={typeName}
                className={`${baseClass} bg-yellow-50 text-yellow-600 ring-yellow-600/10`}
              >
                {capitalize(typeName)}
              </span>
            );
          case "fairy":
            return (
              <span
                key={typeName}
                className={`${baseClass} bg-fuchsia-50 text-fuchsia-400 ring-fuchsia-600/10`}
              >
                {capitalize(typeName)}
              </span>
            );
          case "psychic":
            return (
              <span
                key={typeName}
                className={`${baseClass} bg-pink-50 text-pink-600 ring-pink-600/10`}
              >
                {capitalize(typeName)}
              </span>
            );
          case "ice":
            return (
              <span
                key={typeName}
                className={`${baseClass} bg-cyan-50 text-cyan-500 ring-cyan-600/10`}
              >
                {capitalize(typeName)}
              </span>
            );
          case "rock":
            return (
              <span
                key={typeName}
                className={`${baseClass} bg-orange-50 text-orange-900 ring-orange-600/10`}
              >
                {capitalize(typeName)}
              </span>
            );
          case "dragon":
            return (
              <span
                key={typeName}
                className={`${baseClass} bg-indigo-50 text-indigo-700 ring-indigo-600/10`}
              >
                {capitalize(typeName)}
              </span>
            );
          default:
            return (
              <span
                key={typeName}
                className={`${baseClass} bg-gray-50 text-gray-700 ring-gray-600/10`}
              >
                {capitalize(typeName)}
              </span>
            );
        }
      })}
    </div>
  );
}

function StatusCell({ baseStat }: { baseStat: number }) {
  let colorClass = "";

  switch (true) {
    case baseStat < 26:
      colorClass = "text-red-600 dark:text-red-500 font-bold";
      break;
    case baseStat < 51:
      colorClass = "text-amber-600 dark:text-amber-500 font-bold";
      break;
    case baseStat < 71:
      colorClass = "text-yellow-500 dark:text-amber-400 font-bold";
      break;
    case baseStat < 91:
      colorClass = "text-lime-500 dark:text-lime-400 font-bold";
      break;
    case baseStat < 131:
      colorClass = "text-green-500 dark:text-green-400 font-bold";
      break;
    case baseStat < 151:
      colorClass = "text-emerald-500 dark:text-emerald-400 font-bold";
      break;
    case baseStat < 256:
      colorClass = "text-emerald-400 dark:text-emerald-300 font-bold";
      break;
    default:
      colorClass = "text-red-600 dark:text-red-500 font-bold";
      break;
  }

  return <span className={colorClass}>{baseStat}</span>;
}

export default function PokemonTable({ offset, pokemons }: PokemonTableProps) {
  if (!pokemons) {
    return <PokemonTableSkeleton />;
  }

  if (pokemons.count === 0) {
    return <PokemonTableSkeleton />;
  }

  return (
    <div className="relative overflow-x-auto max-w-full shadow-md rounded-lg">
      <table className="w-full text-xs sm:text-sm text-center rtl:text-right text-gray-50 dark:text-white">
        <thead className="text-xs sm:text-sm bg-soft-dark uppercase text-gray-50 dark:text-white text-nowrap">
          <tr>
            <th scope="col" className="px-6 py-3">
              No.
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Image
            </th>
            <th scope="col" className="px-6 py-3">
              Generation
            </th>
            <th scope="col" className="px-6 py-3">
              Region
            </th>
            <th scope="col" className="px-6 py-3">
              Types
            </th>
            <th scope="col" className="px-6 py-3">
              HP Stat
            </th>
            <th scope="col" className="px-6 py-3">
              Atk Stat
            </th>
            <th scope="col" className="px-6 py-3">
              Def Stat
            </th>
            <th scope="col" className="px-6 py-3">
              Sp. Atk Stat
            </th>
            <th scope="col" className="px-6 py-3">
              Sp. Def Stat
            </th>
            <th scope="col" className="px-6 py-3">
              Speed Stat
            </th>
            <th scope="col" className="px-6 py-3">
              Total Stat
            </th>
          </tr>
        </thead>
        <tbody>
          {pokemons?.results.map((pokemon, index) => (
            <tr
              key={pokemon.name}
              className="bg-table-header hover:bg-zinc-900 dark:hover:bg-zinc-800 transition-colors duration-300 ease-in-out"
            >
              <th
                scope="row"
                className="px-6 py-4 font-bold whitespace-nowrap text-gray-50 dark:text-white"
              >
                {offset + index + 1}.
              </th>
              <td className="px-6 py-4 whitespace-nowrap">
                {capitalize(pokemon.name)}
              </td>
              <td className="px-6 py-4 min-w-[100px] whitespace-nowrap">
                <div className="flex flex-row space-x-2 justify-center items-center">
                  {pokemon.detail?.sprites.front_default ? (
                    <Image
                      src={pokemon.detail?.sprites.front_default}
                      alt={`${pokemon.name} Image`}
                      width={100}
                      height={100}
                      className="object-cover w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 shrink-0"
                    />
                  ) : (
                    <span className="text-gray-400 italic">No Image</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                {renewal(
                  pokemon.detail?.species.detail?.generation.name as string
                )}
              </td>
              <td className="px-6 py-4">
                {capitalize(
                  pokemon.detail?.species.detail?.generation.detail?.main_region
                    .name as string
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-row space-x-2 justify-center items-center">
                  {pokemonTypeBadge(pokemon.detail?.types as PokemonTypes[])}
                </div>
              </td>

              <td className="px-6 py-4">
                <StatusCell
                  baseStat={pokemon.detail?.stats[0].base_stat as number}
                />
              </td>
              <td className="px-6 py-4">
                <StatusCell
                  baseStat={pokemon.detail?.stats[1].base_stat as number}
                />
              </td>
              <td className="px-6 py-4">
                <StatusCell
                  baseStat={pokemon.detail?.stats[2].base_stat as number}
                />
              </td>
              <td className="px-6 py-4">
                <StatusCell
                  baseStat={pokemon.detail?.stats[3].base_stat as number}
                />
              </td>
              <td className="px-6 py-4">
                <StatusCell
                  baseStat={pokemon.detail?.stats[4].base_stat as number}
                />
              </td>
              <td className="px-6 py-4">
              <StatusCell
                  baseStat={pokemon.detail?.stats[5].base_stat as number}
                />
              </td>
              <td className="px-6 py-4">
                <span className="font-bold text-gray-50 dark:text-white">
                  {pokemon.detail?.stats.reduce(
                    (sum, stat) => sum + stat.base_stat,
                    0
                  )}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
