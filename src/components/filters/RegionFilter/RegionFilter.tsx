import styles from "./RegionFilter.module.scss";

export function RegionFilter() {
  return (
    <select className={styles.select}>
      <option>Filter by Region</option>
      <option>Africa</option>
      <option>Americas</option>
      <option>Asia</option>
      <option>Europe</option>
      <option>Oceania</option>
    </select>
  );
}
