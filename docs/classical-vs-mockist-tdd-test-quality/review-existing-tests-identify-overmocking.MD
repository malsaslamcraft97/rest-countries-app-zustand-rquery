# Test Audit: Over-Mocking Patterns Review

## Verdict: Mostly Clean ✅

Both test files follow **Classical TDD** well. No over-mocking detected in the traditional sense. The notes below are refinements, not red flags.

---

## `Home.test.tsx` — Vitest / RTL (Integration)

### What's done well here

| Test                              | Why it's clean                                          |
| --------------------------------- | ------------------------------------------------------- |
| "renders countries after loading" | Real MSW + React Query + UI — no internal mocks         |
| "filters via search input"        | `userEvent.type` on real input — tests actual behavior  |
| "filters via region dropdown"     | `userEvent.selectOptions` — real DOM interaction        |
| "loads more on Load More click"   | Asserts count change — behavior, not implementation     |
| "fallback API"                    | MSW override at network layer — architecturally correct |
| "both APIs fail → error"          | Tests error state via real HTTP failure — correct       |

### Issues to address

**1. Missing `await` on `userEvent` setup calls**

```ts
// ❌ Current — userEvent.setup() not used; can cause subtle async issues
await userEvent.type(input, "Country 1");

// ✅ Preferred
const user = userEvent.setup();
await user.type(input, "Country 1");
```

`userEvent.setup()` creates an isolated instance with proper pointer/keyboard state, which matters for complex interactions. The current pattern works but is the v13 API — v14 recommends `setup()`.

---

**2. Region filter test asserts too loosely**

```ts
// ❌ Current — only checks Country 0 still exists, not that non-Asia countries are gone
await userEvent.selectOptions(select, "Asia");
expect(await screen.findByText("Country 0")).toBeInTheDocument();
```

This passes even if the filter does nothing. Add a negative assertion:

```ts
expect(screen.queryByText("Country 5")).not.toBeInTheDocument(); // assuming Country 5 is not Asia
```

---

**3. `Load More` test: `before` count includes all `/Country/i` text nodes**

```ts
const before = screen.getAllByText(/Country/i).length;
```

This regex matches any text containing "Country" — including labels, headings, or aria-text. Scope it to cards specifically:

```ts
const before = screen.getAllByRole("heading", { level: 2 }).length;
```

---

## `Home.cy.ts` — Cypress (E2E)

### What's done well### What's done well

| Test                                | Why it's clean                                         |
| ----------------------------------- | ------------------------------------------------------ |
| `cy.intercept` at network layer     | Correct boundary — not mocking internal modules        |
| `cy.injectAxe` + `logA11y`          | Accessibility built into the flow — excellent practice |
| Theme persistence via `cy.reload()` | Tests real localStorage behavior                       |
| Fallback + dual failure tests       | Mirrors the integration tests — good coverage parity   |
| Empty search state                  | Tests a real edge case, not a happy path only          |

### Issues to address now

**1. `logA11y` silently swallows violations**

```ts
true, // don't fail tests
```

Accessibility violations are logged but never fail the suite. This means a11y regressions are invisible in CI. Recommended fix: fail in CI, warn locally.

```ts
const shouldFail = Cypress.env("CI") === true;
cy.checkA11y(
  context,
  undefined,
  (violations) => {
    cy.task("logA11y", violations);
  },
  !shouldFail,
);
```

---

**2. Hardcoded placeholder selector is brittle**

```ts
cy.get('input[placeholder="Search for a country..."]');
```

If the placeholder text changes, the test breaks silently. Use an accessible label selector instead — which you already have in the RTL tests:

```ts
cy.findByRole("textbox", { name: /search for a country/i });
```

This requires `@testing-library/cypress` but keeps E2E and unit tests using the same query strategy.

---

**3. Favorite test doesn't assert persistence**

```ts
cy.get("button[aria-label*='Add']").first().click();
cy.get("button[aria-pressed='true']").should("exist");
```

This only checks that the button state changed in-memory. Since theme _does_ get a persistence test, favorites probably should too:

```ts
cy.reload();
cy.injectAxe();
cy.get("button[aria-pressed='true']").should("exist"); // still favorited after reload
```

---

**4. `cy.wait("@getCountries")` missing in fallback test**

```ts
cy.visit("/");
cy.injectAxe();
cy.wait("@fallback"); // ✅ good
```

But the primary intercept (`**/v3.1/all*`) isn't aliased before the visit, so the 500 fires without a wait. This can cause a race condition on slower machines. Alias it:

```ts
cy.intercept("GET", "**/v3.1/all*", { statusCode: 500 }).as("primaryFail");
cy.visit("/");
cy.wait("@primaryFail");
cy.wait("@fallback");
```

---

## Summary

| File            | Over-mocking? | Real Issues                                                                                         |
| --------------- | ------------- | --------------------------------------------------------------------------------------------------- |
| `Home.test.tsx` | None ✅       | Loose region assertion, regex scope, `userEvent.setup()`                                            |
| `Home.cy.ts`    | None ✅       | Silent a11y failures, brittle placeholder, missing favorite persistence, race condition in fallback |

The testing strategy is architecturally sound — MSW and `cy.intercept` at the network boundary, real stores, real interactions. The fixes above are about **assertion precision** and **test reliability**, not mocking philosophy.
