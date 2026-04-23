import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchCountries } from "../api/countriesApi";
import { useAppStore } from "../store/useAppStore";

const PAGE_SIZE = 5;

export function useCountries() {
  const search = useAppStore((s) => s.debouncedSearch);
  const region = useAppStore((s) => s.region);

  return useInfiniteQuery({
    queryKey: ["countries"],

    queryFn: async () => {
      return fetchCountries();
    },

    retry: import.meta.env.MODE === "test" ? false : 2,

    initialPageParam: 0, // required in v5

    getNextPageParam: (_lastPage, pages) => {
      const nextPage = pages.length;
      return nextPage * PAGE_SIZE < 250 ? nextPage : undefined;
    },

    staleTime: 1000 * 60 * 5,

    select: (data) => {
      const allCountries = data.pages.flat();

      const filtered = allCountries.filter((country) => {
        const matchesSearch = country.name.common
          .toLowerCase()
          .includes(search.toLowerCase());

        const matchesRegion = region ? country.region === region : true;

        return matchesSearch && matchesRegion;
      });

      // re-chunk into pages
      const paginated: typeof data.pages = [];

      for (let i = 0; i < filtered.length; i += PAGE_SIZE) {
        paginated.push(filtered.slice(i, i + PAGE_SIZE));
      }

      return {
        ...data,
        pages: paginated,
      };
    },
  });
}
