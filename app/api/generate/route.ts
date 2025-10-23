import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { store } from '@/lib/store';
import { generateJSON, DEFAULT_MODEL } from '@/lib/llm';
import type { GenerateRequest, MockData } from '@/lib/types';

const MAX_TTL = 7 * 24 * 3600; // 7 days
const DEFAULT_TTL = 86400; // 24 hours

/**
 * POST /api/generate
 * Phase D: Now with real LLM integration via OpenRouter
 */
export async function POST(req: Request) {
  try {
    const body: GenerateRequest = await req.json();
    const prompt = (body.prompt || '').trim();

    if (!prompt) {
      return NextResponse.json(
        { error: 'prompt is required' },
        { status: 400 }
      );
    }

    // Parse and validate TTL
    const ttl = Math.min(Number(body.ttl_seconds || DEFAULT_TTL), MAX_TTL);
    const path = body.path ? String(body.path).replace(/^\/+|\/+$/g, '') : '';
    const model = body.model || DEFAULT_MODEL;

    // Generate token
    const token = nanoid(21);
    const key = `mock:${token}`;

    console.log(`[Generate] Generating with model: ${model}`);

    // Generate JSON using LLM (Phase D!)
    let payload: any;
    try {
      payload = await generateJSON(prompt, {
        items: body.items,
        model,
      });
    } catch (error) {
      console.error('[Generate] LLM generation failed:', error);
      return NextResponse.json(
        {
          error: 'Failed to generate JSON from prompt',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 502 }
      );
    }

    // Prepare storage data
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttl * 1000);

    const stored: MockData = {
      token,
      prompt,
      payload,
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      path,
      private: !!body.private,
      cors: body.cors || '*',
      model,
    };

    // Store with TTL
    await store.set(key, JSON.stringify(stored), { ex: ttl });

    console.log(`[Generate] Created token ${token} with TTL ${ttl}s using ${model}`);

    // Build URL
    const base = process.env.BASE_URL || `http://localhost:3000`;
    const url = `${base}/api/temp/${token}${path ? '/' + path : ''}`;

    return NextResponse.json({
      url,
      token,
      expires_at: expiresAt.toISOString(),
      preview: payload,
      model,
    });
  } catch (error) {
    console.error('Error in /api/generate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

