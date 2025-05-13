import { BerryResponse } from "@/types/berry";
import BerryTableSkeleton from "../skeletons/BerryTableSkeleton";
import { renewal, renewalInTitleCase } from "@/utils/string";
import Image from "next/image";

type BerryTableProps = {
  offset: number;
  berries: BerryResponse;
};

export default function BerryTable({ offset, berries }: BerryTableProps) {
  if (!berries) {
    return <BerryTableSkeleton />;
  }

  if (berries.count === 0) {
    return <BerryTableSkeleton />;
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
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {berries?.results.map((berry, index) => (
            <tr
              key={berry.name}
              className="bg-table-header hover:bg-zinc-900 dark:hover:bg-zinc-800 transition-colors duration-300 ease-in-out"
            >
              <th
                scope="row"
                className="px-6 py-4 font-bold whitespace-nowrap text-gray-50 dark:text-white"
              >
                {offset + index + 1}.
              </th>
              <td className="px-6 py-4 whitespace-nowrap">
                {renewalInTitleCase(berry.detail?.item.name as string)}
              </td>
              <td className="px-6 py-4 min-w-[100px] whitespace-nowrap">
                <div className="flex flex-row space-x-2 justify-center items-center">
                  {berry.detail?.item.detail?.sprites.default ? (
                    <Image
                      src={berry.detail?.item.detail.sprites.default}
                      alt={`${renewalInTitleCase(
                        berry.detail.item.name
                      )} Image`}
                      width={100}
                      height={100}
                      className="object-cover w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 shrink-0"
                    />
                  ) : (
                    <span className="text-gray-400 italic">No Image</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                {renewal(
                  berry.detail?.item.detail?.game_indices[0].generation
                    .name as string
                )}
              </td>
              <td className="px-6 py-4">
                {
                  berry.detail?.item.detail?.effect_entries[0]
                    .short_effect as string
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
