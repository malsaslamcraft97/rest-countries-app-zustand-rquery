---

## 🔍 A11y Playground Audit (ARIA Patterns)

### Summary

- **Tool Used:** axe DevTools
- **Initial Issues:** 3 (Serious)
- **Final Issues:** 0
- **Scope:** Interactive ARIA components (Button, Modal, Tabs, Accordion)

---

# Axe Audit - Manual Testing using Axe DevTools

## Accessibility Page Audit (feat/aria-patterns)

### ❗ Issue 1: Insufficient Color Contrast (Tabs - Active State)

**Type:** Violation  
**Impact:** Serious

**Description:**  
Active tab used blue text (`#2563eb`) on a dark background (`#0b1624`), resulting in insufficient contrast (~3.5:1), below WCAG AA requirement (4.5:1).

**Fix Applied:**

- Replaced blue text with high-contrast color (`#e5e7eb`)
- Used underline (`::after`) as visual indicator for active state instead of relying on color

**Before:**

```scss
.tab[aria-selected="true"] {
  color: #2563eb;
}
```

**After:**

```scss
.tab[aria-selected="true"] {
  color: #e5e7eb;
}

.tab[aria-selected="true"]::after {
  background: #60a5fa;
}
```

**Why It Matters:**  
Color contrast is critical for users with low vision. Additionally, relying only on color to indicate state violates accessibility best practices.

---

### ❗ Issue 2: Insufficient Color Contrast (Inactive Tabs)

**Type:** Violation  
**Impact:** Serious

**Description:**  
Inactive tab text (`#6b7280`) had low contrast against a dark background.

**Fix Applied:**

- Updated text color to a more accessible shade (`#9ca3af`)

**Before:**

```scss
.tab {
  color: #6b7280;
}
```

**After:**

```scss
.tab {
  color: #9ca3af;
}
```

**Why It Matters:**  
Ensures readability for all users and meets WCAG AA standards.

---

### ❗ Issue 3: Opacity-Based Contrast Issues

**Type:** Violation  
**Impact:** Serious

**Description:**  
Some UI elements used `opacity` (e.g., `0.6`) for text/icons, reducing effective contrast and failing WCAG requirements.

**Fix Applied:**

- Removed opacity usage for text elements
- Replaced with explicit accessible color values

**Before:**

```scss
color: #ffffff;
opacity: 0.6;
```

**After:**

```scss
color: #9ca3af;
opacity: 1;
```

**Why It Matters:**  
Opacity reduces contrast unpredictably and can make content difficult to read, especially for users with low vision.

---

## 🔍 Home Page Audit (Countries App)

### Summary

- **Tool Used:** axe DevTools
- **Issues Found:** 0
- **Scope:** Search, Region Filter, Country Grid, Country Cards, Favorite Button, Theme Toggle

---

## ✅ Validation Performed

The Home page was audited using axe DevTools and manually verified for accessibility best practices.

### ✔ Semantic Structure

- Proper use of:
  - `<header>`, `<main>`
  - Logical content grouping
- No misuse of ARIA roles

---

### ✔ Form Accessibility

- Search input has associated `<label>`
- Region filter (`<select>`) properly labeled
- No placeholder-only inputs

---

### ✔ Interactive Elements

- Buttons (favorite, theme toggle) include:
  - `aria-label`
  - `aria-pressed` (for toggle states)
- All controls are keyboard accessible

---

### ✔ Keyboard Navigation

- Full navigation possible using:
  - `Tab` / `Shift + Tab`
- Logical tab order maintained
- No keyboard traps detected

---

### ✔ Focus Management

- Visible focus indicators present
- Focus moves predictably across UI
- No hidden or unreachable interactive elements

---

### ✔ Screen Reader Support

- Verified using VoiceOver (macOS)
- Confirmed:
  - Correct announcements for buttons and inputs
  - Meaningful labels for controls
  - Proper reading order

---

### ✔ Color Contrast

- All text meets WCAG 2.1 AA contrast requirements
- Previously identified contrast issues were resolved

---

### ✔ Visual vs DOM Order

- Layout matches DOM structure
- No use of:
  - `flex-order`
  - `row-reverse`

---

## Pa11y Audit

Initial Issues: 2  
Final Issues: 0

### Issue: Input Missing Accessible Name

Fix:

- Added label
- Added aria-label fallback

---

## Final Result

✔ 1/1 URLs passed  
✔ 0 accessibility violations

---

## Takeaway

Accessibility is about real usability, not just passing tools.

## 🚀 Outcome

- No accessibility violations detected via automated tools
- All critical user flows validated manually
- Application meets **WCAG 2.1 AA standards**

---

## 🧠 Key Insight

Automated tools reported zero issues, but manual validation was still performed to ensure:

- Real usability for keyboard users
- Proper screen reader experience
- Logical interaction patterns

This reinforces that:

> Accessibility is not just about passing tools, but ensuring real-world usability
