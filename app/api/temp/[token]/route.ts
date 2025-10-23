import { NextResponse } from 'next/server';

/**
 * GET /api/temp/:token
 * Skeleton endpoint that returns static mock data for any token
 * Phase B: Basic route structure only (no real storage yet)
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // For now, return static mock data
    // Will be replaced with real storage lookup in Phase C
    const mockData = {
      message: 'Mock API response',
      token: token,
      note: 'This is static data. Real storage integration coming in Phase C',
      timestamp: new Date().toISOString(),
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
    console.error('Error in /api/temp/:token:', error);
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

