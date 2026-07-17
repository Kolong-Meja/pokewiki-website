import { BerryResponse } from "@/types/berry";
import BerryTableSkeleton from "../skeletons/BerryTableSkeleton";
import { capitalize, renewal, renewalInTitleCase } from "@/utils/string";
import { getBadgeBaseClass, getFlavorBadgeColor, getTypeBadgeColor } from "@/utils/badge";
import Image from "next/image";
import { JSX } from "react";

type BerryTableProps = {
  offset: number;
  berries: BerryResponse;
};

type NaturalGiftBadgeProps = {
  power: number;
  typeName: string;
};

type FlavorEntry = {
  flavor: { name: string; url: string };
  potency: number;
};

type FlavorBadgesProps = {
  flavors: FlavorEntry[];
};

function NaturalGiftBadge({ power, typeName }: NaturalGiftBadgeProps): JSX.Element {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-bold text-gray-50 dark:text-white whitespace-nowrap">
        {power} PWR
      </span>
      <span className={`${getBadgeBaseClass()} ${getTypeBadgeColor(typeName)}`}>
        {capitalize(typeName)}
      </span>
    </div>
  );
}

function FlavorBadges({ flavors }: FlavorBadgesProps): JSX.Element {
  const active = flavors.filter((entry) => entry.potency > 0);

  if (active.length === 0) {
    return <span className="text-gray-400 italic">None</span>;
  }

  return (
    <div className="flex flex-wrap gap-1 justify-center max-w-56 mx-auto">
      {active.map((entry) => (
        <span
          key={entry.flavor.name}
          title={`Potency: ${entry.potency}`}
          className={`${getBadgeBaseClass()} ${getFlavorBadgeColor(entry.flavor.name)}`}
        >
          {capitalize(entry.flavor.name)} {entry.potency}
        </span>
      ))}
    </div>
  );
}

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
            <th scope="col" className="px-6 py-3">
              Firmness
            </th>
            <th scope="col" className="px-6 py-3">
              Size (mm)
            </th>
            <th scope="col" className="px-6 py-3">
              Smoothness
            </th>
            <th scope="col" className="px-6 py-3">
              Soil Dryness
            </th>
            <th scope="col" className="px-6 py-3">
              Growth Time
            </th>
            <th scope="col" className="px-6 py-3">
              Max Harvest
            </th>
            <th scope="col" className="px-6 py-3">
              Natural Gift
            </th>
            <th scope="col" className="px-6 py-3">
              Flavors
            </th>
            <th scope="col" className="px-6 py-3">
              Cost ($)
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
              {/* NEW CELLS START HERE */}
              <td className="px-6 py-4 whitespace-nowrap">
                {capitalize(berry.detail?.firmness.name as string)}
              </td>
              <td className="px-6 py-4">{berry.detail?.size}</td>
              <td className="px-6 py-4">{berry.detail?.smoothness}</td>
              <td className="px-6 py-4">{berry.detail?.soil_dryness}</td>
              <td
                className="px-6 py-4 whitespace-nowrap"
                title="Time for the tree to advance one of its 4 growth stages"
              >
                {berry.detail?.growth_time} hrs/stage
              </td>
              <td className="px-6 py-4">{berry.detail?.max_harvest}</td>
              <td className="px-6 py-4">
                <NaturalGiftBadge
                  power={berry.detail?.natural_gift_power as number}
                  typeName={berry.detail?.natural_gift_type.name as string}
                />
              </td>
              <td className="px-6 py-4">
                <FlavorBadges flavors={berry.detail?.flavors ?? []} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                ${(berry.detail?.item.detail?.cost ?? 0).toLocaleString("en-US")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}