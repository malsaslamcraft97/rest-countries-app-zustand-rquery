---

## 🔍 A11y Playground Audit (ARIA Patterns)

### Summary

- **Tool Used:** axe DevTools
- **Initial Issues:** 3 (Serious)
- **Final Issues:** 0
- **Scope:** Interactive ARIA components (Button, Modal, Tabs, Accordion)

---

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

## ✅ Key Learnings

- Avoid using **color alone** to indicate UI state
- Prefer **structure-based indicators** (underline, border, font-weight)
- Avoid using **opacity for text contrast**
- Always validate contrast against actual background colors
- Accessibility requires both **design decisions and technical implementation**

---

## 🚀 Outcome

- All accessibility violations resolved
- ARIA components validated for real-world usage
- Improved accessibility beyond automated tooling
- Achieved **0 issues in axe DevTools audit**
