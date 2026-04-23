import { CountryCard } from "../CountryCard/CountryCard";
import { useCountries } from "../../../hooks/useCountries";
import styles from "./CountryGrid.module.scss";
import { CountryCardSkeleton } from "../CountryCard/CountryCardSkeleton";

export function CountryGrid() {
  const { data, isLoading, isError, fetchNextPage, hasNextPage } =
    useCountries();

  if (isLoading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <CountryCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) return <p>Error</p>;

  const countries = data?.pages.flat() ?? [];

  if (!countries.length) {
    return <p>No countries found</p>;
  }

  return (
    <>
      <div className={styles.grid}>
        {countries.map((country) => (
          <CountryCard key={country.name.common} country={country} />
        ))}
      </div>

      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>Load More</button>
      )}
    </>
  );
}
