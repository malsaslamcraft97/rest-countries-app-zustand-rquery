# 🌍 REST Countries Explorer — Accessibility Improvements / ARIA Advanced

This project focuses on building a performant and accessible frontend application using React, Zustand, and TanStack Query.

A major part of this iteration was improving **accessibility (a11y)** from a Lighthouse score of **80 → 100**, while also addressing real-world usability concerns beyond automated checks.

## 📌 Highlights

- Improved accessibility score from 80 → 100
- Built production-grade accessible components (Modal, Tabs, Combobox)
- Implemented ARIA patterns with full keyboard & screen reader support

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

---

# 🧩 ARIA Patterns & Advanced Accessibility

This phase focused on implementing **real-world accessible components** using ARIA patterns and proper focus management.

Unlike basic accessibility fixes, this involved building **complex interactive components from scratch** while ensuring full keyboard and screen reader support.

---

## 🎯 Components Implemented

### 🔘 Accessible Button

- Built reusable button component supporting:
  - `aria-label` for icon-only buttons
  - `aria-busy` for loading states
  - Proper `disabled` handling
- Ensured semantic `<button>` usage (no unnecessary ARIA)

---

### 🪟 Accessible Modal (Dialog)

- Implemented fully accessible dialog with:
  - `role="dialog"` and `aria-modal`
  - Focus trap (Tab / Shift+Tab cycling)
  - Escape key to close
  - Focus return to trigger element

---

### 📑 Tabs Component

- Built keyboard-accessible tabs using:
  - `role="tablist"`, `tab`, `tabpanel`
  - Arrow key navigation
  - Focus vs selected state separation

---

### 📂 Accordion (Disclosure)

- Implemented accessible accordion using:
  - `aria-expanded`
  - `aria-controls`
- Supports keyboard interaction and proper content toggling

---

### 📝 Accessible Form (Advanced)

- Improved form UX with:
  - `aria-invalid` for error states
  - `aria-describedby` for linking errors
  - Error summary with `role="alert"`
  - Focus management on validation failure
- Implemented real-world validation patterns

---

### 📢 ARIA Live Regions

- Built dynamic announcement system for:
  - Success messages (`aria-live="polite"`)
  - Error messages (`aria-live="assertive"`)
- Handled re-announcement edge cases using DOM toggling

---

### 🔍 Accessible Combobox (Custom Select)

- Built fully accessible combobox from scratch:
  - `role="combobox"`, `listbox`, `option`
  - `aria-activedescendant` for active item tracking
  - Keyboard navigation (↑ ↓ Enter Esc)
  - Debounced search input
  - Highlighted matching text
- Handles:
  - Controlled + uncontrolled input
  - Mouse + keyboard interaction parity
  - Outside click handling

---

## 🧠 Key Learnings

- **First rule of ARIA**: Prefer native HTML before using ARIA
- Accessibility is not just about passing Lighthouse, but ensuring:
  - Keyboard usability
  - Screen reader compatibility
  - Logical interaction flows
- Complex components (like combobox, modal) require:
  - Careful focus management
  - Correct ARIA relationships
  - Handling multiple edge cases

---

## 🚀 Outcome

This phase elevated the application from:

> "Accessible UI"

to

> **"Production-grade accessible system with real-world interaction patterns"**

## 📱 Mobile Accessibility & Responsiveness

The application has been tested for mobile usability and accessibility across responsive viewports.

### ✔ Responsive Design

- Layout adapts across mobile, tablet, and desktop
- No horizontal scrolling at standard mobile widths
- Content remains fully visible within viewport

### ✔ Touch Accessibility

- Interactive elements meet minimum touch target size (≥ 44×44px)
- Adequate spacing between clickable elements

### ✔ Zoom & Readability

- Supports zoom up to 200% without layout breakage
- No clipped or overlapping content during scaling

### ✔ Testing Performed

- Chrome DevTools (mobile simulation)
- Manual viewport testing (multiple breakpoints)

---

### 🧠 Note

Mobile accessibility issues such as overflow, clipping, and touch usability were manually verified and corrected, as these are not fully detectable via automated tools.
