import styles from "./CountryCard.module.scss";
import type { Country } from "../../../api/countriesApi";

type Props = {
  country: Country;
};

export function CountryCard({ country }: Props) {
  return (
    <div className={styles.card}>
      <img
        className={styles.flag}
        src={country.flags.png}
        alt={country.name.common}
      />

      <div className={styles.content}>
        <h3 className={styles.title}>{country.name.common}</h3>

        <p>
          <strong>Population:</strong> {country.population.toLocaleString()}
        </p>

        <p>
          <strong>Region:</strong> {country.region}
        </p>

        <p>
          <strong>Capital:</strong> {country.capital?.[0] ?? "N/A"}
        </p>
      </div>
    </div>
  );
}
