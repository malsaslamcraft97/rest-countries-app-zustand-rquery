# 🌍 REST Countries Explorer — Accessibility Improvements

This project focuses on building a performant and accessible frontend application using React, Zustand, and TanStack Query.

A major part of this iteration was improving **accessibility (a11y)** from a Lighthouse score of **80 → 100**, while also addressing real-world usability concerns beyond automated checks.

---

## 🚀 Accessibility Score Improvement

| Metric        | Before | After   |
| ------------- | ------ | ------- |
| Accessibility | 80     | **100** |

This improvement was achieved through a combination of **semantic HTML**, **ARIA best practices**, and **manual accessibility validation**.

---

## 🧠 What We Fixed (Lighthouse Issues)

### 1. Form Labels (WCAG: Understandable)

- Added proper `<label>` elements for:
  - Search input
  - Region filter (`<select>`)
- Used visually hidden labels (`sr-only`) to maintain clean UI

---

### 2. Missing `<title>` (WCAG: Understandable)

- Added descriptive document title:

```html
<title>REST Countries Explorer</title>
```

### 3. Missing lang Attribute (WCAG: Robust)

- Defined document language for screen readers:

```html
<html lang="en"></html>
```

### 4. Heading Hierarchy (WCAG: Operable + Understandable)

- Implemented proper structure:
  - h1 -> Page title
  - h2 -> Sections
  - h3 -> Country Cards
- Ensured no heading levels were skipped

## ♿ Accessibility Enhancements (Beyond Lighthouse)

### 🔹 1. Keyboard Navigation

- Full app operable using keyboard only
- All interactive elements are focusable:
  • Buttons
  • Inputs
  • Select dropdowns
- Logical tab order maintained (DOM = visual order)

### 🔹 2. Accessible Interactive Elements

⭐ Favorite Button

- Added:
  • aria-label (purpose)
  • aria-pressed (state)

```html
<button
  aria-pressed="{isFav}"
  aria-label="{"
  isFav
  ?
  `Remove
  ${country.name.common}
  from
  favorites`
  :
  `Add
  ${country.name.common}
  to
  favorites`
  }
></button>
```

🌙 Theme Toggle

- Clearly communicates state using ARIA:

```html
<button
  aria-pressed={isDark}
  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
>
```

### 🔹 3. Search Input Accessibility

- Replaced placeholder-only input with a proper `<label>`
- Ensured the input retains meaning even after user starts typing
- Improved screen reader announcement and usability

---

### 🔹 4. Skip Navigation (WCAG Level A)

- Implemented "Skip to main content" link

```tsx
<a href="#main">Skip to main content</a>
```

- Hidden by default and visible only on keyboard focus
- Allows users to bypass repetitive navigation (header, filters, etc.)

### 🔹 5. Focus Management

- Added visible focus indicators for all interactive elements
- Ensured no focus traps exist
- Verified smooth navigation using:
  • Tab (forward)
  • Shift + Tab (backward)

### 🔹 6. Visual vs DOM Order Alignment

- Ensured layout does not rely on:
  • flex-order
  • row-reverse
- Maintained consistency between:
  • Visual layout
  • DOM structure
  • Keyboard navigation order

### 🔹 7. Screen Reader Validation (Manual Testing)

- Tested using VoiceOver (macOS)
  Validated:
  • Proper heading hierarchy navigation
  • Correct control announcements (inputs, buttons, selects)
  • Meaningful labels and ARIA attributes
  • Logical reading and navigation order
