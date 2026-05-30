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
