
# LexiNaija - Legal AI Associate

> **Version 1.0.0** - Production Ready with Security Hardening

A comprehensive AI-powered legal practice management suite designed specifically for Nigerian legal practitioners. LexiNaija combines advanced AI capabilities with deep knowledge of Nigerian law to provide intelligent legal assistance, document drafting, case management, and strategic advisory services.

[![CI/CD](https://github.com/yourusername/lexinaija/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/lexinaija/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)

## 🚀 Features

### Practice Management
- **Case Strategy Advisor**: Generate SWOT analyses and litigation strategies with Nigerian legal context
- **Document Drafting**: AI-powered contract and legal document drafting compliant with Nigerian laws
- **Legal Research**: Advanced research capabilities with citations to Nigerian statutes and case law
- **Evidence Management**: Automated frontloading lists and witness statement analysis
- **Billing & Invoicing**: Professional fee note generation with Nigerian legal billing terminology

### Corporate & Compliance
- **Corporate Compliance**: CAMA 2020 compliance advice and corporate document drafting
- **Practice Management**: Docket management, client tracking, and conflict checking
- **Audit Trail**: Evidence Act 2011 compliant immutable audit logs

### AI-Powered Tools
- **Smart Briefs**: Automated legal brief drafting
- **Witness Companion**: Cross-examination analysis
- **Case Law Database**: Searchable Nigerian case law
- **Compliance Audit**: Automated compliance checking

## 🏛️ Nigerian Legal Framework Integration

LexiNaija is specifically trained on:
- The Constitution of the Federal Republic of Nigeria 1999 (as amended)
- The Companies and Allied Matters Act (CAMA) 2020
- The Evidence Act 2011
- Land Use Act
- Key Supreme Court of Nigeria judgments
- Criminal Code and Penal Code
- Legal Practitioners (Remuneration for Legal Documentation and Other Land Matters) Order

## 🛠️ Installation & Setup

**Prerequisites:**
- Node.js 18+ 
- npm or yarn
- Git
- Supabase account (for cloud features)

### 1. Clone and Install

```bash
git clone https://github.com/YOUR_USERNAME/lexinaija.git
cd lexinaija
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```bash
# Required - Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Required - AI Services (server-side only)
GEMINI_API_KEY=your-gemini-key
GROQ_API_KEY=your-groq-key

# Optional - Payments
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your-key

# Optional - Error Tracking
VITE_SENTRY_DSN=https://your-sentry-dsn
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
npm run preview
```

## 📖 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (with env validation) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run validate-env` | Validate environment variables |
| `npm test` | Run tests (Vitest) |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run typecheck` | Run TypeScript type checking |

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository on [Vercel](https://vercel.com)
3. Set environment variables in Vercel dashboard:
   - `GEMINI_API_KEY`
   - `GROQ_API_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

### Manual Deployment

```bash
npm run build
# Deploy the dist/ folder to your hosting
```

## 🛡️ Security Features

### Implemented

- ✅ **Server-side AI API routes** - No client-side API key exposure
- ✅ **Rate limiting** - 100 requests/hour per API key
- ✅ **Email verification** - Required for user accounts
- ✅ **Strong passwords** - 10+ characters with complexity requirements
- ✅ **Security headers** - CSP, X-Frame-Options, etc.
- ✅ **Row Level Security** - Supabase RLS policies
- ✅ **Audit logging** - Evidence Act 2011 compliant
- ✅ **Environment validation** - Build-time checks

### Security Policy

See [SECURITY.md](./SECURITY.md) for:
- Reporting vulnerabilities
- Security best practices
- Compliance requirements

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test Dashboard
```

## 📁 Project Structure

```
lexinaija/
├── api/                 # Serverless functions
│   └── ai.ts           # AI API route
├── src/
│   ├── components/     # React components
│   ├── contexts/       # React Context providers
│   ├── services/       # API clients, utilities
│   ├── test/           # Test setup
│   └── types.ts        # TypeScript types
├── supabase/
│   ├── migrations/     # Database migrations
│   └── config.toml     # Supabase config
├── scripts/
│   └── validate-env.js # Env validation
└── .github/
    └── workflows/
        └── ci.yml      # CI/CD pipeline
```

## 🔧 Configuration

### Supabase Setup

Run migrations:

```bash
npx supabase db push
```

See `supabase_schema.sql` for the complete schema.

### Environment Variables

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `VITE_SUPABASE_URL` | Client | ✅ | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Client | ✅ | Supabase anonymous key |
| `GEMINI_API_KEY` | Server | ✅ | Google Gemini API key |
| `GROQ_API_KEY` | Server | ✅ | Groq API key |
| `VITE_PAYSTACK_PUBLIC_KEY` | Client | ❌ | Paystack payment key |
| `VITE_SENTRY_DSN` | Client | ❌ | Sentry error tracking |

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- Development setup
- Code style guidelines
- Pull request process
- Security guidelines

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## ⚠️ Legal Disclaimer

This application is designed to **assist** legal practitioners but **does not constitute legal advice**. 

- Always verify AI-generated content
- Consult relevant statutes and case law
- The developers are not responsible for legal decisions made based on the application's output
- This is a tool for legal professionals, not a replacement for legal expertise

## 🙏 Acknowledgments

### Technologies
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **Supabase** - Backend
- **Google Gemini** - Primary AI
- **Groq** - AI failover
- **Paystack** - Payments
- **Sentry** - Error tracking

### Designed for
- Nigerian legal system
- Legal practitioners
- Law firms
- Corporate legal departments

## 📞 Support

- **Documentation**: See wiki in repository
- **Issues**: [GitHub Issues](https://github.com/yourusername/lexinaija/issues)
- **Security**: [SECURITY.md](./SECURITY.md)
- **Email**: support@lexinaija.com

---

**Built with ❤️ for the Nigerian legal community**

**Last Updated**: March 14, 2024
