import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type AppState = {
  theme: "dark" | "light";
  search: string;
  region: string;

  toggleTheme: () => void;
  setSearch: (value: string) => void;
  setRegion: (value: string) => void;
};

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        theme: "dark",
        search: "",
        region: "",

        toggleTheme: () =>
          set((state) => ({
            theme: state.theme === "dark" ? "light" : "dark",
          })),

        setSearch: (value) => set({ search: value }),
        setRegion: (value) => set({ region: value }),
      }),
      {
        name: "app-storage",
      },
    ),
  ),
);
