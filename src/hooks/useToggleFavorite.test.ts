import { renderHook, act, waitFor } from "@testing-library/react";
import { useToggleFavorite } from "./useToggleFavorite";
import { createWrapper } from "../test-utils";

describe("useToggleFavorite", () => {
  it("runs mutation successfully", async () => {
    const { result } = renderHook(() => useToggleFavorite(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync("India");
    });

    expect(result.current.isSuccess).toBe(true);
  });

  it("transitions to success after mutation", async () => {
    const { result } = renderHook(() => useToggleFavorite(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate("India");
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
