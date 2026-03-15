# ===========================================
# VERCEL DEPLOYMENT GUIDE
# ===========================================
# Follow these steps to deploy LexiNaija to production

# ===========================================
# STEP 1: Push to GitHub (DONE ✅)
# ===========================================
# Your code is already pushed to:
# https://github.com/samsudeenboy/LexiNaija---Legal-AI-Associate

# ===========================================
# STEP 2: Connect to Vercel
# ===========================================
# 1. Go to https://vercel.com
# 2. Click "Add New Project"
# 3. Import your GitHub repository
# 4. Select "LexiNaija---Legal-AI-Associate"
# 5. Click "Import"

# ===========================================
# STEP 3: Configure Environment Variables
# ===========================================
# In Vercel project settings, add these environment variables:

# Client-Side (VITE_ prefix - exposed to browser)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your-key (optional)
VITE_SENTRY_DSN=https://your-sentry-dsn (optional)
VITE_APP_VERSION=1.0.0

# Server-Side (NOT exposed to browser - CRITICAL)
GEMINI_API_KEY=your-gemini-api-key-here
GROQ_API_KEY=your-groq-api-key-here

# ===========================================
# STEP 4: Build Settings
# ===========================================
# Framework Preset: Vite
# Build Command: npm run build
# Output Directory: dist
# Install Command: npm install

# ===========================================
# STEP 5: Deploy
# ===========================================
# Click "Deploy"
# Vercel will build and deploy automatically
# Deployment takes ~3-5 minutes

# ===========================================
# STEP 6: Post-Deployment
# ===========================================
# 1. Verify deployment at your Vercel URL
# 2. Test authentication flow
# 3. Test AI features (Research, Drafter)
# 4. Test S.84 certificate generation
# 5. Test LPRO calculator
# 6. Verify limitation alerts

# ===========================================
# STEP 7: Custom Domain (Optional)
# ===========================================
# 1. Go to Project Settings → Domains
# 2. Add your domain (e.g., lexinaija.com)
# 3. Configure DNS as instructed
# 4. Wait for SSL certificate (~5 minutes)

# ===========================================
# STEP 8: Production Checklist
# ===========================================
# - [ ] All environment variables set
# - [ ] Build successful
# - [ ] No console errors
# - [ ] Authentication working
# - [ ] AI features working
# - [ ] S.84 certificates generate
# - [ ] LPRO calculator works
# - [ ] Limitation alerts display
# - [ ] PWA installs correctly
# - [ ] Mobile responsive
# - [ ] Analytics configured (optional)

# ===========================================
# TROUBLESHOOTING
# ===========================================

# Build Fails:
# - Check Vercel build logs
# - Verify all dependencies install
# - Run `npm run build` locally first

# API Errors:
# - Verify GEMINI_API_KEY and GROQ_API_KEY set
# - Check API keys are valid
# - Review Vercel function logs

# Supabase Errors:
# - Verify VITE_SUPABASE_URL correct
# - Check VITE_SUPABASE_ANON_KEY valid
# - Ensure RLS policies configured

# ===========================================
# AUTOMATIC DEPLOYMENTS
# ===========================================
# After initial setup:
# - Every push to main branch auto-deploys
# - Pull requests get preview deployments
# - Failed deployments auto-rollback

# ===========================================
# VERCEL CLI (Alternative)
# ===========================================
# Install Vercel CLI:
npm install -g vercel

# Login:
vercel login

# Deploy:
vercel --prod

# ===========================================
# COST ESTIMATE
# ===========================================
# Vercel Hobby Plan: FREE
# - Unlimited deployments
# - 100GB bandwidth/month
# - 6,000 build minutes/month
# - Perfect for starting

# Vercel Pro Plan: $20/month
# - For commercial projects
# - More bandwidth and build minutes
# - Analytics included

# ===========================================
# CONTACT SUPPORT
# ===========================================
# Vercel Support: https://vercel.com/support
# LexiNaija Issues: https://github.com/samsudeenboy/LexiNaija---Legal-AI-Associate/issues
