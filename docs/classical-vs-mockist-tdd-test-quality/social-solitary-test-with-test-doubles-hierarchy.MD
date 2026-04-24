# Sociable vs Solitary Tests & Test Doubles Hierarchy

---

## Part 1: Sociable vs Solitary Tests

### Definitions

**Solitary tests** isolate the unit completely — all collaborators are replaced with test doubles. The unit never touches real dependencies.

**Sociable tests** let the unit interact with real collaborators — they only replace things at the true system boundary (network, filesystem, time).

Neither is universally better. The choice depends on what you're trying to verify.

---

### Decision Rule

```text
Does the wiring between this unit and its collaborator matter?
  → Sociable (use real collaborators)

Is the collaborator an external system or expensive to run?
  → Replace it at the boundary (MSW, fake timer, in-memory store)

Is the unit purely about layout/rendering given some input?
  → Solitary is fine (mock the data source, test the shape)
```

---

### In This Repo

#### `CountryCard.test.tsx` — Sociable ✅

```ts
beforeEach(() => {
  useAppStore.setState({ favorites: {} });
});

await userEvent.click(button);
expect(useAppStore.getState().favorites["India"]).toBe(true);
```

`CountryCard` talks directly to the real Zustand store. This is correct — the wiring _is_ the behavior. A test that mocks `toggleFavorite` would miss the question: _did the store actually update?_

Collaborators used for real: Zustand store
Collaborators replaced: none (no network in this component)

---

#### `CountryGrid.test.tsx` — Solitary ✅ (justified)

```ts
vi.mock("../../../hooks/useCountries");
vi.mock("../CountryCard/CountryCard", () => ({
  CountryCard: ({ country }: any) => <div data-testid="country-card">{country.name.common}</div>,
}));
```

`CountryGrid` is a pure layout component. It doesn't own data fetching — `useCountries` does. Mocking the hook is justified because:

- The hook's contract is already tested in `countriesApi.test.ts` and `Home.test.tsx`
- This test focuses on a single question: _given this data shape, does the grid render correctly?_
- Mocking `CountryCard` itself is also fine — it prevents this test from failing due to `CountryCard`'s internals

Collaborators replaced: `useCountries` hook, `CountryCard`, `CountryCardSkeleton`
Collaborators used for real: none (pure rendering logic only)

**One issue:** `fetchNextPage` is verified with `expect(fetchNextPage).toHaveBeenCalled()` — this is a Mockist assertion (interaction, not behavior). It can't verify that clicking Load More actually loads more. The `Home.test.tsx` integration test covers this gap, which is why the layered strategy matters.

---

#### `Home.test.tsx` — Sociable ✅

```ts
renderWithProviders(<Home />);
expect(await screen.findByText("Country 0")).toBeInTheDocument();
```

Everything is real except the network. MSW intercepts at the HTTP boundary — React Query, Zustand, and the full component tree all run as-is.

---

#### `countriesApi.test.ts` — Sociable with boundary mock ✅

```ts
const data = await fetchCountries();
expect(data.length).toBeGreaterThan(0);
```

The first test hits the real MSW handler — no modules are mocked, the actual `fetch` runs. The second test overrides MSW to simulate failure. This is the correct pattern: replace the network boundary, not the module.

---

### When Solitary Goes Wrong

If `CountryCard` had been written like this:

```ts
// ❌ Solitary with mock assertion
const toggleFavorite = vi.fn();
render(<CountryCard onToggle={toggleFavorite} />);
await userEvent.click(button);
expect(toggleFavorite).toHaveBeenCalled();
```

It would pass even if the store was never updated, the button was broken, or the handler was wired to the wrong action. The test proves _a function was called_, not _the user's favorite was saved_.

---

### Summary

| Test           | Style    | Real collaborators               | Boundary mock            |
| -------------- | -------- | -------------------------------- | ------------------------ |
| `CountryCard`  | Sociable | Zustand store                    | —                        |
| `CountryGrid`  | Solitary | —                                | `useCountries` hook      |
| `Home`         | Sociable | React Query, Zustand, Components | MSW (network)            |
| `countriesApi` | Sociable | fetch, MSW handlers              | MSW override on failure  |
| Cypress        | Sociable | Full browser stack               | `cy.intercept` (network) |

---

## Part 2: Test Doubles Hierarchy — Prefer Fakes Over Mocks

### The Hierarchy

From most to least desirable:

```text
Real object      → Use when fast and deterministic (Zustand store)
Fake             → Lightweight working implementation (MSW, in-memory DB)
Stub             → Returns hardcoded values, no behavior
Spy              → Real object that also records calls
Mock             → Pre-programmed with expectations; fails if not met
```

Mocks are at the bottom because they encode _how_ the code works, not _what_ it does. Fakes encode behavior without coupling to implementation.

---

### Applied to This Repo

#### MSW is a Fake — not a mock ✅

```ts
http.get(/restcountries\.com\/v3\.1\/all/, () => {
  return HttpResponse.json(countriesFixture);
});
```

MSW is a working fake HTTP server. It doesn't say "assert that `fetch` was called" — it intercepts real network requests and returns real responses. React Query, error handling, retries — all behave exactly as in production. This is why MSW is the gold standard for frontend API testing.

Compare to the Mockist alternative:

```ts
// ❌ Mock — brittle, couples to module internals
vi.mock("../api/countriesApi", () => ({
  fetchCountries: vi.fn().mockResolvedValue(countriesFixture),
}));
```

This skips React Query entirely. You'd never know if the query key was wrong, if `staleTime` was misconfigured, or if an error boundary was missing.

---

#### Zustand `setState` is a Fake pattern ✅

```ts
useAppStore.setState({ favorites: {} });
```

Rather than mocking `useAppStore`, you're seeding the real store with test state. This is a fake — it uses the real store implementation with controlled initial conditions. The component gets real reactivity, real selectors, real derived state.

---

#### `CountryGrid`'s hook mock is a Stub ⚠️

```ts
mockUseCountries.mockReturnValue({
  isLoading: true,
  isError: false,
});
```

This is a stub — it returns a hardcoded value with no real behavior. It's acceptable here because `CountryGrid` is a pure layout component and the hook's real behavior is tested elsewhere. But it has a cost: if `useCountries` changes its return shape, this stub silently drifts and the tests keep passing.

Mitigation — type the mock return value strictly:

```ts
mockUseCountries.mockReturnValue({
  isLoading: true,
  isError: false,
} satisfies Partial<ReturnType<typeof useCountries>>);
```

This makes the compiler catch drift before the tests do.

---

#### `fetchNextPage` is a Mock — the one genuine red flag ⚠️

```ts
const fetchNextPage = vi.fn();
// ...
expect(fetchNextPage).toHaveBeenCalled();
```

This is a pure mock assertion — it verifies interaction, not behavior. It answers _"was the function called?"_ not _"did more countries load?"_

This is acceptable only because `Home.test.tsx` covers the real behavior end-to-end. If that integration test were removed, this mock would give false confidence.

A fake alternative would be a real implementation that appends to a pages array and lets you assert on rendered output. But at this layer (isolated grid test), the mock is a pragmatic tradeoff — just ensure it's covered at a higher level.

---

### Hierarchy Applied — Quick Reference

| Usage in repo                              | Double type | Verdict                                 |
| ------------------------------------------ | ----------- | --------------------------------------- |
| MSW (`http.get(...)`)                      | Fake        | ✅ Best choice                          |
| `useAppStore.setState(...)`                | Fake        | ✅ Best choice                          |
| `cy.intercept(...)`                        | Fake        | ✅ Best choice                          |
| `mockUseCountries.mockReturnValue(...)`    | Stub        | ⚠️ Acceptable — add `satisfies` typing  |
| `CountryCard` mock in grid test            | Stub        | ✅ Correct scope                        |
| `expect(fetchNextPage).toHaveBeenCalled()` | Mock        | ⚠️ Covered by integration — document it |

---

### The Practical Rule

> Replace at the boundary. Use fakes where possible, stubs where scope demands it, mocks only as a last resort — and always ensure mock assertions are backed by a sociable or E2E test higher in the stack.
