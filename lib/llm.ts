/**
 * LLM integration with OpenRouter
 * Phase D: AI-powered JSON generation
 */

import OpenAI from 'openai';

// Available models on OpenRouter
// Using paid models that are reliable and won't hit rate limits
export const AVAILABLE_MODELS = {
  'openai/gpt-4o-mini': {
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    cost: '$0.15/1M tokens',
    speed: 'Fast',
    quality: 'Good',
    description: 'Recommended - Reliable and affordable',
  },
  'openai/gpt-3.5-turbo': {
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    cost: '$0.50/1M tokens',
    speed: 'Very Fast',
    quality: 'Good',
    description: 'Fast and cheap, great for testing',
  },
  'anthropic/claude-3-haiku': {
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    cost: '$0.25/1M tokens',
    speed: 'Very Fast',
    quality: 'Good',
    description: 'Fast and affordable Claude model',
  },
  'google/gemini-flash-1.5': {
    name: 'Gemini Flash 1.5',
    provider: 'Google',
    cost: '$0.075/1M tokens',
    speed: 'Very Fast',
    quality: 'Good',
    description: 'Cheapest option, very fast',
  },
  'qwen/qwen3-235b-a22b:free':{
    name: 'Qwen 3 235B A22B',
    provider: 'Qwen',
    cost: 'FREE',
    speed: 'Very Fast',
    quality: 'Good',
    description: 'Free tier, very fast',
  }
} as const;

export type ModelId = keyof typeof AVAILABLE_MODELS;

export const DEFAULT_MODEL: ModelId = 'openai/gpt-4o-mini';

/**
 * Initialize OpenRouter client
 */
function getOpenRouterClient(): OpenAI {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error(
      'OPENROUTER_API_KEY is not set. Get one at https://openrouter.ai'
    );
  }

  return new OpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': process.env.OPENROUTER_SITE_URL || '',
      'X-Title': process.env.OPENROUTER_SITE_NAME || 'GenAPI',
    },
  });
}

/**
 * System prompt for JSON generation
 */
const SYSTEM_PROMPT = `You are a JSON generator. You MUST output ONLY valid JSON (no preamble, no markdown, no explanations).

Rules:
1. Output ONLY valid JSON - nothing else
2. Do not include markdown code blocks or \`\`\`json
3. Do not include explanations before or after the JSON
4. If asked for an array, return a JSON array
5. If asked for an object, return a JSON object
6. Generate realistic, varied data that matches the user's request
7. Follow the exact schema or structure requested`;

/**
 * Extract JSON from LLM response
 * Handles cases where LLM adds markdown or extra text
 */
function extractJSON(text: string): any {
  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch {
    // Try to find JSON block in markdown
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1].trim());
    }

    // Try to find any JSON object or array
    const objectMatch = text.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      return JSON.parse(objectMatch[0]);
    }

    const arrayMatch = text.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      return JSON.parse(arrayMatch[0]);
    }

    throw new Error('No valid JSON found in response');
  }
}

/**
 * Generate JSON using OpenRouter LLM
 */
export async function generateJSON(
  prompt: string,
  options: {
    items?: number;
    model?: ModelId;
    maxRetries?: number;
  } = {}
): Promise<any> {
  const {
    items = 10,
    model = DEFAULT_MODEL,
    maxRetries = 3,
  } = options;

  const client = getOpenRouterClient();

  // Build user prompt
  const userPrompt = `Generate JSON data that matches this request: "${prompt}"

${items ? `Generate exactly ${items} items if the output is an array.` : ''}

Output only the JSON, nothing else.`;

  let lastError: Error | null = null;

  // Retry loop
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `[LLM] Attempt ${attempt}/${maxRetries} with model ${model}`
      );

      const response = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new Error('Empty response from LLM');
      }

      console.log(`[LLM] Raw response length: ${content.length} chars`);

      // Extract and validate JSON
      const json = extractJSON(content);

      console.log(`[LLM] Successfully parsed JSON`);

      return json;
    } catch (error) {
      lastError = error as Error;
      console.error(`[LLM] Attempt ${attempt} failed:`, error);

      // If this was the last attempt, throw
      if (attempt === maxRetries) {
        break;
      }

      // Wait before retry (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * Math.pow(2, attempt - 1))
      );
    }
  }

  // All retries failed
  throw new Error(
    `Failed to generate valid JSON after ${maxRetries} attempts: ${lastError?.message}`
  );
}

/**
 * Test function to verify OpenRouter connection
 */
export async function testOpenRouterConnection(): Promise<boolean> {
  try {
    const client = getOpenRouterClient();
    const response = await client.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [{ role: 'user', content: 'Return a JSON object: {"test": true}' }],
      max_tokens: 50,
    });

    return !!response.choices[0]?.message?.content;
  } catch (error) {
    console.error('[LLM] Connection test failed:', error);
    return false;
  }
}

