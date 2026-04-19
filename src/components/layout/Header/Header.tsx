import styles from "./Header.module.scss";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.title}>Where in the world?</h1>

        <button className={styles.themeToggle}>🌙 Dark Mode</button>
      </div>
    </header>
  );
}
