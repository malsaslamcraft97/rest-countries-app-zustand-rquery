import styles from "./CountryCard.module.scss";
import type { Country } from "../../../api/countriesApi";
import { useToggleFavorite } from "../../../hooks/useToggleFavorite";
import { useAppStore } from "../../../store/useAppStore";

type Props = {
  country: Country;
};

export function CountryCard({ country }: Props) {
  const { mutate } = useToggleFavorite();
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const isFav = useAppStore((s) => s.favorites[country.name.common]);

  return (
    <div className={styles.card}>
      <img
        className={styles.flag}
        src={country.flags.png}
        alt={country.name.common}
      />

      <div className={styles.content}>
        <button
          onClick={() => {
            toggleFavorite(country.name.common); // optimistic UI
            mutate(country.name.common); // async sync
          }}
        >
          {isFav ? "★" : "☆"}
        </button>

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
