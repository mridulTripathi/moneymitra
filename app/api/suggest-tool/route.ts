import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

/*
Run this SQL in Supabase SQL editor first:

create table if not exists tool_suggestions (
  id uuid primary key default gen_random_uuid(),
  suggestion text not null,
  user_email text,
  source_page text,
  votes integer not null default 1,
  created_at timestamptz not null default now()
);
*/

export async function POST(req: NextRequest) {
  const { suggestion, email, sourcePage } = await req.json();

  if (!suggestion || suggestion.trim().length < 10 || suggestion.trim().length > 500) {
    return NextResponse.json({ error: 'Suggestion must be 10-500 characters' }, { status: 400 });
  }

  const client = createServiceClient();

  // Check for near-duplicate (case-insensitive)
  const normalized = suggestion.trim().toLowerCase();
  const { data: existing } = await client
    .from('tool_suggestions')
    .select('id, votes')
    .ilike('suggestion', normalized)
    .limit(1)
    .single();

  if (existing) {
    await client.from('tool_suggestions').update({ votes: existing.votes + 1 }).eq('id', existing.id);
    return NextResponse.json({ success: true, isDuplicate: true });
  }

  await client.from('tool_suggestions').insert({
    suggestion: suggestion.trim(),
    user_email: email?.trim() || null,
    source_page: sourcePage || 'unknown',
  });

  return NextResponse.json({ success: true, isDuplicate: false });
}
