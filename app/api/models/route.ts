import { NextResponse } from 'next/server';
import { AVAILABLE_MODELS } from '@/lib/llm';

/**
 * GET /api/models
 * Returns available OpenRouter models for UI selection
 */
export async function GET() {
  return NextResponse.json({
    models: AVAILABLE_MODELS,
  });
}

