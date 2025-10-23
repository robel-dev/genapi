import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { store } from '@/lib/store';
import type { GenerateRequest, MockData } from '@/lib/types';

const MAX_TTL = 7 * 24 * 3600; // 7 days
const DEFAULT_TTL = 86400; // 24 hours

/**
 * POST /api/generate
 * Phase C: Now with storage integration (mock LLM data for now)
 * Phase D: Will add real LLM integration
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
    const ttl = Math.min(
      Number(body.ttl_seconds || DEFAULT_TTL),
      MAX_TTL
    );
    const path = body.path ? String(body.path).replace(/^\/+|\/+$/g, '') : '';

    // Generate token
    const token = nanoid(21);
    const key = `mock:${token}`;

    // For Phase C, use mock payload (will be replaced with LLM in Phase D)
    const mockPayload = {
      message: 'Mock data generated - LLM integration coming in Phase D',
      prompt: prompt,
      items: body.items || 10,
      data: Array.from({ length: body.items || 10 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        value: Math.floor(Math.random() * 100),
      })),
    };

    // Prepare storage data
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttl * 1000);

    const stored: MockData = {
      token,
      prompt,
      payload: mockPayload,
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      path,
      private: !!body.private,
      cors: body.cors || '*',
    };

    // Store with TTL
    await store.set(key, JSON.stringify(stored), { ex: ttl });

    console.log(`[Generate] Created token ${token} with TTL ${ttl}s`);

    // Build URL
    const base = process.env.BASE_URL || `http://localhost:3000`;
    const url = `${base}/api/temp/${token}${path ? '/' + path : ''}`;

    return NextResponse.json({
      url,
      token,
      expires_at: expiresAt.toISOString(),
      preview: mockPayload,
    });
  } catch (error) {
    console.error('Error in /api/generate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

