import { usePathname, useRouter, useSearchParams } from "next/navigation";

type PaginationProps = {
  total: number;
  offset: number;
  limit: number;
};

export default function SimplePagination({
  total,
  offset,
  limit,
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const start = offset + 1;
  const end = total > 1 ? offset + limit : 1;

  const createPageURL = (newOffset: number | string): string => {
    const params = new URLSearchParams(searchParams);
    params.set("offset", newOffset.toString());
    params.set("limit", limit.toString());

    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex flex-col items-center">
      <span className="text-sm text-gray-400 dark:text-gray-300">
        Showing{" "}
        <span className="font-semibold text-gray-50 dark:text-white">
          {start}
        </span>{" "}
        to{" "}
        <span className="font-semibold text-gray-50 dark:text-white">
          {end}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-50 dark:text-white">
          {total}
        </span>{" "}
        Entries
      </span>
      <div
        className="inline-flex mt-2 xs:mt-0 space-x-2
      "
      >
        <a
          href={createPageURL(offset - limit)}
          onClick={(event) => {
            event.preventDefault();
            replace(createPageURL(offset - limit), { scroll: false });
          }}
          className={`flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-zinc-800 rounded-lg hover:bg-zinc-900 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white transition-colors duration-300 ease-in-out ${
            offset <= 0 && "opacity-50 pointer-events-none"
          }`}
        >
          <svg
            className="w-3.5 h-3.5 me-2 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 5H1m0 0 4 4M1 5l4-4"
            />
          </svg>
          Prev
        </a>
        <a
          href={createPageURL(offset + limit)}
          onClick={(event) => {
            event.preventDefault();
            replace(createPageURL(offset + limit), { scroll: false });
          }}
          className={`flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-zinc-800 rounded-lg hover:bg-zinc-900 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white transition-colors duration-300 ease-in-out ${
            offset + limit >= total && "opacity-50 pointer-events-none"
          }`}
        >
          Next
          <svg
            className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
