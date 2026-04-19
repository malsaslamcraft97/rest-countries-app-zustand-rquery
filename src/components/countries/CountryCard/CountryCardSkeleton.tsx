import styles from "./CountryCardSkeleton.module.scss";

export function CountryCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.flag} />
      <div className={styles.content}>
        <div className={styles.title} />
        <div className={styles.line} />
        <div className={styles.line} />
        <div className={styles.line} />
      </div>
    </div>
  );
}
