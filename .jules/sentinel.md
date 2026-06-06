## 2024-03-03 - DoS Vulnerability via Shared Rate Limit Key
**Vulnerability:** The rate limit identifier in `api/ai.ts` used the server-side AI API key (`geminiKey || groqKey`) instead of the client's identifier (like IP).
**Learning:** This created a global rate limit pool where any single user making 100 requests could exhaust the limit for all users across the entire application, causing a Denial of Service.
**Prevention:** Always use client-specific identifiers like `req.headers['x-forwarded-for']` or `req.socket?.remoteAddress` for in-memory rate limiting to ensure limits apply per-user/IP.

## 2024-06-05 - Webhook Forgery via Missing Signature Validation
**Vulnerability:** The Paystack webhook edge function skipped HMAC signature verification, blindly parsing the request body. This allowed any unauthenticated attacker to spoof a `charge.success` event and artificially inflate account credits or activate subscription tiers for any email address without actually making a payment.
**Learning:** Comments indicating "Actual verification logic omitted for brevity" in production-ready edge functions leave critical billing endpoints exposed to trivially exploitable spoofing attacks.
**Prevention:** Always cryptographically verify webhook signatures using `crypto.subtle` or provider SDKs to authenticate that incoming payloads genuinely originate from the trusted provider (e.g., Paystack, Stripe) before performing sensitive state updates.

## 2024-06-06 - Sensitive Information Leakage via Error Messages
**Vulnerability:** The serverless AI endpoint (`api/ai.ts`) was directly passing raw `error.message` from downstream services to the client in JSON responses during 500 errors.
**Learning:** This could expose internal implementation details, downstream API provider structures, or potentially sensitive internal state information that an attacker could leverage.
**Prevention:** Always sanitize error messages at the API boundary, logging raw errors server-side while returning generic, safe fallback messages (e.g., "An unexpected error occurred") to clients.
