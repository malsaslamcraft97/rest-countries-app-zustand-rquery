import styles from "./SearchInput.module.scss";

export function SearchInput() {
  return (
    <div className={styles.wrapper}>
      <span className={styles.icon}>🔍</span>

      <input
        type="text"
        placeholder="Search for a country..."
        className={styles.input}
      />
    </div>
  );
}
