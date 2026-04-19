# 🌍 REST Countries Explorer (Zustand + React Query)

A modern React application that explores countries data using the REST Countries API.  
Built to demonstrate **clean state management**, **server-state handling**, and **production-level frontend patterns**.

---

## 🚀 Tech Stack

- React + TypeScript
- Vite
- Zustand (client state)
- TanStack React Query (server state)
- SCSS Modules
- React Query DevTools

---

## 🎯 Key Concepts Covered

This project was built as a hands-on implementation of advanced frontend patterns.

### 🧠 State Management

#### Zustand (Client State)

- Global store using `create`
- Clean separation of concerns
- Debounced search implementation
- Theme management (dark/light)
- Favorites with persistence

#### Patterns Used

- Single store (scalable for small-medium apps)
- Derived state (`debouncedSearch`)
- Local-first UI state (favorites)

---

### 🌐 Server State (React Query)

- `useQuery` → initial data fetching
- `useInfiniteQuery` → pagination
- `useMutation` → async flows
- Query caching & invalidation
- Background prefetching
- DevTools for debugging

---

## ⚡ Features

- 🔍 Search countries (debounced)
- 🌍 Filter by region
- ⭐ Mark countries as favorites (persisted)
- 🌗 Dark / Light theme toggle
- ♾ Infinite scrolling (pagination)
- ⚡ Prefetching for faster UX
- 🧊 Skeleton loaders (loading states)
- 🛠 DevTools for query inspection

---

## 🏗 Architecture Overview

### Separation of Concerns

| Type of State    | Managed By  |
| ---------------- | ----------- |
| Server data      | React Query |
| UI / client data | Zustand     |

This ensures:

- No duplication of state
- Better performance
- Predictable data flow

---

## 📂 Folder Structure

src/
api/ # API calls
components/ # UI components
hooks/ # React Query hooks
store/ # Zustand store
styles/ # Global styles

---

## 🔥 Important Design Decisions

### 1. Favorites handled via Zustand (not React Query)

Favorites are:

- Client-only
- Persisted locally
- Not part of API

So they are stored in Zustand instead of mutating React Query cache.

---

### 2. Prefetching Strategy

Countries data is prefetched on load to:

- Warm cache early
- Avoid loading flashes
- Improve perceived performance

Verified via React Query DevTools (inactive query with cached data).

---

### 3. Infinite Query over Pagination

Used `useInfiniteQuery` to:

- Simulate scalable API usage
- Demonstrate real-world pagination handling

---

### 4. Theme via CSS Variables

- Global theme controlled via Zustand
- Applied using `data-theme` on `<body>`
- Enables clean dark/light switching

---

## 🧪 DevTools Usage

React Query DevTools is integrated to:

- Inspect query cache
- Debug fetching states
- Verify prefetching
- Track invalidations

---

## 📦 Getting Started

```bash
# install dependencies
yarn

# run dev server
yarn dev
```
