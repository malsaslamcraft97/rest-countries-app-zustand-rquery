import styles from "./CountryCard.module.scss";

export function CountryCard() {
  return (
    <div className={styles.card}>
      <div className={styles.flag} />

      <div className={styles.content}>
        <h3 className={styles.title}>Germany</h3>

        <p>
          <strong>Population:</strong> 81,770,900
        </p>
        <p>
          <strong>Region:</strong> Europe
        </p>
        <p>
          <strong>Capital:</strong> Berlin
        </p>
      </div>
    </div>
  );
}
