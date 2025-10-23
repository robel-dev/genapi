import { NextResponse } from 'next/server';

/**
 * GET /api/temp/:token/*
 * Catch-all route for nested paths like /api/temp/xyz/players or /api/temp/xyz/users/123
 * Phase B: Basic route structure only (no real storage yet)
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string; slug: string[] }> }
) {
  try {
    const { token, slug } = await params;

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const path = slug ? slug.join('/') : '';

    // For now, return static mock data
    // Will be replaced with real storage lookup in Phase C
    const mockData = {
      message: 'Mock API response with path',
      token: token,
      path: path,
      note: 'This is static data. Real storage integration coming in Phase C',
      timestamp: new Date().toISOString(),
      example_data: [
        { id: 1, name: 'Sample Item 1' },
        { id: 2, name: 'Sample Item 2' },
      ],
    };

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return new NextResponse(JSON.stringify(mockData, null, 2), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error in /api/temp/:token/[...slug]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS() {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
  
  return new NextResponse(null, { status: 204, headers });
}

