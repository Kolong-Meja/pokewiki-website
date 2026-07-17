import { memo, useMemo, type MouseEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

type PaginationProps = {
  total: number;
  offset: number;
  limit: number;
  siblingCount?: number;
};

const DOTS = "dots" as const;
type PageItem = number | typeof DOTS;
function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number,
): PageItem[] {
  const totalVisible = siblingCount * 2 + 5;

  if (totalPages <= totalVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < totalPages - 1;

  if (!showLeftDots && showRightDots) {
    const leftCount = 3 + siblingCount * 2;
    return [
      ...Array.from({ length: leftCount }, (_, i) => i + 1),
      DOTS,
      totalPages,
    ];
  }

  if (showLeftDots && !showRightDots) {
    const rightCount = 3 + siblingCount * 2;
    const start = totalPages - rightCount + 1;
    return [
      1,
      DOTS,
      ...Array.from({ length: rightCount }, (_, i) => start + i),
    ];
  }

  const middleCount = rightSibling - leftSibling + 1;
  return [
    1,
    DOTS,
    ...Array.from({ length: middleCount }, (_, i) => leftSibling + i),
    DOTS,
    totalPages,
  ];
}

const buttonBase =
  "flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors duration-300 ease-in-out motion-reduce:transition-none";

const buttonIdle =
  "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white dark:border dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

const buttonActive =
  "bg-yellow-400 text-black shadow-sm cursor-default select-none";

const buttonDisabled =
  "bg-zinc-800/40 text-zinc-600 dark:text-zinc-700 cursor-not-allowed select-none";

function SimplePagination({
  total,
  offset,
  limit,
  siblingCount = 1,
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const safeLimit = Math.max(1, limit);
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));
  const currentPage = Math.min(
    Math.max(Math.floor(offset / safeLimit) + 1, 1),
    totalPages,
  );

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  const pageOffset = (page: number) => (page - 1) * safeLimit;
  const effectiveOffset = pageOffset(currentPage);
  const start = total === 0 ? 0 : effectiveOffset + 1;
  const end = Math.min(effectiveOffset + safeLimit, total);

  const createPageURL = (newOffset: number): string => {
    const params = new URLSearchParams(searchParams);
    params.set("offset", newOffset.toString());
    params.set("limit", limit.toString());
    return `${pathname}?${params.toString()}`;
  };

  const goToPage = (event: MouseEvent<HTMLAnchorElement>, page: number) => {
    event.preventDefault();
    replace(createPageURL(pageOffset(page)), { scroll: false });
  };

  const paginationRange = useMemo(
    () => getPaginationRange(currentPage, totalPages, siblingCount),
    [currentPage, totalPages, siblingCount],
  );

  return (
    <div className="flex flex-col items-center gap-3 py-2">
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

      <nav
        aria-label="Pagination"
        className="flex flex-wrap items-center justify-center gap-1.5"
      >
        {isFirstPage ? (
          <span
            aria-disabled="true"
            aria-label="Previous page"
            className={cn(buttonBase, buttonDisabled)}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </span>
        ) : (
          <a
            href={createPageURL(pageOffset(currentPage - 1))}
            onClick={(event) => goToPage(event, currentPage - 1)}
            aria-label="Previous page"
            className={cn(buttonBase, buttonIdle)}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </a>
        )}

        {paginationRange.map((page, index) =>
          page === DOTS ? (
            <span
              key={`dots-${index}`}
              aria-hidden="true"
              className={cn(buttonBase, "text-zinc-500 dark:text-zinc-600")}
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          ) : page === currentPage ? (
            <span
              key={page}
              aria-current="page"
              className={cn(buttonBase, buttonActive)}
            >
              {page}
            </span>
          ) : (
            <a
              key={page}
              href={createPageURL(pageOffset(page))}
              onClick={(event) => goToPage(event, page)}
              className={cn(buttonBase, buttonIdle)}
            >
              {page}
            </a>
          ),
        )}

        {isLastPage ? (
          <span
            aria-disabled="true"
            aria-label="Next page"
            className={cn(buttonBase, buttonDisabled)}
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </span>
        ) : (
          <a
            href={createPageURL(pageOffset(currentPage + 1))}
            onClick={(event) => goToPage(event, currentPage + 1)}
            aria-label="Next page"
            className={cn(buttonBase, buttonIdle)}
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </a>
        )}
      </nav>
    </div>
  );
}

export default memo(SimplePagination);
