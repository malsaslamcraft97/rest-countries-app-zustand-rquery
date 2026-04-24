# Write Tests That Survive Refactoring

A test that breaks when you rename a function — but the app still works — is not a safety net. It is noise. Refactor-safe tests assert on contracts and behavior, not on how the code achieves them.

---

## What Makes a Test Brittle

A test breaks on refactor when it is coupled to:

- A specific function name or module path
- A specific internal call sequence
- A mock that mirrors the current implementation

None of these things are what the user experiences. When they change, the test breaks. When the app behavior is preserved, the test should not.

---

## In This Repo — Brittle vs Durable, Side by Side

### `RegionFilter` — brittle today, easy to fix

```ts
// ❌ Brittle — coupled to setRegion being called by name
expect(setRegion).toHaveBeenCalledWith("Europe");
```

If `setRegion` is renamed `applyRegionFilter`, or the component is refactored to call a combined `setFilters({ region: "Europe" })` action, this test breaks — even though the dropdown still filters countries correctly.

```ts
// ✅ Durable — coupled to observable store state
await userEvent.selectOptions(screen.getByRole("combobox"), "Europe");
expect(useAppStore.getState().region).toBe("Europe");
```

The store slice name `region` is the public contract. It can be arrived at any way the implementation chooses.

---

### `CountryCard` — durable today ✅

```ts
await userEvent.click(button);
expect(useAppStore.getState().favorites["India"]).toBe(true);
```

This survived any internal refactor to `CountryCard`'s click handler because it only cares about the store state — not which function set it. This is the pattern `RegionFilter` and `SearchInput` should follow.

---

### `useCountries` — partially brittle

```ts
vi.mock("../api/countriesApi", () => ({
  fetchCountries: vi.fn(),
}));

(fetchCountries as any).mockResolvedValue([...]);
```

If `useCountries` is refactored to call a new `fetchCountriesV2` function, or to inline the fetch logic, this mock stops intercepting and the test either silently passes with undefined data or fails for the wrong reason. The test is coupled to the module path `../api/countriesApi`, not to the hook's output contract.

The durable version uses MSW — the real `fetchCountries` runs, and the network boundary is controlled:

```ts
// ✅ Durable — hook internals can change freely
it("filters by search term", async () => {
  const { result } = renderHook(() => useCountries(), {
    wrapper: createWrapper(),
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  // assert on output shape — not on how it was fetched
  expect(result.current.data!.pages[0][0].name.common).toBe("Country 0");
});
```

---

### `Home.test.tsx` — fully durable ✅

```ts
renderWithProviders(<Home />);
await screen.findByText("Country 0");
await userEvent.click(screen.getByRole("button", { name: /add country 0 to favorites/i }));
await userEvent.click(screen.getByRole("button", { name: /show favorites only/i }));

expect(screen.getByText("Country 0")).toBeInTheDocument();
expect(screen.queryByText("Country 1")).not.toBeInTheDocument();
```

This test has survived every refactor in the repo so far: Zustand store restructure, component renames, filter logic rewrites. It will continue to because nothing inside the application is referenced by name — only user-facing text and ARIA roles.

---

## The Three Refactoring Scenarios

### Scenario 1: Rename a store action

`setRegion` → `applyRegionFilter`

| Test                                                   | Survives? | Why                       |
| ------------------------------------------------------ | --------- | ------------------------- |
| `expect(setRegion).toHaveBeenCalledWith("Europe")`     | ❌        | Coupled to function name  |
| `expect(useAppStore.getState().region).toBe("Europe")` | ✅        | Coupled to state contract |
| `Home.test.tsx` region filter test                     | ✅        | Coupled to visible output |

---

### Scenario 2: Replace React Query with SWR

| Test                                               | Survives? | Why                             |
| -------------------------------------------------- | --------- | ------------------------------- |
| `vi.mock("../api/countriesApi")` in `useCountries` | ❌        | Coupled to module internals     |
| `Home.test.tsx` with MSW                           | ✅        | Network boundary unchanged      |
| `countriesApi.test.ts`                             | ✅        | Tests the API function directly |

---

### Scenario 3: Replace Zustand with Context

| Test                                                | Survives? | Why                            |
| --------------------------------------------------- | --------- | ------------------------------ |
| `vi.mock("../store/useAppStore")` in `RegionFilter` | ❌        | Coupled to Zustand module path |
| `CountryCard` asserting `useAppStore.getState()`    | ❌        | Directly reads Zustand         |
| `Home.test.tsx` asserting visible UI                | ✅        | No store dependency            |

This is the honest tradeoff: `CountryCard` and `CountryGrid` tests use the real Zustand store, so a full state management migration would require updating those tests. But they would break for the right reason — the public store interface changed — not because of an internal rename.

---

## Rules for Writing Refactor-Safe Tests

**1. Assert on what the user sees, not on what the code calls**

ARIA roles, visible text, and DOM attributes are stable contracts. Function names are not.

```ts
// ❌ Coupled to internals
expect(toggleFavorite).toHaveBeenCalled();

// ✅ Coupled to user-visible state
expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
```

**2. Mock at the boundary, not in the middle**

MSW replaces the network. `setState` seeds the store. Neither couples to internal module paths.

```ts
// ❌ Coupled to module path — breaks if fetchCountries moves
vi.mock("../api/countriesApi");

// ✅ Coupled to network boundary — survives any internal restructure
server.use(http.get(/restcountries\.com/, () => HttpResponse.json(fixture)));
```

**3. Name tests after behavior, not after implementation**

If the test name would still make sense after a refactor, the test is probably safe.

```ts
// ❌ Implementation name — what if the action is renamed?
it("calls setRegion on change");

// ✅ Behavior name — survives any internal change
it("updates the active region when a new option is selected");
```

**4. Prefer `getState()` over mock call assertions for store interactions**

```ts
// ❌ Verifies the call happened
expect(setRegion).toHaveBeenCalledWith("Europe");

// ✅ Verifies the state changed
expect(useAppStore.getState().region).toBe("Europe");
```

**5. Use `queryByText` negative assertions to prove filters work**

A positive assertion alone (`expect(x).toBeInTheDocument()`) does not prove filtering happened. The negative assertion is what makes filter tests refactor-safe and meaningful:

```ts
expect(screen.getByText("Country 0")).toBeInTheDocument();
expect(screen.queryByText("Country 1")).not.toBeInTheDocument(); // ← this is the proof
```

---

## What to Refactor in This Repo

| File                   | Change                                                     | Refactor-safety gained            |
| ---------------------- | ---------------------------------------------------------- | --------------------------------- |
| `RegionFilter.test.ts` | Drop `vi.mock(useAppStore)`, use real store + `getState()` | Survives action renames           |
| `SearchInput.test.ts`  | Same as above                                              | Survives action renames           |
| `useCountries.test.ts` | Add MSW-based test alongside mock-based ones               | Survives hook internals changing  |
| `Home.cy.ts`           | Replace `input[placeholder="..."]` with `findByRole`       | Survives placeholder text changes |

---

## The Litmus Test

Before committing a test, ask:

> If I renamed every function this test touches but kept the behavior identical, would this test still pass?

If yes — it is refactor-safe. If no — it is testing implementation.
