## 2024-05-23 - Add ARIA label to Theme Toggle in Sidebar
**Learning:** Found an icon-only theme toggle button lacking an accessible label. Screen reader users would just hear "button" without context on whether it's switching to light or dark mode.
**Action:** Added a dynamic `aria-label` that clarifies what action the button will perform when clicked (e.g., "Switch to light mode" or "Switch to dark mode") based on the current theme state. Always verify icon-only buttons have descriptive labels.

## 2024-05-18 - Document Editor Accessibility Validation
**Learning:** In complex UI states like document editors, interactive components (like toolbars) are often hidden behind prerequisite actions (e.g., selecting a case or precedent). Automated accessibility or visual verification of these deep states requires scripting through modal selections, not just direct navigation.
**Action:** When adding accessibility to deeply nested components, anticipate the need for complex setup state in verification scripts (e.g., selecting options in a modal to enable a 'Deploy' button) or mock the initial state directly if the architecture allows.

## 2026-05-27 - Icon-only close buttons lacking interactions
**Learning:** Found a pattern across full-page modules (e.g., Briefs, Witness, Corporate, Strategy) where the main top-right close `<X />` button is completely decorative—it lacks both an `onClick` handler to navigate out of the page and an accessible `aria-label`/`title`.
**Action:** When auditing icon-only buttons, ensure they actually serve a functional purpose (like navigating back to the dashboard) and are fully accessible via keyboard (`focus-visible` ring) and screen reader (`aria-label`).

## 2026-05-29 - Missing form associations in complex components
**Learning:** Found multiple form inputs in `Witness.tsx` that lacked `id` attributes and `htmlFor` on corresponding labels, resulting in disconnected inputs that are difficult for screen reader users to navigate. Moreover, interactive buttons such as "Copy to Clipboard" lacked explicit `aria-label`s.
**Action:** Always ensure that `id` and `htmlFor` are explicitly paired on form elements and that icon-only buttons include `aria-label`, `title`, and visible focus rings (`focus-visible:ring-2`) for both mouse and keyboard users.

## 2024-05-30 - Accessible Icon-Only Modal Close Buttons
**Learning:** Icon-only close buttons (like 'X' inside Modals) lack semantic meaning and keyboard focus visibility by default, making them difficult for screen-reader and keyboard-only users to navigate and understand their purpose.
**Action:** Always include an `aria-label` and `title` attribute for semantic meaning on icon-only buttons. Additionally, apply utility classes like `focus-visible:ring-2 focus-visible:ring-legal-gold focus:outline-none rounded-xl` to ensure clear, visible focus states for keyboard users.
## 2024-05-15 - Standardizing Action Labels
**Learning:** Found instances where common cancel actions were labeled "Abort Procedure", which could induce unnecessary cognitive load or sound overly dramatic for standard forms in a legal app.
**Action:** Standardized cancel buttons to use the universally understood "Cancel" label to improve usability and reduce user hesitation.
