import { Skeleton } from "../ui/skeleton";

export default function PokemonTableSkeleton() {
  return (
    <div className="relative overflow-x-auto shadow-md rounded-lg">
      <table className="w-full text-xs sm:text-sm text-center rtl:text-right text-gray-50 dark:text-white">
        <thead className="text-xs sm:text-sm uppercase bg-soft-black dark:bg-table-header text-gray-50 dark:text-white">
          <tr>
            <th scope="col" className="px-6 py-3">
              <Skeleton className="h-4 w-12 mx-auto bg-slate-300" />
            </th>
            <th scope="col" className="px-6 py-3">
              <Skeleton className="h-4 w-12 mx-auto bg-slate-300" />
            </th>
            <th scope="col" className="px-6 py-3">
              <Skeleton className="h-4 w-12 mx-auto bg-slate-300" />
            </th>
            <th scope="col" className="px-6 py-3">
              <Skeleton className="h-4 w-12 mx-auto bg-slate-300" />
            </th>
            <th scope="col" className="px-6 py-3">
              <Skeleton className="h-4 w-12 mx-auto bg-slate-300" />
            </th>
            <th scope="col" className="px-6 py-3">
              <Skeleton className="h-4 w-12 mx-auto bg-slate-300" />
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 20 }).map((_, i) => (
            <tr key={i} className="bg-soft-black dark:bg-soft-dark">
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-6 mx-auto bg-slate-300" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-20 mx-auto bg-slate-300" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="w-16 h-16 sm:w-24 sm:h-24 mx-auto rounded-full bg-slate-300" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-24 mx-auto bg-slate-300" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-24 mx-auto bg-slate-300" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-6 w-28 mx-auto rounded bg-slate-300" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
