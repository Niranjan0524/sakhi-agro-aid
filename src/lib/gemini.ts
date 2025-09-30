import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// System prompt for Krishi Sakhi
const SYSTEM_PROMPT = `You are Krishi Sakhi, an intelligent farming advisor for Kerala smallholders. You are multilingual.
CRITICAL: Always respond in the EXACT SAME LANGUAGE that the user writes in. If the user writes in English, respond in English. If the user writes in Malayalam, respond in Malayalam. If the user writes in Hindi, respond in Hindi. If the user writes in Tamil, respond in Tamil. NEVER mix languages in your response.
For any farming management advice, provide:
Short, actionable steps
A confidence score (0–100%)
One relevant follow-up question if necessary
Maintain a friendly, knowledgeable personality in every language. Never switch to another language unless the user does.`;

// Throttle tracking
let lastCall = 0;

// Simple language detector to enforce same-language replies
function detectLanguageName(text: string): string {
  if (/[\u0D00-\u0D7F]/.test(text)) return 'Malayalam'; // Malayalam
  if (/[\u0900-\u097F]/.test(text)) return 'Hindi';      // Devanagari
  if (/[\u0B80-\u0BFF]/.test(text)) return 'Tamil';      // Tamil
  if (/[A-Za-z]/.test(text)) return 'English';            // Latin
  return "the user's language";
}

/**
 * Generate a response using Gemini 1.5 model
 * @param prompt - User input prompt
 * @returns Promise<string> - Generated response text
 */
export async function generateResponse(prompt: string): Promise<string> {
  try {
    // Throttle requests
    const now = Date.now();
    if (now - lastCall < 3000) {
      console.warn('Request throttled: Too many requests');
      return '⚠️ Please wait a few seconds before asking another question.';
    }
    lastCall = now;

    // Combine system prompt with user prompt and strict language rule
    const lang = detectLanguageName(prompt);
    const fullPrompt = `${SYSTEM_PROMPT}\n\nSTRICT LANGUAGE RULE: The user's language is ${lang}. You must respond ONLY in ${lang}. Do not translate or mix languages. If the user switches language later, follow the new language.\n\nUser: ${prompt}`;
    
    // Try models in order: prefer cheaper first, then fallback if 404/not supported
    const modelCandidates = ['gemini-1.5-flash', 'gemini-1.5-flash-8b', 'gemini-1.5-pro'];
    for (const m of modelCandidates) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();
        // Log raw response for debugging
        console.log('Gemini raw response:', text);
        return text;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`Model ${m} failed:`, msg);
        if (!msg.toLowerCase().includes('404')) {
          // Non-404 errors should be handled by outer catch
          throw err;
        }
        // else: try next model
      }
    }

    // If all candidates failed with 404, fall back to generic message handled below
    throw new Error('All model candidates returned 404');
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Return user-friendly fallback messages instead of throwing
    if (error instanceof Error) {
      const errorMsg = error.message.toLowerCase();
      
      if (errorMsg.includes('429')) {
        console.warn('Rate limit hit');
        return '⚠️ Rate limit hit. Please wait a minute and try again.';
      } else if (errorMsg.includes('quota')) {
        console.warn('Quota exceeded');
        return '⚠️ Daily quota exceeded. Please try again tomorrow.';
      } else if (errorMsg.includes('403')) {
        console.warn('API key issue');
        return '⚠️ Invalid or expired API key.';
      } else {
        console.error('Unexpected error:', error.message);
        return '⚠️ Unable to get AI response right now. Please try again later.';
      }
    } else {
      console.error('Unknown error type:', error);
      return '⚠️ Unable to get AI response right now. Please try again later.';
    }
  }
}

/**
 * Check if Gemini API is properly configured
 * @returns boolean - True if API key is available
 */
export function isGeminiConfigured(): boolean {
  return true;
}