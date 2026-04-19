import { useCountries } from "../../../hooks/useCountries";
import { CountryCard } from "../CountryCard/CountryCard";
import styles from "./CountryGrid.module.scss";

export function CountryGrid() {
  const { data, isLoading, isError } = useCountries();

  if (isLoading) {
    return <p>Loading countries...</p>;
  }

  if (isError) {
    return <p>Something went wrong</p>;
  }

  return (
    <div className={styles.grid}>
      {data?.map((country) => (
        <CountryCard key={country.name.common} country={country} />
      ))}
    </div>
  );
}
