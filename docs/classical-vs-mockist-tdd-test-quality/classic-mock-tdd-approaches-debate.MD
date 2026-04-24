# Classical TDD vs Mockist TDD

## Classical (Detroit / Chicago School)

**Philosophy:** Test observable behavior. Mock only at true boundaries (network, filesystem, time).

```ts
renderWithProviders(<Home />);
expect(await screen.findByText("India")).toBeInTheDocument();
```

Covers MSW → React Query → Zustand → UI in one test. Survives refactors as long as behavior is unchanged.

| Strength                    | Weakness                    |
| --------------------------- | --------------------------- |
| Resilient to refactors      | Slower feedback loop        |
| High integration confidence | Harder to pinpoint failures |
| Closer to real usage        | Verbose setup               |

---

## Mockist (London School)

**Philosophy:** Test units in strict isolation. Verify interactions between collaborators via mocks/spies.

```ts
expect(toggleFavorite).toHaveBeenCalled();
```

Says _"the function was called"_ — not _"the behavior worked."_ This is the **over-specification trap**: tests break on refactor even when the app still works correctly.

| Strength                     | Weakness                                      |
| ---------------------------- | --------------------------------------------- |
| Ultra-fast execution         | Brittle — breaks on rename/refactor           |
| Useful for interface design  | Mocks drift from real implementations         |
| Pinpoints failures precisely | Integration gaps: green tests, red production |

---

## Key Differences

| Dimension              | Classical                 | Mockist                    |
| ---------------------- | ------------------------- | -------------------------- |
| Unit definition        | A behavior / system slice | A single class or function |
| Isolation              | Mock only boundaries      | Mock all collaborators     |
| Assert on              | Observable output / UI    | Function calls             |
| Refactor safety        | High                      | Low                        |
| Integration confidence | High                      | Low                        |

---

## Decision Heuristic

- **Pure logic, no side effects** → classical unit test (no mocks needed)
- **I/O boundary (network, DB, time)** → mock the boundary (MSW, fake timers)
- **User-visible component behavior** → `renderWithProviders` + real stores
- **Designing a new interface** → mockist to discover shape, then replace with real tests

---

## Strategy in This Repo

| Layer         | Approach                       | Rationale                                   |
| ------------- | ------------------------------ | ------------------------------------------- |
| `CountryCard` | Classical — real Zustand store | Tests actual toggle behavior                |
| `CountryGrid` | Mock hook (isolated)           | Layout-only; data contract tested elsewhere |
| `Home`        | Full integration via MSW       | Covers the entire user-visible data flow    |
| `Cypress`     | E2E                            | Final confidence gate before shipping       |

### Classical vs Mockist — side by side

```ts
// Classical: asserts behavior — survives a Zustand → Context migration
renderWithProviders(<CountryCard country={mockCountry} />);
fireEvent.click(screen.getByRole("button", { name: /favorite/i }));
expect(screen.getByRole("button", { name: /unfavorite/i })).toBeInTheDocument();

// Mockist: asserts implementation — breaks on rename
expect(toggleFavorite).toHaveBeenCalled();
```

---

## Summary

> **Classical TDD builds confidence. Mockist TDD builds isolation.**
> Mock at the boundary, not in the middle of your own code.
> The goal is not to prove functions were called — it is to prove the system does what the user expects.
