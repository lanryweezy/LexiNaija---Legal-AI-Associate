## 2025-03-02 - O(N*M) Overhead in Render Loops
**Learning:** Performing `Array.filter` operations repeatedly inside of JSX `.map` loops on derived global state (like context values) leads to massive redundant nested loop execution scaling at O(N*M).
**Action:** Pre-group data via a single-pass iteration inside a `React.useMemo` hook (e.g. creating a categorized hash map lookup), and reference the cached map during rendering.
