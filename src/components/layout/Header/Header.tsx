import { useAppStore } from "../../../store/useAppStore";
import styles from "./Header.module.scss";

export function Header() {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);

  const isDark = theme === "dark";

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.title}>Where in the world?</h1>

        <button
          aria-pressed={isDark}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          onClick={toggleTheme}
          className={styles.themeToggle}
        >
          🌙 {isDark ? "Dark Mode" : "Light Mode"}
        </button>
      </div>
    </header>
  );
}
