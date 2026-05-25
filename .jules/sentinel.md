## 2024-05-24 - Insecure Random Number Generation
**Vulnerability:** Found multiple uses of `Math.random()` to generate IDs across the codebase (`ToastContext.tsx` and `ClientPortal.tsx`).
**Learning:** `Math.random()` is predictable and not suitable for cryptographic or robust unique ID generation. Using it can lead to predictable IDs and collisions, affecting system reliability and security.
**Prevention:** Use `crypto.randomUUID()` or `uuid` library for ID generation instead of `Math.random()` to ensure unique, unpredictable identifiers.

## 2025-01-20 - Unvalidated Link Attribute (XSS Risk)
**Vulnerability:** Found an unvalidated external link rendered dynamically (`href={selectedCase.link}`) in `src/components/CaseLawDatabase.tsx`.
**Learning:** Rendering arbitrary strings directly to `href` can lead to XSS via `javascript:` protocols, particularly when those strings come from external systems like database fetch results.
**Prevention:** Apply an inline protocol validation explicitly to dynamic link destinations, e.g. checking `.toLowerCase().startsWith('http')` and falling back to `#`.