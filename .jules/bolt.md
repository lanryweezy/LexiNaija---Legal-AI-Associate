## 2026-05-23 - Memoizing CommandPalette
**Learning:** The CommandPalette had expensive array filtering operations running on every re-render (including arrow key navigation) because the computed variables were not memoized.
**Action:** Use `useMemo` for expensive computed values like `filteredCommands` derived from state that do not need to be recalculated on every keystroke or selection change.
