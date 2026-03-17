# Changelog

All notable changes to LexiNaija will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Security
- 🔒 **BREAKING**: Moved AI API calls to serverless endpoints - API keys no longer exposed to client
- 🔒 **BREAKING**: Removed `dangerouslyAllowBrowser` from Groq SDK configuration
- Added rate limiting to AI endpoints (100 requests/hour)
- Implemented environment variable validation at build time
- Added security headers (CSP, X-Frame-Options, X-XSS-Protection)
- Enabled email verification for user accounts
- Increased minimum password length to 10 characters
- Added password complexity requirements

### Added
- Serverless API route for AI calls (`/api/ai`)
- Environment validation script
- Sentry error tracking integration
- GitHub Actions CI/CD pipeline
- Vitest testing framework
- MIT License
- SECURITY.md with security policy
- CONTRIBUTING.md with contribution guidelines
- TypeScript type definitions for React and React DOM

### Changed
- Updated version to 1.0.0 (production ready)
- Improved build optimization with code splitting
- Enhanced error boundary with Sentry integration
- Updated Supabase auth configuration for better security

### Fixed
- Duplicate useEffect in LegalStoreContext
- API key exposure in client-side code
- Missing security headers in development server

### Removed
- Direct client-side AI SDK initialization
- Insecure browser configuration for Groq

## [0.0.0] - Initial Development Version

### Features
- Case Strategy Advisor with SWOT analysis
- Document Drafting with Nigerian legal compliance
- Legal Research with Nigerian statute citations
- Evidence Management with frontloading lists
- Billing & Invoicing with Nigerian legal billing
- Corporate Compliance (CAMA 2020)
- Practice Management (docket, clients, conflicts)
- Client Portal
- Analytics Dashboard
- PWA support

### Tech Stack
- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Supabase
- Google Gemini AI
- Groq (failover)
- Paystack

---

## Version History

- **1.0.0** (2024-03-14) - Production Release with Security Hardening
- **0.0.0** (2024-01-XX) - Initial Development Release

---

**Last Updated**: March 14, 2024
