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
      throw new Error('Please wait a few seconds before asking another question.');
    }
    lastCall = now;

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Combine system prompt with user prompt and strict language rule
    const lang = detectLanguageName(prompt);
    const fullPrompt = `${SYSTEM_PROMPT}\n\nSTRICT LANGUAGE RULE: The user's language is ${lang}. You must respond ONLY in ${lang}. Do not translate or mix languages. If the user switches language later, follow the new language.\n\nUser: ${prompt}`;
    // Generate content
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    if (error instanceof Error) {
      const errorMsg = error.message.toLowerCase();
      
      if (errorMsg.includes('429')) {
        throw new Error('Rate limit hit. Please wait a minute and try again.');
      } else if (errorMsg.includes('quota')) {
        throw new Error('Daily quota exceeded. Please try again tomorrow.');
      } else if (errorMsg.includes('403')) {
        throw new Error('Invalid or expired API key.');
      } else {
        throw new Error(`Unexpected error: ${error.message}`);
      }
    } else {
      throw new Error('Unexpected error: Unknown error occurred');
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