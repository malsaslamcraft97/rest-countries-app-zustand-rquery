import { useAppStore } from "../../../store/useAppStore";
import styles from "./SearchInput.module.scss";

export function SearchInput() {
  const search = useAppStore((s) => s.search);
  const setSearch = useAppStore((s) => s.setSearch);

  return (
    <div className={styles.wrapper}>
      <span className={styles.icon}>🔍</span>

      <input
        type="text"
        placeholder="Search for a country..."
        className={styles.input}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
