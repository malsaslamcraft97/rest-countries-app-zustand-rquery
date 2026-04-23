import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";
import { vi } from "vitest";

describe("useDebounce", () => {
  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("India", 300));

    expect(result.current).toBe("India");
  });

  it("updates value after delay", () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "Ind" } },
    );

    rerender({ value: "India" });

    expect(result.current).toBe("Ind");

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("India");

    vi.useRealTimers();
  });

  it("clears previous timer on rapid changes", () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "I" } },
    );

    rerender({ value: "In" });
    rerender({ value: "Ind" });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("Ind");

    vi.useRealTimers();
  });
});
