import { useAppStore } from "../../../store/useAppStore";
import styles from "./RegionFilter.module.scss";

export function RegionFilter() {
  const region = useAppStore((s) => s.region);
  const setRegion = useAppStore((s) => s.setRegion);

  return (
    <div className={styles.wrapper}>
      <label htmlFor="region" className={styles.srOnly}>
        Filter countries by region
      </label>

      <select
        id="region"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        className={styles.select}
      >
        <option value="">Filter by Region</option>
        <option value="Africa">Africa</option>
        <option value="Americas">Americas</option>
        <option value="Asia">Asia</option>
        <option value="Europe">Europe</option>
        <option value="Oceania">Oceania</option>
      </select>
    </div>
  );
}
