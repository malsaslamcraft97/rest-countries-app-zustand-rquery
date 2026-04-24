# 🧪 Day 9 — Advanced Testing Strategy (TDD & Mocks)

This document captures key learnings from analyzing our **Countries App test suite** (Vitest + RTL + MSW + Cypress) and improving test quality from a design perspective.

---

## 1. Classical TDD vs Mockist TDD

### 🏛 Classical TDD (Detroit / Chicago School)

**Focus:** Behavior & outcomes

- Tests real interactions between components
- Minimizes mocking
- Validates what the **user sees**

### Example (from our app)

```ts
renderWithProviders(<Home />);
expect(await screen.findByText("India")).toBeInTheDocument();
```

✔ Covers:

- API (via MSW)
- React Query
- Zustand
- UI rendering

---

### 🎭 Mockist TDD (London School)

**Focus:** Interactions between units

- Heavy use of mocks
- Verifies function calls

### Example (previous pattern)

```ts
expect(toggleFavorite).toHaveBeenCalled();
```

❌ Problem:

- Tests implementation, not behavior
- Breaks on refactor

---

### ✅ Current Strategy in This Repo

| Layer       | Approach                  |
| ----------- | ------------------------- |
| CountryCard | Classical (real store) ✅ |
| CountryGrid | Mock hook (isolated) ✅   |
| Home        | Full integration (MSW) ✅ |
| Cypress     | Real user flow (E2E) ✅   |

---

## 2. When to Use Mocks vs NOT

### ✅ Use mocks for:

- API calls → handled via **MSW**
- External systems (storage, analytics)
- Expensive async dependencies

```ts
vi.mock("../api/countriesApi");
```

---

### ❌ Avoid mocks for:

- UI components
- Hooks (when testing integration)
- Zustand store (when state is simple)

---

### 🧠 Rule

> Mock **boundaries**, not **your system**

---

## 3. Exercise: Identify Over-Mocking

### 🔍 Patterns found in our codebase

```ts
vi.mock("../../../hooks/useCountries");
vi.mock("../../../store/useAppStore");
expect(mockFn).toHaveBeenCalled();
```

---

### 🚨 Why this is over-mocking

- Hides real behavior
- Tests become disconnected from UI
- Creates false confidence

---

### ✅ Refactor Applied (CountryCard)

**Before:**

```ts
expect(toggleFavorite).toHaveBeenCalled();
```

**After:**

```ts
await userEvent.click(button);
expect(useAppStore.getState().favorites["India"]).toBe(true);
```

✔ Now testing real state change instead of function call

---

## 4. Test Smells

### 🚨 1. Testing Implementation

```ts
expect(fetchCountries).toHaveBeenCalled();
```

❌ User does not care about this

---

### 🚨 2. Fragile Tests

Break when:

- refactoring functions
- renaming variables
- changing internal logic

---

### 🚨 3. Invalid Mock Data (Real Issue Faced)

```ts
data: { pages: [[]] },
hasNextPage: true
```

❌ Result:

- UI rendered **"No countries found"**
- Load More button never appeared
- Tests failed

---

### ✅ Fix

```ts
data: {
  pages: [[{ name: { common: "India" } }]];
}
```

✔ Aligns with real UI conditions

---

## 5. What to Assert On

### ❌ Bad Assertions

```ts
expect(toggleFavorite).toHaveBeenCalled();
expect(fetchNextPage).toHaveBeenCalled();
```

---

### ✅ Good Assertions

```ts
expect(button).toHaveAttribute("aria-pressed", "true");
expect(screen.getByText("India")).toBeVisible();
```

---

### 🧠 Principle

> Assert **what the user sees**, not **what the code does internally**

---

## 7.

## 🧠 Key Learnings from This Repo

- MSW usage is correct → ✅ strong foundation
- Integration tests (Home) are strongest → ✅
- Cypress covers real user flows → ✅
- Over-mocking existed in unit tests → ⚠️ now improved
- Test data must reflect valid UI states → 🔥 critical insight

---

## 🚀 Final Takeaway

> Good tests are not about coverage.  
> They are about **confidence**.

---

### ✔ A Good Test

- Tests behavior
- Uses minimal mocks
- Reflects real user interaction
- Survives refactoring

---

### ❌ A Fragile Test

- Tests function calls
- Over-mocks dependencies
- Breaks easily
- Doesn’t reflect real usage

---

## 🔚 Summary

Transitioning from:

❌ Writing tests  
➡️  
✅ Designing tests

This is the shift from **intermediate → advanced frontend engineer**
