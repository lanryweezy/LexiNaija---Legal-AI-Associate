## 2024-05-24 - Insecure Random Number Generation
**Vulnerability:** Found multiple uses of `Math.random()` to generate IDs across the codebase (`ToastContext.tsx` and `ClientPortal.tsx`).
**Learning:** `Math.random()` is predictable and not suitable for cryptographic or robust unique ID generation. Using it can lead to predictable IDs and collisions, affecting system reliability and security.
**Prevention:** Use `crypto.randomUUID()` or `uuid` library for ID generation instead of `Math.random()` to ensure unique, unpredictable identifiers.

## 2025-01-20 - Unvalidated Link Attribute (XSS Risk)
**Vulnerability:** Found an unvalidated external link rendered dynamically (`href={selectedCase.link}`) in `src/components/CaseLawDatabase.tsx`.
**Learning:** Rendering arbitrary strings directly to `href` can lead to XSS via `javascript:` protocols, particularly when those strings come from external systems like database fetch results.
**Prevention:** Apply an inline protocol validation explicitly to dynamic link destinations, e.g. checking `.toLowerCase().startsWith('http')` and falling back to `#`.## 2026-05-27 - Secure ID Generation Enhancement
**Vulnerability:** Found over 20 uses of `Date.now().toString()` and `(Date.now() + 1).toString()` for ID generation across state contexts and components.
**Learning:** While `Math.random()` had been previously mitigated, using `Date.now()` is equally flawed as it creates predictable, non-cryptographic IDs that are prone to collision—especially when records are created simultaneously in rapid succession (e.g. bulk operations or testing scripts).
**Prevention:** Use `crypto.randomUUID()` exclusively for generating all unique identifiers within the application state or UI components instead of any timestamp-based strings.
## 2026-05-27 - Predictable ID Generation Risk (Date.now())
**Vulnerability:** Use of `Date.now()` to generate IDs for portal invitations and Paystack payment references.
**Learning:** Using `Date.now()` is predictable and exposes the app to enumeration attacks, unauthorized access guessing (invite links), and payment reference collisions, violating secure identifier generation principles.
**Prevention:** Consistently use `crypto.randomUUID()` to generate globally unique, cryptographically secure string identifiers everywhere instead of timestamp-based proxies.

## 2026-06-25 - Information Leakage in Error Handling
**Vulnerability:** Found `try...catch` blocks in `src/components/Drafter.tsx` and `src/components/Billing.tsx` dumping raw error objects to the console via `console.error(e)`.
**Learning:** Directly logging raw exception objects to the browser console can leak sensitive internal application states, stack traces, and API failure details to unauthorized users in production.
**Prevention:** Use generic error messages for client-side logging (e.g., `console.error("Failed to generate.")`) and pipe actual exception details securely through the established backend telemetry service (e.g., Sentry's `captureException`).

## 2025-02-28 - Information Leakage in Error Handling (Generic Services)
**Vulnerability:** Found multiple `catch` blocks in generic services and components (`groqService`, `geminiCore`, `caseLawEngine`, `Evidence.tsx`, `LegalStoreContext`) dumping raw error objects to the console via `console.error(error)`.
**Learning:** Directly logging raw exception objects to the browser console can leak sensitive internal application states, stack traces, network paths, or API error details to unauthorized users in production.
**Prevention:** Use generic error messages for client-side logging (e.g., `console.error("Service Error")`) and pipe actual exception details securely through the established backend telemetry service (e.g., Sentry's `captureException(error)`).

## 2026-05-27 - Blob URL Memory Leak (Denial of Service Risk)
**Vulnerability:** Found `URL.createObjectURL(blob)` calls in `src/components/ComplianceAudit.tsx` and `src/components/DocumentEditor.tsx` without corresponding `URL.revokeObjectURL(url)` cleanup after download.
**Learning:** Failing to explicitly revoke object URLs causes the browser to hold the Blob in memory indefinitely until the document unloads. In a Single Page Application (SPA), frequent file exports can lead to significant memory exhaustion, degrading performance and potentially crashing the user's browser (client-side Denial of Service).
**Prevention:** Always pair `URL.createObjectURL()` with `URL.revokeObjectURL()` immediately after the generated URL is no longer needed (e.g., after the download link is clicked and removed from the DOM).
