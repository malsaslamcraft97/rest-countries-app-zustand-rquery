import styles from "./SearchInput.module.scss";

export function SearchInput() {
  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        placeholder="Search for a country..."
        className={styles.input}
      />
    </div>
  );
}
