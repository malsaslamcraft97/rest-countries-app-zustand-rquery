# Exercise: Build Feature with Minimal Mocking

## The Feature: Favorites Filter Toggle

A `FavoritesToggle` button added to `Home` that filters the country grid to show only favorited countries. When active, non-favorited countries disappear from the grid. The button reflects its state via `aria-pressed`.

---

## What Was Built

### `FavoritesToggle` component

```tsx
export function FavoritesToggle() {
  const showFavoritesOnly = useAppStore((s) => s.showFavoritesOnly);
  const toggleShowFavorites = useAppStore((s) => s.toggleShowFavorites);

  return (
    <button onClick={toggleShowFavorites} aria-pressed={showFavoritesOnly}>
      {showFavoritesOnly ? "Showing Favorites" : "Show Favorites Only"}
    </button>
  );
}
```

No props. No injected handlers. The component reads directly from the real Zustand store and calls a real action. There is nothing to mock here — and nothing was.

---

## The Integration Test

```tsx
describe("Favorites Filter (integration)", () => {
  beforeEach(() => {
    useAppStore.setState({
      favorites: {},
      showFavoritesOnly: false,
      search: "",
      region: "",
    });
  });

  it("filters to only favorite countries", async () => {
    renderWithProviders(<Home />);

    const country0 = await screen.findByText("Country 0");
    const country1 = await screen.findByText("Country 1");
    expect(country0).toBeInTheDocument();
    expect(country1).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: /add country 0 to favorites/i }),
    );

    await userEvent.click(
      screen.getByRole("button", { name: /show favorites only/i }),
    );

    expect(screen.getByText("Country 0")).toBeInTheDocument();
    expect(screen.queryByText("Country 1")).not.toBeInTheDocument();
  });
});
```

---

## Mock Count: Zero

This test exercises the full feature slice with no `vi.mock` calls anywhere. Here is everything that ran real:

| Layer                         | What ran                          | How                                                  |
| ----------------------------- | --------------------------------- | ---------------------------------------------------- |
| Network                       | MSW handler returns fixture data  | Configured in `test-utils` via `renderWithProviders` |
| Data fetching                 | React Query `useQuery`            | Real — fetches, caches, updates                      |
| Global state                  | Zustand store                     | Real store, seeded via `setState`                    |
| `FavoritesToggle`             | Real component                    | Reads and writes real store                          |
| `CountryCard` favorite button | Real component                    | Writes `favorites` to real store                     |
| `CountryGrid` filter          | Real filtering logic              | Reacts to `showFavoritesOnly` state change           |
| UI assertions                 | `screen.getByText`, `queryByText` | Behavior — not implementation                        |

MSW is the only external stand-in, and it is a **fake** (a working HTTP server), not a mock.

---

## Why This Test Has High Confidence

The test proves the entire vertical slice works:

```text
User clicks "Add Country 0 to Favorites"
  → CountryCard calls toggleFavorite action
  → Zustand updates favorites: { "Country 0": true }

User clicks "Show Favorites Only"
  → FavoritesToggle calls toggleShowFavorites action
  → Zustand updates showFavoritesOnly: true

CountryGrid re-renders
  → Filters countries where favorites[name] === true
  → Country 0 visible, Country 1 gone
```

A mockist version (`expect(toggleShowFavorites).toHaveBeenCalled()`) would verify step 2 in isolation — and miss every step after it. This test verifies the outcome the user actually experiences.

---

## The `beforeEach` Pattern

```ts
useAppStore.setState({
  favorites: {},
  showFavoritesOnly: false,
  search: "",
  region: "",
});
```

This is the **fake pattern** — seeding the real store with known initial state rather than replacing it with a stub. Every test starts from a clean, deterministic baseline. No test pollution, no order dependency.

Resetting all relevant slices (not just the one under test) is important — `search` and `region` being non-empty would silently interfere with the filter assertions.

---

## The Mock Boundary Map

```text
Home (renderWithProviders)
       ↓
  MSW ← only mock (fake HTTP server at the network boundary)
       ↓
  React Query (real)
       ↓
  CountryGrid (real) → CountryCard (real) → Zustand (real)
       ↓
  FavoritesToggle (real) → Zustand (real)
```

One boundary. One fake. Everything inside is real.

---

## The Rule This Demonstrates

> If you feel the urge to mock a Zustand action, a React hook, or a child component — stop and ask: _is this component actually at a system boundary?_ If it only talks to your own code, use the real thing and seed state via `setState`. The test will be more honest and more durable.

Mock only what you cannot control. Everything else should run.
