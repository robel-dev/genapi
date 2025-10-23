import { NextResponse } from 'next/server';

/**
 * POST /api/generate
 * Skeleton endpoint that accepts a prompt and returns a mock response
 * Phase B: Basic route structure only (no LLM, no storage yet)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = (body.prompt || '').trim();

    if (!prompt) {
      return NextResponse.json(
        { error: 'prompt is required' },
        { status: 400 }
      );
    }

    // For now, return a hardcoded mock response
    // Will be replaced with real LLM + storage in later phases
    const mockToken = 'dev-token-123';
    const mockUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/api/temp/${mockToken}`;

    return NextResponse.json({
      url: mockUrl,
      token: mockToken,
      expires_at: new Date(Date.now() + 86400 * 1000).toISOString(),
      preview: { message: 'Mock data - LLM integration coming in Phase D' },
    });
  } catch (error) {
    console.error('Error in /api/generate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

