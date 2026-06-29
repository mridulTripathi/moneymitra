import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export const revalidate = 21600;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') ?? 'home_loan';
  try {
    const client = createServiceClient();
    const { data } = await client
      .from('bank_rates')
      .select('*')
      .eq('rate_type', type)
      .order('min_rate', { ascending: true });
    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json([]);
  }
}
