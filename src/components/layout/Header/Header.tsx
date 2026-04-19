import { useAppStore } from "../../../store/useAppStore";
import styles from "./Header.module.scss";

export function Header() {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.title}>Where in the world?</h1>

        <button onClick={toggleTheme} className={styles.themeToggle}>
          🌙 {theme === "dark" ? "Dark Mode" : "Light Mode"}
        </button>
      </div>
    </header>
  );
}
