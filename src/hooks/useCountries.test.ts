import { renderHook, waitFor } from "@testing-library/react";
import { useCountries } from "./useCountries";
import { createWrapper } from "../test-utils";
import { useAppStore } from "../store/useAppStore";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";

describe("useCountries", () => {
  beforeEach(() => {
    useAppStore.setState({ debouncedSearch: "", region: "" });
  });

  it("fetches and paginates countries", async () => {
    // MSW default handler returns 20 countries — PAGE_SIZE = 5 → 4 pages
    const { result } = renderHook(() => useCountries(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data!.pages.length).toBeGreaterThan(1);
  });

  it("filters by search", async () => {
    useAppStore.setState({ debouncedSearch: "country 1", region: "" });

    const { result } = renderHook(() => useCountries(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // "country 1" matches "Country 1", "Country 10", "Country 11" ... etc.
    // All results should contain "1" in the name
    const allCountries = result.current.data!.pages.flat();
    expect(allCountries.length).toBeGreaterThan(0);
    allCountries.forEach((c) => {
      expect(c.name.common.toLowerCase()).toContain("1");
    });
  });

  it("filters by region", async () => {
    useAppStore.setState({ debouncedSearch: "", region: "Asia" });

    const { result } = renderHook(() => useCountries(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const allCountries = result.current.data!.pages.flat();
    expect(allCountries.length).toBeGreaterThan(0);
    allCountries.forEach((c) => {
      expect(c.region).toBe("Asia");
    });
  });

  it("returns empty result when search matches nothing", async () => {
    useAppStore.setState({ debouncedSearch: "zzzz", region: "" });

    const { result } = renderHook(() => useCountries(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data!.pages.flat()).toHaveLength(0);
  });

  it("returns empty result when region matches nothing", async () => {
    useAppStore.setState({ debouncedSearch: "", region: "Antarctica" });

    const { result } = renderHook(() => useCountries(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data!.pages.flat()).toHaveLength(0);
  });

  it("throws when both APIs fail", async () => {
    server.use(
      http.get(
        "https://restcountries.com/v3.1/all",
        () => new HttpResponse(null, { status: 500 }),
      ),
      http.get(
        "https://raw.githubusercontent.com/mledoze/countries/master/countries.json",
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useCountries(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
