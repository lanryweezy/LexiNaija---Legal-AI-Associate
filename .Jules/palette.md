## 2024-05-23 - Add ARIA label to Theme Toggle in Sidebar
**Learning:** Found an icon-only theme toggle button lacking an accessible label. Screen reader users would just hear "button" without context on whether it's switching to light or dark mode.
**Action:** Added a dynamic `aria-label` that clarifies what action the button will perform when clicked (e.g., "Switch to light mode" or "Switch to dark mode") based on the current theme state. Always verify icon-only buttons have descriptive labels.
