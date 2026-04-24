# Contract Testing vs Implementation Testing

## The Core Distinction

**Implementation testing** asks: _how does the code do it?_ It verifies internal details — which functions were called, in what order, with what arguments.

**Contract testing** asks: _what does the code promise?_ It verifies the public interface — given these inputs, what outputs and behaviors can callers depend on?

Contract tests survive refactors. Implementation tests break on them.

---

## In This Repo — What some of the files are

### `countriesApi.test.ts` — Pure Contract Testing ✅

```ts
expect(country).toMatchObject({
  name: { common: expect.any(String) },
  population: expect.any(Number),
  region: expect.any(String),
  flags: { png: expect.any(String) },
});
```

This test defines the **data contract** that every consumer of `fetchCountries` depends on. It does not care whether the function uses `fetch`, `axios`, or how it parses the response — only that the output shape is correct. Swap the HTTP client entirely and this test still passes.

The error test also contracts behavior:

```ts
await expect(fetchCountries()).rejects.toThrow();
```

It says: _when both APIs fail, callers can depend on a rejected promise._ Not _"the catch block ran"_ or _"console.error was called"_ — just the observable contract.

---

### `useCountries.test.ts` — Mixed: Contract + Implementation ⚠️

The filter and pagination tests are good contracts:

```ts
expect(data.pages[0]).toHaveLength(1);
expect(data.pages[0][0].name.common).toBe("India");
```

These verify what `useCountries` promises to its consumers — a paginated, filtered data shape.

But the mock setup crosses into implementation territory:

```ts
vi.mock("../api/countriesApi", () => ({
  fetchCountries: vi.fn(),
}));

vi.mock("../store/useAppStore", () => ({
  useAppStore: (selector: any) => selector(storeState),
}));
```

Mocking `fetchCountries` at the module level means the hook's actual integration with React Query — caching, retries, `staleTime`, `queryKey` — is never exercised. You're testing the filtering logic inside the hook, not the hook's contract as a whole. This is a valid scope decision, but it means you need `Home.test.tsx` to cover the gaps.

The `fetchCountries` mock also drifts silently if the real function's return shape changes — there is no `satisfies` type guard enforcing alignment.

---

### `RegionFilter.test.ts` — Implementation Testing ⚠️

```ts
vi.mock("../../../store/useAppStore", () => ({
  useAppStore: (selector: any) => selector(storeState),
}));

expect(setRegion).toHaveBeenCalledWith("Europe");
```

This tests that `setRegion` was called — an implementation detail. It does not test that the region filter actually filters countries. If the component was refactored to call `applyFilter("region", "Europe")` instead, this test breaks even though behavior is identical.

The contract this component has with its consumers is: _when a region is selected, the grid updates to show only countries from that region._ That contract is not verified here.

The accessible label test is a contract test:

```ts
expect(
  screen.getByLabelText(/filter countries by region/i),
).toBeInTheDocument();
```

It verifies a public interface (the a11y label) — not an internal mechanism.

---

### `SearchInput.test.ts` — Same pattern as RegionFilter ⚠️

```ts
expect(setSearch).toHaveBeenCalled();
```

Verifies the call, not the behavior. `"calls setSearch on typing"` is an implementation test named as if it were a contract. The contract would be: _when the user types, the search results update._

---

### `CountryCard.test.tsx` — Contract Testing ✅

```ts
await userEvent.click(button);
expect(useAppStore.getState().favorites["India"]).toBe(true);
```

This is a contract assertion — it verifies the observable state change a consumer of the store can depend on, not which internal function triggered it.

```ts
expect(button).toHaveAttribute("aria-pressed", "true");
```

Also a contract — the accessibility interface is a public promise to screen readers and testing tools.

---

### `Home.test.tsx` — Contract Testing ✅

Every assertion is on visible output:

```ts
expect(screen.getByText("Country 0")).toBeInTheDocument();
expect(screen.queryByText("Country 1")).not.toBeInTheDocument();
```

No internal functions verified. This is the layer that compensates for the implementation tests in `SearchInput` and `RegionFilter` — it proves the actual contract those components are part of.

---

### `Home.cy.ts` — Contract Testing ✅

```ts
cy.contains("Country 1").should("be.visible");
cy.contains("Country 0").should("not.exist");
```

Pure behavioral contracts verified through a real browser. No internal state inspected.

---

## What New Tests Would Strengthen Contracts

### 1. `RegionFilter` and `SearchInput` — replace mock assertions with state assertions

```ts
// Current — implementation test
expect(setRegion).toHaveBeenCalledWith("Europe");

// Better — contract test (drop the vi.mock, use real store)
import { useAppStore } from "../../../store/useAppStore";

beforeEach(() => {
  useAppStore.setState({ region: "", search: "" });
});

it("updates region in store on change", async () => {
  render(<RegionFilter />);
  await userEvent.selectOptions(screen.getByRole("combobox"), "Europe");
  expect(useAppStore.getState().region).toBe("Europe");
});
```

This uses the real store (no mock), asserts the state contract, and survives any internal refactor.

---

### 2. `useCountries` — add a shape contract test via MSW

```ts
// Add alongside existing tests — uses real fetchCountries via MSW
it("exposes paginated country shape to consumers", async () => {
  const { result } = renderHook(() => useCountries(), {
    wrapper: createWrapper(),
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  const firstPage = result.current.data!.pages[0];
  expect(firstPage[0]).toMatchObject({
    name: { common: expect.any(String) },
    region: expect.any(String),
  });
});
```

This tests the hook's output contract without mocking `fetchCountries`, catching mismatches between the API shape and what the hook exposes.

---

### 3. `countriesApi` — add a field-level contract for the fallback shape

The primary and fallback APIs may return different raw shapes. A contract test should verify both normalize to the same output:

```ts
it("normalizes fallback API shape to match primary contract", async () => {
  server.use(
    http.get(
      "https://restcountries.com/v3.1/all",
      () => new HttpResponse(null, { status: 500 }),
    ),
  );

  const data = await fetchCountries();

  expect(data[0]).toMatchObject({
    name: { common: expect.any(String) },
    population: expect.any(Number),
    region: expect.any(String),
    flags: { png: expect.any(String) },
  });
});
```

Currently the error tests confirm the fallback path exists — this confirms the fallback output honors the same contract as the primary.

---

## Summary

| File                   | Style             | Gap                                                   |
| ---------------------- | ----------------- | ----------------------------------------------------- |
| `countriesApi.test.ts` | Contract ✅       | Add fallback normalization contract                   |
| `CountryCard.test.tsx` | Contract ✅       | None                                                  |
| `Home.test.tsx`        | Contract ✅       | None — compensates for lower-layer gaps               |
| `Home.cy.ts`           | Contract ✅       | None                                                  |
| `useCountries.test.ts` | Mixed ⚠️          | Add MSW-based shape contract; type-guard the mock     |
| `RegionFilter.test.ts` | Implementation ⚠️ | Replace mock call assertion with real store assertion |
| `SearchInput.test.ts`  | Implementation ⚠️ | Replace mock call assertion with real store assertion |

---

## The Rule

> A contract test answers: _"can callers rely on this?"_
> An implementation test answers: _"did it do it this way?"_
>
> Name your tests in terms of the contract. If the test name contains a function name (`calls setRegion`, `calls fetchNextPage`), it is probably an implementation test. If it describes user-visible or consumer-visible behavior (`filters countries by region`, `exposes paginated data`), it is a contract test.
