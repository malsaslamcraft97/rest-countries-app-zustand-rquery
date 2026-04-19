import { CountryCard } from "../CountryCard/CountryCard";
import { useCountries } from "../../../hooks/useCountries";
import styles from "./CountryGrid.module.scss";

export function CountryGrid() {
  const { data, isLoading, isError, fetchNextPage, hasNextPage } =
    useCountries();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error</p>;

  const countries = data?.pages.flat() ?? [];

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
