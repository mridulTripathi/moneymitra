import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

// In-memory rate limiting: IP -> timestamps
const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const window = 60 * 60 * 1000; // 1 hour
  const timestamps = (rateLimitMap.get(ip) ?? []).filter(t => now - t < window);
  if (timestamps.length >= 3) return true;
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return false;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: { email?: string; source_page?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { email, source_page = 'unknown' } = body;
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  try {
    const client = createServiceClient();
    const { error } = await client.from('email_subscribers').insert({
      email,
      source_page,
      user_agent: req.headers.get('user-agent') ?? '',
    });
    // Ignore duplicate errors — respond success silently
    if (error && !error.message.includes('duplicate')) {
      console.error('Subscribe error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Subscribe exception:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
