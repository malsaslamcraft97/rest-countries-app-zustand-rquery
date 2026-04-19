import { CountryCard } from "../CountryCard/CountryCard";
import styles from "./CountryGrid.module.scss";

export function CountryGrid() {
  return (
    <div className={styles.grid}>
      {Array.from({ length: 12 }).map((_, i) => (
        <CountryCard key={i} />
      ))}
    </div>
  );
}
