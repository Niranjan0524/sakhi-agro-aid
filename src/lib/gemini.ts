import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

// System prompt for Krishi Sakhi
const SYSTEM_PROMPT = `You are Krishi Sakhi — a Malayalam-speaking farming advisor for Kerala smallholders. Always reply in Malayalam. For any management action, provide short steps, a confidence score (0–100%), and ask one follow-up question if necessary.`;

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