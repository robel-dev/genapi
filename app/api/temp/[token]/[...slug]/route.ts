import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import type { MockData } from '@/lib/types';

/**
 * GET /api/temp/:token/*
 * Catch-all route for nested paths like /api/temp/xyz/players or /api/temp/xyz/users/123
 * Phase C: Now retrieves data from storage
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

    // Fetch from storage
    const key = `mock:${token}`;
    const storedRaw = await store.get(key);

    if (!storedRaw) {
      return NextResponse.json(
        { error: 'Not found or expired' },
        { status: 404 }
      );
    }

    const stored: MockData = JSON.parse(storedRaw);

    // Optionally validate path matches (for future use)
    // For now, we just return the stored payload regardless of slug

    // Build response headers
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Access-Control-Allow-Origin', stored.cors || '*');
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
    headers.set('X-Expires-At', stored.expires_at);
    headers.set('X-Token', stored.token);
    headers.set('X-Path', path);

    return new NextResponse(JSON.stringify(stored.payload, null, 2), {
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

