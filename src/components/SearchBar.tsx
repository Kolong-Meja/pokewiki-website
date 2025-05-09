import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

type SearchProps = {
  placeholder: string;
};

export default function SearchBar({ placeholder }: SearchProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (!term) {
      params.delete("q");
    } else {
      params.set("q", term);

      // DELETE OTHERS PARAMS
      params.delete("offset");
      params.delete("limit");
      params.delete("sort");
    }

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300);

  return (
    <div className="w-52 max-w-sm sm:w-81 sm:max-w-lg md:w-full md:max-w-xl relative">
      <Search
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 dark:text-zinc-500 w-5 h-5
      "
      />
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("q")?.toString() ?? ""}
        className="pl-10 pr-4 py-2 sm:pl-12 sm:py-3 w-full rounded-full text-sm sm:text-base border border-zinc-700 dark:border-zinc-700 bg-soft-dark dark:bg-zinc-900 text-gray-50 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 shadow-sm"
        name="search"
        id="search"
      />
    </div>
  );
}
