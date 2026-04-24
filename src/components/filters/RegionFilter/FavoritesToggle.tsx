import { useAppStore } from "../../../store/useAppStore";

export function FavoritesToggle() {
  const showFavoritesOnly = useAppStore((s) => s.showFavoritesOnly);
  const toggleShowFavorites = useAppStore((s) => s.toggleShowFavorites);

  return (
    <button onClick={toggleShowFavorites} aria-pressed={showFavoritesOnly}>
      {showFavoritesOnly ? "Showing Favorites" : "Show Favorites Only"}
    </button>
  );
}
