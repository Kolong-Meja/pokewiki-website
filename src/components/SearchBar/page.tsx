import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

type SearchProps = {
  placeholder: string;
};

export default function SearchBar({ placeholder }: SearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (!term) {
      params.delete("q");
    } else {
      params.set("q", term);
      params.delete("offset");
      params.delete("limit");
    }

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 500);

  return (
    <div className="mx-auto w-full max-w-xl">
      <input
        type="text"
        placeholder={placeholder}
        onChange={(element) => {
          handleSearch(element.target.value);
        }}
        defaultValue={searchParams.get("q")?.toString()}
        className="rounded-full relative block w-full text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3 border-2 border-zinc-900 dark:border-zinc-800 placeholder-gray-400 text-gray-50 dark:text-white focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 focus:z-10"
        name="search"
        id="search"
      />
    </div>
  );
}
