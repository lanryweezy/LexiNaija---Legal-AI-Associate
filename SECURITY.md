# Security Policy

## 🔒 Security Overview

LexiNaija is a legal practice management application handling sensitive client data. We take security seriously and appreciate your help in keeping our users safe.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

**DO NOT** create a public GitHub issue for security vulnerabilities.

### Private Disclosure Process

1. **Email**: Send details to `security@lexinaija.com` (or the maintainer's email)
2. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
3. **Expect**: A response within 48 hours acknowledging receipt
4. **Timeline**: We aim to resolve critical issues within 7 days

### What to Expect

- **Initial Response**: Within 48 hours
- **Status Updates**: Weekly until resolution
- **Resolution**: Public disclosure after fix + 30 days (to allow users to update)

## Security Best Practices for Users

### Environment Variables

**NEVER commit `.env.local` to version control!**

Required environment variables:
```bash
# Client-side (VITE_ prefix)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Server-side (sensitive - never expose to client)
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
```

### Production Deployment Checklist

- [ ] Enable email verification in Supabase
- [ ] Set strong password requirements (minimum 10 characters)
- [ ] Configure Row Level Security (RLS) policies
- [ ] Enable HTTPS/TLS for all connections
- [ ] Set up regular database backups
- [ ] Configure rate limiting on API routes
- [ ] Review and restrict CORS origins
- [ ] Enable audit logging for compliance

### Data Protection

1. **Client Data**: All client information should be encrypted at rest
2. **API Keys**: Never expose API keys in client-side code
3. **Sessions**: Use secure, HTTP-only cookies for authentication
4. **Backups**: Regular encrypted backups of all data

## Known Security Features

### Implemented

- ✅ Server-side AI API routes (no client-side API key exposure)
- ✅ Rate limiting on AI endpoints (100 requests/hour)
- ✅ Row Level Security (RLS) on Supabase tables
- ✅ Email verification for user accounts
- ✅ Strong password requirements (10+ characters, mixed case + numbers)
- ✅ Security headers (CSP, X-Frame-Options, etc.)
- ✅ Audit logging for compliance (Evidence Act 2011)
- ✅ Environment variable validation

### Planned

- [ ] End-to-end encryption for documents
- [ ] Two-factor authentication (2FA)
- [ ] IP-based access restrictions
- [ ] Automated security scanning in CI/CD
- [ ] Regular penetration testing

## Compliance

### Nigerian Legal Requirements

- **Evidence Act 2011**: Section 84 compliance for electronic evidence
- **NDPR (Nigeria Data Protection Regulation)**: Data processing compliance
- **Legal Practitioners Act**: Client confidentiality requirements

### Data Residency

All data should be stored in compliance with Nigerian data sovereignty requirements.

## Security Headers

The application implements the following security headers:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## Third-Party Dependencies

We regularly audit and update dependencies. Security updates are prioritized:

- **Critical**: Within 24 hours
- **High**: Within 7 days
- **Medium**: Within 30 days

## Contact

- **Security Issues**: `security@lexinaija.com`
- **General Questions**: `support@lexinaija.com`

---

**Last Updated**: March 2024
