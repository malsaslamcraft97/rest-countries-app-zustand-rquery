import styles from "./CountryCard.module.scss";
import type { Country } from "../../../api/countriesApi";
import { useToggleFavorite } from "../../../hooks/useToggleFavorite";
import { useAppStore } from "../../../store/useAppStore";

type Props = {
  country: Country;
};

export function CountryCard({ country }: Props) {
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const isFav = useAppStore((s) => s.favorites[country.name.common]);

  return (
    <div className={styles.card}>
      <div className={styles.flagWrapper}>
        <img src={country.flags.png} alt={country.name.common} />

        <button
          data-active={isFav}
          className={styles.favorite}
          onClick={() => toggleFavorite(country.name.common)}
        >
          ★
        </button>
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>{country.name.common}</h2>

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
