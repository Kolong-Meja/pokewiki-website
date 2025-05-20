import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function SortButton() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const sortData = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    params.delete("q");

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const dropdownBtnRef = useRef<HTMLButtonElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent): void => {
      if (
        dropdownBtnRef.current &&
        dropdownMenuRef.current &&
        !dropdownBtnRef.current.contains(e.target as Node) &&
        !dropdownMenuRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative inline-block text-left">
      <button
        ref={dropdownBtnRef}
        onClick={toggleDropdown}
        className="inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 w-full text-xs sm:text-sm font-bold text-gray-50 dark:text-white bg-soft-dark border border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset focus:ring-offset-yellow-400 focus:ring-yellow-400"
      >
        Sort By
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 ml-2 -mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {dropdownOpen && (
        <div
          ref={dropdownMenuRef}
          className="origin-top-right absolute right-0 mt-2 w-44 rounded-md bg-soft-dark border border-zinc-700 z-20
          "
        >
          <div
            className="py-2 p-2"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="dropdown-button"
          >
            <a
              onClick={() => sortData("default")}
              className="flex rounded-md px-3 py-2 text-sm text-gray-50 dark:text-white hover:bg-zinc-800 active:bg-zinc-600 transition-colors duration-300 ease-in-out cursor-pointer"
              role="menuitem"
            >
              Sort by Default
            </a>
            <a
              onClick={() => sortData("asc")}
              className="flex rounded-md px-3 py-2 text-sm text-gray-50 dark:text-white hover:bg-zinc-800 active:bg-zinc-600 transition-colors duration-300 ease-in-out cursor-pointer"
              role="menuitem"
            >
              [ A-Z ] Sort by Name
            </a>
            <a
              onClick={() => sortData("desc")}
              className="flex rounded-md px-3 py-2 text-sm text-gray-50 dark:text-white hover:bg-zinc-800 active:bg-zinc-600 transition-colors duration-300 ease-in-out cursor-pointer"
              role="menuitem"
            >
              [ Z-A ] Sort by Name
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
