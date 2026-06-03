## 2024-03-03 - DoS Vulnerability via Shared Rate Limit Key
**Vulnerability:** The rate limit identifier in `api/ai.ts` used the server-side AI API key (`geminiKey || groqKey`) instead of the client's identifier (like IP).
**Learning:** This created a global rate limit pool where any single user making 100 requests could exhaust the limit for all users across the entire application, causing a Denial of Service.
**Prevention:** Always use client-specific identifiers like `req.headers['x-forwarded-for']` or `req.socket?.remoteAddress` for in-memory rate limiting to ensure limits apply per-user/IP.
