## 2025-03-02 - O(N*M) Overhead in Render Loops
**Learning:** Performing `Array.filter` operations repeatedly inside of JSX `.map` loops on derived global state (like context values) leads to massive redundant nested loop execution scaling at O(N*M).
**Action:** Pre-group data via a single-pass iteration inside a `React.useMemo` hook (e.g. creating a categorized hash map lookup), and reference the cached map during rendering.
## 2026-05-23 - Memoizing CommandPalette
**Learning:** The CommandPalette had expensive array filtering operations running on every re-render (including arrow key navigation) because the computed variables were not memoized.
**Action:** Use `useMemo` for expensive computed values like `filteredCommands` derived from state that do not need to be recalculated on every keystroke or selection change.

## 2024-05-25 - Avoid O(N*M) String Reallocations in Filter Loops
**Learning:** Redundantly computing `query.toLowerCase()` on every iteration inside `.filter()` and `.map()` for large nested structures (like cases containing documents) causes significant O(N*M) string reallocations, which can measurably block the main thread.
**Action:** Always extract invariant computations (like `.toLowerCase()`) to a variable outside loop iterations before using it inside `.filter()` or `.map()` when building search features.

## 2026-05-26 - Memoizing filtered list in list components
**Learning:** Component `Cases` (like `Clients`) suffered from unmemoized filtering that ran on every single render. Since it depends on large collections `cases` and `clients` along with search queries, the O(N) array allocation paired with redundant string reallocation was heavily degrading performance.
**Action:** Memoize large filtered lists using `React.useMemo()` to avoid re-evaluating the array and string reallocations on irrelevant state changes or component re-renders.
## 2026-05-27 - Memoizing Sidebar sections search
**Learning:** The Sidebar had unmemoized lowercase computations for filtering search queries which forced O(N*M) string reallocations on every render, lagging UI.
**Action:** Extract `searchQuery.toLowerCase()` outside of mapping and filtering array iterations to stop redundantly generating lowercase versions over and over.

## 2024-05-18 - Avoid redundant inline array filtering in JSX
**Learning:** Found multiple instances where the exact same `.filter()` operation was executed sequentially inline during JSX render blocks (e.g. `{items.filter(x).length === 0 ? (...) : items.filter(x).map(...)}`). This repeatedly re-allocates memory and re-evaluates the array, scaling an O(N) operation to O(k*N) on every render unnecessarily.
**Action:** Extract repeated `.filter()` or `.map()` operations to `useMemo` blocks at the top of the component to cache the derived arrays and reference the cached variable inside JSX.

## 2024-05-28 - Unmemoized Context-Dependent Arrays
**Learning:** The Dashboard component performed multiple sequential array iterations (`cases.reduce`, `cases.filter`, `getCasesApproachingLimitation`) directly in the render body. Because `cases` is derived from a global context provider (`useLegalStore`), any unrelated state change in that provider forces these heavy computations to re-evaluate unnecessarily.
**Action:** Always wrap derived state arrays with `useMemo` when they depend on a global context object, ensuring re-calculation only occurs when the specific dependency reference changes.
## 2024-05-29 - Memoizing Global Context Computed Properties
**Learning:** `LegalStoreContext` exposed a `getAnalytics` function which performed multiple heavy O(N) array loops to compute analytics statistics. Because it returned a new object literal every time it was called, components reading this value would re-render needlessly, and the O(N) computations executed frequently inside the context block.
**Action:** Always wrap heavy context getter calculations using `useMemo` with their specific dependencies, and expose the getter via `useCallback` returning the memoized value.
## 2026-05-30 - Memoizing Context-Dependent Arrays on every keystroke
**Learning:** The Sidebar component recalculated notification badge counts (involving `getCasesApproachingLimitation` and `tasks.filter`) on every render. Because these derivations depend on `cases` and `tasks` from a global context provider (`useLegalStore`), but this component also contained a local `searchQuery` state, typing in the search bar forced these heavy O(N) recalculations on every keystroke.
**Action:** Always wrap context-dependent array operations in `useMemo` when they coexist with unrelated local state (like input queries) to prevent unnecessary recalculations on unrelated state updates.
## 2024-06-25 - Context State Derivation Optimization
**Learning:** Found multiple instances of O(N*M) runtime complexity in global state aggregations (e.g., `memoizedAnalytics` computing nested `invoices.filter` multiple times inside loops or calculating invoice totals inline during case categorization). Because `LegalStoreContext` recalculates dependencies dynamically, repeated `Array.filter` iterations over `invoices` or `clients.find` significantly impacted main thread load for large case datasets.
**Action:** Extract nested loops by using a single pass to map dependencies (e.g., `invoiceTotalsByCase` or `clientMap`) using `new Map()` lookups and increment grouped distributions incrementally rather than passing `filter` on every stat property. Cache expensive derivations properly to avoid recalculation loops across large states.
