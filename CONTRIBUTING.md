# Contributing to LexiNaija

Thank you for your interest in contributing to LexiNaija! This document provides guidelines and instructions for contributing.

## 🎯 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Prioritize user security and privacy
- Maintain the Nigerian legal context focus

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git
- Supabase account (for cloud features)
- Gemini API key (for AI features)

### Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/lexinaija.git
   cd lexinaija
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## 📝 Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Use functional components with hooks (React)
- Keep components small and focused

### Commit Messages

We follow the Conventional Commits specification:

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

Examples:
```bash
git commit -m "feat: Add witness statement analysis"
git commit -m "fix: Resolve authentication state sync issue"
```

### Testing

- Write tests for new features
- Maintain >50% code coverage
- Run tests before submitting PR:
  ```bash
  npm test
  ```

### Security

- Never commit API keys or secrets
- Use environment variables for sensitive data
- Follow security best practices in SECURITY.md

## 🔄 Pull Request Process

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write code
   - Add tests
   - Update documentation

3. **Run Checks**
   ```bash
   npm run typecheck
   npm run lint
   npm test
   npm run build
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: Your descriptive message"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create PR on GitHub
   ```

## 📦 Feature Requests

Open an issue with:
- Feature description
- Use case
- Expected behavior
- Screenshots/mockups (if applicable)

## 🐛 Bug Reports

Open an issue with:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment (OS, browser, Node version)
- Screenshots/logs

## 🏗️ Architecture Overview

### Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4
- **Build**: Vite
- **Backend**: Supabase (PostgreSQL + Auth)
- **AI**: Google Gemini + Groq (failover)
- **Payments**: Paystack
- **Error Tracking**: Sentry

### Project Structure

```
src/
  components/    # React components
  contexts/      # React Context providers
  services/      # API clients, utilities
  test/          # Test setup and utilities
  types.ts       # TypeScript types
api/             # Serverless functions
supabase/        # Supabase config and migrations
```

## 📚 Documentation

- Update README.md for user-facing changes
- Update this file for contributor changes
- Add JSDoc comments for complex functions
- Document environment variables in .env.example

## 🎨 Component Guidelines

### Naming

- Components: PascalCase (e.g., `Dashboard.tsx`)
- Utilities: camelCase (e.g., `geminiService.ts`)
- Types: PascalCase (e.g., `Case`, `Client`)

### File Organization

```typescript
// Imports
import React from 'react';
import { SomeComponent } from './SomeComponent';

// Types
interface Props {
  // ...
}

// Component
export const SomeComponent: React.FC<Props> = () => {
  // ...
};
```

### Styling

- Use Tailwind CSS utility classes
- Follow the legal theme (legal-900, legal-gold, etc.)
- Maintain responsive design

## 🔐 Security Guidelines

1. **Authentication**: Always check auth state before accessing user data
2. **Authorization**: Implement RLS policies in Supabase
3. **Data Protection**: Never expose sensitive data in client code
4. **API Keys**: Use serverless functions for API calls

## 📈 Performance

- Lazy load components
- Optimize images
- Use React.memo for expensive components
- Implement proper caching

## 🌟 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Annual contributor highlights

## ❓ Questions?

- Open a discussion on GitHub
- Email: support@lexinaija.com

---

**Last Updated**: March 2024
