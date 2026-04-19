import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type AppState = {
  theme: "dark" | "light";
  search: string;
  debouncedSearch: string;
  region: string;

  toggleTheme: () => void;
  setSearch: (value: string) => void;
  setRegion: (value: string) => void;
};

let debounceTimer: ReturnType<typeof setTimeout>;

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        theme: "dark",
        search: "",
        debouncedSearch: "",
        region: "",

        toggleTheme: () =>
          set((state) => ({
            theme: state.theme === "dark" ? "light" : "dark",
          })),

        setSearch: (value) => {
          set({ search: value });

          clearTimeout(debounceTimer);

          debounceTimer = setTimeout(() => {
            set({ debouncedSearch: value });
          }, 400);
        },
        setRegion: (value) => set({ region: value }),
      }),
      {
        name: "app-storage",
      },
    ),
  ),
);
