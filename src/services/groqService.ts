/**
 * Groq Service - Server-side fallback
 * This service now routes through the serverless API for security.
 * Direct client-side calls are disabled for production safety.
 */

const API_ENDPOINT = '/api/ai';

export const runGroq = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        prompt, 
        provider: 'groq' 
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      
      throw new Error(error.message || 'Groq service unavailable');
    }

    const data = await response.json();
    return data.result || '';
  } catch (error: any) {
    console.error("Groq API Error:", error);
    throw new Error("Neural failover to Groq failed.");
  }
};
