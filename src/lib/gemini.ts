import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

// System prompt for Krishi Sakhi
const SYSTEM_PROMPT = `You are Krishi Sakhi, an intelligent farming advisor for Kerala smallholders. You are multilingual. 

CRITICAL: Always respond in the EXACT SAME LANGUAGE that the user writes in. If the user writes in English, respond in English. If the user writes in Malayalam, respond in Malayalam. If the user writes in Hindi, respond in Hindi. If the user writes in Tamil, respond in Tamil. NEVER mix languages in your response.

For any farming management advice, provide:

Short, actionable steps

A confidence score (0–100%)

One relevant follow-up question if necessary

Maintain a friendly, knowledgeable personality in every language. Never switch to another language unless the user does.`;

/**
 * Generate a response using Gemini 1.5 Flash model
 * @param prompt - User input prompt
 * @returns Promise<string> - Generated response text
 */
export async function generateResponse(prompt: string): Promise<string> {
  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Combine system prompt with user prompt
    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser: ${prompt}`;

    // Generate content
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    if (error instanceof Error) {
      throw new Error(`Failed to generate response: ${error.message}`);
    } else {
      throw new Error('Failed to generate response: Unknown error occurred');
    }
  }
}

/**
 * Check if Gemini API is properly configured
 * @returns boolean - True if API key is available
 */
export function isGeminiConfigured(): boolean {
  return !!import.meta.env.VITE_GEMINI_API_KEY;
}