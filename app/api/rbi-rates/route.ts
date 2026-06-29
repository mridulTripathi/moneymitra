import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export const revalidate = 21600; // 6 hours

export async function GET() {
  try {
    const client = createServiceClient();
    const { data } = await client
      .from('rbi_policy_rates')
      .select('*')
      .order('effective_date', { ascending: false })
      .limit(1)
      .single();

    return NextResponse.json(data ?? { repo_rate: 6.50, reverse_repo_rate: 3.35, crr: 4.00, slr: 18.00 });
  } catch {
    return NextResponse.json({ repo_rate: 6.50, reverse_repo_rate: 3.35, crr: 4.00, slr: 18.00 });
  }
}
