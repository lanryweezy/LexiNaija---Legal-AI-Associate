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
