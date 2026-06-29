import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

function checkAuth(req: NextRequest): boolean {
  const pw = req.headers.get('x-admin-password');
  return pw === process.env.ADMIN_PASSWORD;
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const client = createServiceClient();
  const { action, data } = body;

  if (action === 'upsert_rbi') {
    const { error } = await client.from('rbi_policy_rates').insert(data);
    return NextResponse.json(error ? { error: error.message } : { success: true });
  }
  if (action === 'upsert_bank_rate') {
    const { error } = await client.from('bank_rates').upsert(data);
    return NextResponse.json(error ? { error: error.message } : { success: true });
  }
  if (action === 'mark_updated') {
    const { error } = await client.from('rates_last_updated').upsert({ id: 1, updated_at: new Date().toISOString(), notes: data?.notes ?? '' });
    return NextResponse.json(error ? { error: error.message } : { success: true });
  }
  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
