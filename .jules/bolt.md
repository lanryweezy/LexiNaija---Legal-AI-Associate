## 2026-05-23 - Memoizing CommandPalette
**Learning:** The CommandPalette had expensive array filtering operations running on every re-render (including arrow key navigation) because the computed variables were not memoized.
**Action:** Use `useMemo` for expensive computed values like `filteredCommands` derived from state that do not need to be recalculated on every keystroke or selection change.

## 2024-05-25 - Avoid O(N*M) String Reallocations in Filter Loops
**Learning:** Redundantly computing `query.toLowerCase()` on every iteration inside `.filter()` and `.map()` for large nested structures (like cases containing documents) causes significant O(N*M) string reallocations, which can measurably block the main thread.
**Action:** Always extract invariant computations (like `.toLowerCase()`) to a variable outside loop iterations before using it inside `.filter()` or `.map()` when building search features.

## 2026-05-26 - Memoizing filtered list in list components
**Learning:** Component `Cases` (like `Clients`) suffered from unmemoized filtering that ran on every single render. Since it depends on large collections `cases` and `clients` along with search queries, the O(N) array allocation paired with redundant string reallocation was heavily degrading performance.
**Action:** Memoize large filtered lists using `React.useMemo()` to avoid re-evaluating the array and string reallocations on irrelevant state changes or component re-renders.
