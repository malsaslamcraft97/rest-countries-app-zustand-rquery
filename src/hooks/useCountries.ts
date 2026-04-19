import { useQuery } from "@tanstack/react-query";
import { fetchCountries } from "../api/countriesApi";
import { useAppStore } from "../store/useAppStore";

export function useCountries() {
  const search = useAppStore((s) => s.search);
  const region = useAppStore((s) => s.region);

  return useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
    staleTime: 1000 * 60 * 5, // 5 mins cache time
    select: (data) => {
      return data.filter((country) => {
        const matchesSearch = country.name.common
          .toLowerCase()
          .includes(search.toLowerCase());

        const matchesRegion = region ? country.region === region : true;

        return matchesSearch && matchesRegion;
      });
    },
  });
}
