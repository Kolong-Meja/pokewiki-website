import { capitalize, renewal } from "@/utils/string";
import { PokemonResponse, PokemonTypes } from "@/types/pokemon";
import PokemonTableSkeleton from "../PokemonTableSkeleton/page";

type PokemonTableProps = {
  pokemons: PokemonResponse;
};

export default function PokemonTable({ pokemons }: PokemonTableProps) {
  const pokemonTypeBadge = (types: PokemonTypes[]) => {
    return (
      <div className="flex flex-wrap gap-1">
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
                  className={`${baseClass} bg-indigo-50 text-indigo-700 ring-indigo-600/10`}
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
  };

  return pokemons?.results.length <= 0 ? (
    <PokemonTableSkeleton />
  ) : (
    <div className="relative overflow-x-auto shadow-md rounded-lg">
      <table className="w-full text-xs sm:text-sm text-center rtl:text-right text-gray-50 dark:text-white">
        <thead className="text-xs sm:text-sm bg-soft-dark uppercase text-gray-50 dark:text-white">
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
          </tr>
        </thead>
        <tbody>
          {pokemons?.results.map((pokemon) => (
            <tr
              key={pokemon.name}
              className="bg-table-header hover:bg-zinc-900 dark:hover:bg-zinc-800 transition-colors duration-300 ease-in-out"
            >
              <th
                scope="row"
                className="px-6 py-4 font-bold whitespace-nowrap text-gray-50 dark:text-white"
              >
                {pokemon.detail?.id}.
              </th>
              <td className="px-6 py-4">{capitalize(pokemon.name)}</td>
              <td className="px-6 py-4">
                <div className="flex justify-center items-center">
                  <img
                    src={pokemon.detail?.sprites.front_default as string}
                    alt={`${pokemon.name} Image`}
                    className="object-cover w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28"
                  />
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
              <td className="px-6 py-4">
                <div className="flex justify-center items-center">
                  {pokemonTypeBadge(pokemon.detail?.types as PokemonTypes[])}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
