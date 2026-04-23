import { renderHook, waitFor } from "@testing-library/react";
import { useCountries } from "./useCountries";
import { fetchCountries } from "../api/countriesApi";
import { createWrapper } from "../test-utils";
import { vi } from "vitest";

// ---- mocks ----
let storeState: any;

vi.mock("../store/useAppStore", () => ({
  useAppStore: (selector: any) => selector(storeState),
}));

vi.mock("../api/countriesApi", () => ({
  fetchCountries: vi.fn(),
}));

// ---- tests ----
describe("useCountries", () => {
  beforeEach(() => {
    storeState = {
      debouncedSearch: "",
      region: "",
    };
    vi.clearAllMocks();
  });

  it("fetches and paginates countries", async () => {
    (fetchCountries as any).mockResolvedValue(
      Array.from({ length: 10 }).map((_, i) => ({
        name: { common: `Country ${i}` },
        region: "Asia",
      })),
    );

    const { result } = renderHook(() => useCountries(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const data = result.current.data!;

    // PAGE_SIZE = 5 → should split into pages
    expect(data.pages.length).toBeGreaterThan(1);
  });

  it("filters by search", async () => {
    storeState.debouncedSearch = "ind";

    (fetchCountries as any).mockResolvedValue([
      { name: { common: "India" }, region: "Asia" },
      { name: { common: "Germany" }, region: "Europe" },
    ]);

    const { result } = renderHook(() => useCountries(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const data = result.current.data!;

    expect(data.pages[0]).toHaveLength(1);
    expect(data.pages[0][0].name.common).toBe("India");
  });

  it("filters by region", async () => {
    storeState.region = "Asia";

    (fetchCountries as any).mockResolvedValue([
      { name: { common: "India" }, region: "Asia" },
      { name: { common: "Germany" }, region: "Europe" },
    ]);

    const { result } = renderHook(() => useCountries(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const data = result.current.data!;

    expect(data.pages[0]).toHaveLength(1);
    expect(data.pages[0][0].region).toBe("Asia");
  });
});
