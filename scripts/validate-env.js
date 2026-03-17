#!/usr/bin/env node

/**
 * Environment Variable Validation Script
 * Ensures all required environment variables are set before build/runtime
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Required environment variables
const REQUIRED_VARS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
];

const SERVER_REQUIRED_VARS = [
  'GEMINI_API_KEY',
  'GROQ_API_KEY',
];

const OPTIONAL_VARS = [
  'VITE_PAYSTACK_PUBLIC_KEY',
  'VITE_SENTRY_DSN',
];

console.log('🔍 Validating environment variables...\n');

let hasErrors = false;
let hasWarnings = false;

// Check for .env file
try {
  const envContent = readFileSync(join(projectRoot, '.env.local'), 'utf-8');
  console.log('✅ Found .env.local file\n');
} catch (error) {
  console.log('⚠️  WARNING: .env.local file not found\n');
  console.log('   Create a .env.local file based on .env.example\n');
  hasWarnings = true;
}

// Check required VITE_ variables
console.log('📋 Checking required VITE_* variables:');
REQUIRED_VARS.forEach((variable) => {
  const value = process.env[variable];
  if (!value || value === 'your_' || value.includes('placeholder')) {
    console.log(`   ❌ ${variable}: Not set or invalid`);
    hasErrors = true;
  } else if (value.length < 20) {
    console.log(`   ⚠️  ${variable}: Set but may be invalid (too short)`);
    hasWarnings = true;
  } else {
    console.log(`   ✅ ${variable}: Set`);
  }
});

// Check server-side variables (warnings only for client build)
console.log('\n🔐 Checking server-side variables (for API routes):');
SERVER_REQUIRED_VARS.forEach((variable) => {
  const value = process.env[variable];
  if (!value || value === 'your_' || value.includes('placeholder')) {
    console.log(`   ⚠️  ${variable}: Not set - AI features will use fallback mode`);
    hasWarnings = true;
  } else {
    console.log(`   ✅ ${variable}: Set`);
  }
});

// Check optional variables
console.log('\n📦 Checking optional variables:');
OPTIONAL_VARS.forEach((variable) => {
  const value = process.env[variable];
  if (!value) {
    console.log(`   ⚪ ${variable}: Not set (optional)`);
  } else {
    console.log(`   ✅ ${variable}: Set`);
  }
});

// Security checks
console.log('\n🛡️  Security checks:');

// Check for exposed secrets in code
try {
  const groqService = readFileSync(join(projectRoot, 'src', 'services', 'groqService.ts'), 'utf-8');
  if (groqService.includes('dangerouslyAllowBrowser')) {
    console.log('   ❌ SECURITY: groqService.ts still contains dangerouslyAllowBrowser');
    hasErrors = true;
  } else {
    console.log('   ✅ groqService.ts: No dangerous browser settings');
  }
} catch (error) {
  console.log('   ⚪  Could not check groqService.ts');
}

try {
  const geminiCore = readFileSync(join(projectRoot, 'src', 'services', 'geminiCore.ts'), 'utf-8');
  if (geminiCore.includes('VITE_GEMINI_API_KEY')) {
    console.log('   ❌ SECURITY: geminiCore.ts exposes API key in client code');
    hasErrors = true;
  } else {
    console.log('   ✅ geminiCore.ts: API key properly secured');
  }
} catch (error) {
  console.log('   ⚪  Could not check geminiCore.ts');
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ VALIDATION FAILED');
  console.log('\nPlease fix the errors above before continuing.');
  console.log('Copy .env.example to .env.local and fill in the required values.\n');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  VALIDATION PASSED WITH WARNINGS');
  console.log('\nSome optional features may not work correctly.');
  console.log('Review warnings above for details.\n');
  process.exit(0);
} else {
  console.log('✅ VALIDATION PASSED');
  console.log('\nAll required environment variables are properly configured.\n');
  process.exit(0);
}
