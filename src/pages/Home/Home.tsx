import { Header } from "../../components/layout/Header/Header";
import { SearchInput } from "../../components/filters/SearchInput/SearchInput";
import { RegionFilter } from "../../components/filters/RegionFilter/RegionFilter";
import { CountryGrid } from "../../components/countries/CountryGrid/CountryGrid";
import styles from "./Home.module.scss";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchCountries } from "../../api/countriesApi";

export function Home() {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["countries"],
      queryFn: fetchCountries,
    });
  }, [queryClient]);

  return (
    <div>
      <Header />

      <main className={styles.container}>
        <div className={styles.filters}>
          <SearchInput />
          <RegionFilter />
        </div>

        <CountryGrid />
      </main>
    </div>
  );
}
