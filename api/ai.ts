import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

// Rate limiting store (in-memory for serverless)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = {
  MAX_REQUESTS: 100,
  WINDOW_MS: 60 * 60 * 1000, // 1 hour
};

function checkRateLimit(apiKey: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitStore.get(apiKey);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(apiKey, { count: 1, resetTime: now + RATE_LIMIT.WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT.MAX_REQUESTS - 1 };
  }

  if (record.count >= RATE_LIMIT.MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT.MAX_REQUESTS - record.count };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, provider = 'gemini' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Validate API keys exist on server
    const geminiKey = process.env.GEMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    if (!geminiKey && !groqKey) {
      return res.status(500).json({ 
        error: 'No AI providers configured',
        message: 'Server administrator must configure GEMINI_API_KEY or GROQ_API_KEY'
      });
    }

    // Rate limiting
    const rateLimit = checkRateLimit(geminiKey || groqKey || 'default');
    res.setHeader('X-RateLimit-Limit', RATE_LIMIT.MAX_REQUESTS.toString());
    res.setHeader('X-RateLimit-Remaining', rateLimit.remaining.toString());

    if (!rateLimit.allowed) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((rateLimitStore.get(geminiKey || groqKey || 'default')?.resetTime || Date.now()) / 1000)
      });
    }

    let result: string;

    // Try primary provider (Gemini)
    if (provider === 'gemini' && geminiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const response = await model.generateContent(prompt);
        result = response.response.text();
      } catch (geminiError) {
        console.warn('Gemini failed, falling back to Groq:', geminiError);
        
        // Fallback to Groq
        if (groqKey) {
          const groq = new Groq({ apiKey: groqKey });
          const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 4096,
            top_p: 1,
            stream: false,
          });
          result = chatCompletion.choices[0]?.message?.content || '';
        } else {
          throw geminiError;
        }
      }
    } else if (groqKey) {
      const groq = new Groq({ apiKey: groqKey });
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 4096,
        top_p: 1,
        stream: false,
      });
      result = chatCompletion.choices[0]?.message?.content || '';
    } else {
      return res.status(500).json({ error: 'No available AI provider' });
    }

    return res.status(200).json({ result });
  } catch (error: any) {
    console.error('AI API Error:', error);
    return res.status(500).json({ 
      error: 'AI service unavailable',
      message: error.message || 'Failed to generate response'
    });
  }
}
