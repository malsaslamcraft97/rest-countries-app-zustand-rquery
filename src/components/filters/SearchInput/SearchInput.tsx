import { useAppStore } from "../../../store/useAppStore";
import styles from "./SearchInput.module.scss";

export function SearchInput() {
  const search = useAppStore((s) => s.search);
  const setSearch = useAppStore((s) => s.setSearch);

  return (
    <div className={styles.wrapper}>
      <label htmlFor="search" className={styles.srOnly}>
        Search for a country
      </label>

      <span className={styles.icon} aria-hidden="true">
        🔍
      </span>

      <input
        id="search"
        type="text"
        placeholder="Search for a country..."
        className={styles.input}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
