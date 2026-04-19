import { Header } from "../../components/layout/Header/Header";
import { SearchInput } from "../../components/filters/SearchInput/SearchInput";
import { RegionFilter } from "../../components/filters/RegionFilter/RegionFilter";
import { CountryGrid } from "../../components/countries/CountryGrid/CountryGrid";
import styles from "./Home.module.scss";

export function Home() {
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
