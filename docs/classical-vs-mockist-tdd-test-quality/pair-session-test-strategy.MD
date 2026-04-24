# Pair Session: Test Strategy with Gaurav Dhuri

## What the Session Was

A hands-on pairing session focused on test strategy — not just reading about Classical vs Mockist TDD, but actively pulling mocks out of real tests, watching what broke, and deciding whether to make the test pass with less mocking or accept the mock as genuinely justified.

The codebase: the REST Countries app with Zustand, React Query, MSW, and a full test suite across unit, integration, and E2E layers.

---

## The Core Exercise: Remove a Mock, Watch What Happens

The exercise follows three steps:

1. Pick a test that uses `vi.mock` or a spy assertion
2. Remove the mock entirely and run the test
3. Interpret the failure — is it a real gap, or was the mock hiding something the real collaborator can provide?

The outcome tells you which category the mock belongs to:

| Outcome after removing mock                         | What it means                                    |
| --------------------------------------------------- | ------------------------------------------------ |
| Test still passes                                   | Mock was never needed                            |
| Test fails — real behavior now exposed              | Mock was hiding a genuine integration            |
| Test fails — missing setup (e.g. no store provider) | Mock was compensating for missing infrastructure |
| Test fails — external I/O (network, timer)          | Mock is justified — it belongs at the boundary   |

---

## Session Walkthrough

### Case 1: `RegionFilter` — mock removed, test repaired

**Starting point:**

```ts
vi.mock("../../../store/useAppStore", () => ({
  useAppStore: (selector: any) => selector(storeState),
}));

expect(setRegion).toHaveBeenCalledWith("Europe");
```

**Step 1 — remove the mock, run the test.**

The test crashes immediately. `RegionFilter` tries to call the real `useAppStore` but there is no Zustand provider in the render tree.

**Step 2 — interpret the failure.**

This is not a signal that the mock was needed. It is a signal that the test was under-provisioned. The real store exists and is fast — the test just never gave it a render context.

**Step 3 — repair with `renderWithProviders` instead of re-adding the mock.**

```ts
// Drop vi.mock entirely
beforeEach(() => {
  useAppStore.setState({ region: "", search: "" });
});

it("updates region in store on change", async () => {
  renderWithProviders(<RegionFilter />);
  await userEvent.selectOptions(screen.getByRole("combobox"), "Europe");
  expect(useAppStore.getState().region).toBe("Europe");
});
```

**What changed:** the assertion moved from `toHaveBeenCalledWith` (implementation) to `getState()` (contract). The mock was not replaced with another mock — it was replaced with nothing. The real store ran.

**Lesson from the pairing:** the mock in `RegionFilter` existed because the test was written in isolation without `renderWithProviders`. Once the infrastructure was in place, the mock had no job to do.

---

### Case 2: `useCountries` — both mocks removed, real store + MSW default handler

**Starting point:**

```ts
vi.mock("../store/useAppStore", () => ({
  useAppStore: (selector: any) => selector(storeState),
}));

vi.mock("../api/countriesApi", () => ({
  fetchCountries: vi.fn(),
}));
```

Two mocks in one file — one for the store, one for the API. Every test mutated `storeState` directly and called `mockResolvedValue` with a hardcoded fixture. React Query, real retries, real caching, and real `staleTime` were all bypassed.

**Step 1 — remove both mocks, run the tests.**

The store tests crash immediately — same "no provider" failure as `RegionFilter`. The API tests now hit the real MSW default handler, which returns 20 countries alternating between Asia and Europe.

**Step 2 — interpret the failure.**

The store mock is the same problem as `RegionFilter`: missing infrastructure, not a real boundary. `useAppStore.setState` replaces it entirely.

The API mock reveals something more useful: the MSW default fixture is actually sufficient for every test. The handler already returns 20 countries (Asia/Europe alternating) — enough to assert pagination, search filtering, and region filtering without hardcoding a custom dataset per test.

**Step 3 — repair with real store + MSW default handler throughout.**

```ts
describe("useCountries", () => {
  beforeEach(() => {
    useAppStore.setState({ debouncedSearch: "", region: "" });
  });

  it("fetches and paginates countries", async () => {
    // MSW default handler returns 20 countries — PAGE_SIZE = 5 → 4 pages
    const { result } = renderHook(() => useCountries(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data!.pages.length).toBeGreaterThan(1);
  });

  it("filters by search", async () => {
    useAppStore.setState({ debouncedSearch: "country 1", region: "" });

    const { result } = renderHook(() => useCountries(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

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

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const allCountries = result.current.data!.pages.flat();
    expect(allCountries.length).toBeGreaterThan(0);
    allCountries.forEach((c) => expect(c.region).toBe("Asia"));
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

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
```

The error test is the only one that uses `server.use()` — and that is the right call. It needs to simulate a real network failure, which is a genuine external boundary. Everything else runs against the default MSW handler with no overrides.

**What changed:** `storeState` mutation replaced with `useAppStore.setState`. `mockResolvedValue` replaced with the real MSW handler. Filter assertions now derive from the fixture's actual shape (alternating Asia/Europe) rather than a hardcoded two-country list. React Query, caching, and `staleTime` all run for real.

**Lesson from the pairing:** two mocks were removed in one pass. The store mock was compensating for missing infrastructure. The API mock was compensating for not trusting the MSW fixture that was already there. Once both were gone, the tests became a genuine contract on what `useCountries` delivers to its consumers.

---

### Case 3: `CountryGrid` — mock is genuinely justified, left in place

**Starting point:**

```ts
vi.mock("../../../hooks/useCountries");
vi.mock("../CountryCard/CountryCard", () => ({
  CountryCard: ({ country }: any) => (
    <div data-testid="country-card">{country.name.common}</div>
  ),
}));
```

**Step 1 — remove the mock, run the test.**

`CountryGrid` now tries to run the real `useCountries` hook, which needs React Query, MSW, and Zustand all configured. The skeleton/error/pagination tests fail immediately because the network request runs asynchronously and the test does not wait correctly.

**Step 2 — interpret the failure.**

`CountryGrid` is a pure layout component. Its responsibility is: _given data in this shape, render this structure._ The hook's data fetching behavior is already tested in `useCountries.test.ts` and `Home.test.tsx`. Running it for real here tests the hook again, not the grid.

**Step 3 — leave the mock in place, document the reason.**

```ts
// useCountries is mocked here intentionally.
// CountryGrid is a pure layout component — its contract is:
// "given data in this shape, render this structure."
// The hook's behavior is covered in useCountries.test.ts and Home.test.tsx.
// Running the real hook here would test data fetching, not layout.
vi.mock("../../../hooks/useCountries");
```

The `CountryCard` mock is also justified — the grid test is not about card rendering. A minimal stub keeps the test focused.

**Lesson from the pairing:** not all mocks are wrong. The signal that a mock is justified is when removing it shifts the test's scope to something already covered elsewhere. The question is not _"can I remove this mock?"_ but _"should this test care about what the mock was hiding?"_

---

## What the Pairing Surfaced

### The mock removal diagnostic

Removing a mock and watching the failure mode tells you more than reading the test ever could:

- **Crashes immediately with "no provider"** → mock was compensating for missing test infrastructure, not for a real boundary
- **Fails with network error** → mock is at a real boundary — justified, but consider using MSW instead of `vi.fn()`
- **Passes anyway** → mock was dead weight
- **Fails with wrong data** → mock was controlling test inputs that could be controlled via fixture or `server.use()` instead

### The "reduce, not remove" insight

The goal is not always zero mocks. It is the minimum mocks at the right level. In `useCountries`, the session landed on: remove `vi.mock` on the API module, replace with a targeted `server.use()` override. That is a reduction, not an elimination — and it moves the mock to the correct boundary (network) from the wrong one (module).

### Classical vs Mockist became concrete

Reading about Classical TDD describes the philosophy. Watching `RegionFilter` go from `expect(setRegion).toHaveBeenCalledWith("Europe")` to `expect(useAppStore.getState().region).toBe("Europe")` makes it visceral. The mockist version felt safe — it passed — but it was asserting on its own mock. The classical version actually proved something.

---

## Outcomes from the Session

| Test                        | Before                                  | After                                     |
| --------------------------- | --------------------------------------- | ----------------------------------------- |
| `RegionFilter`              | `vi.mock(useAppStore)` + call assertion | Real store + `getState()` assertion       |
| `SearchInput`               | `vi.mock(useAppStore)` + call assertion | Real store + `getState()` assertion       |
| `useCountries` filter tests | `vi.mock(fetchCountries)`               | `server.use()` override per test          |
| `CountryGrid`               | `vi.mock(useCountries)`                 | Left in place — documented as intentional |

---

## The Practice to Repeat

When reviewing any test that uses `vi.mock`:

1. Comment out the mock
2. Run the test
3. Read the failure — not just the error message, but what it implies about the test's design
4. Decide: repair with real collaborators, replace with a boundary mock (MSW), or restore with documentation

Do this with a partner. The back-and-forth of _"why did it fail here?"_ and _"what does this mock actually protect against?"_ produces better judgment than either person would reach alone.
