/**
 * Gemini Core Service - Server-side primary
 * This service now routes through the serverless API for security.
 * Direct client-side calls are disabled for production safety.
 */

const API_ENDPOINT = '/api/ai';

export async function runGemini(prompt: string): Promise<string> {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        prompt, 
        provider: 'gemini' 
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      
      throw error; // Rethrow to allow orchestrator to handle failover
    }

    const data = await response.json();
    return data.result || '';
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error; // Rethrow to allow orchestrator to handle failover
  }
}
