import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: NextRequest) {
  let body: { query?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { query } = body;
  if (!query?.trim()) return NextResponse.json({ error: 'Missing query' }, { status: 400 });

  const normalized = query.trim().toLowerCase();

  try {
    const client = createServiceClient();
    // Check cache
    const { data: cached } = await client
      .from('faq_cache')
      .select('*')
      .eq('query_normalized', normalized)
      .single();

    if (cached) {
      await client.from('faq_cache').update({ hit_count: cached.hit_count + 1 }).eq('id', cached.id);
      return NextResponse.json({ answer: cached.answer, source: cached.source });
    }

    // AI fallback
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      system: `You are a helpful financial assistant for MoneyMitra, an Indian personal finance calculator website. Answer questions about EMI, home loans, SIP, mutual funds, PPF, FD, HRA, gratuity, and income tax in India. Be specific with numbers when the question implies a calculation. You MUST answer in the same language as the user's question (e.g. Hindi, Bengali, Tamil, etc.). Always end with a disclaimer in the same language as the response, equivalent to: "This is general information, not financial advice." Keep answers under 100 words. If the question is not related to personal finance in India, reply in the same language stating that you can only help with Indian personal finance questions.`,
      messages: [{ role: 'user', content: query }],
    });

    const answer = message.content[0].type === 'text' ? message.content[0].text : 'Unable to answer.';

    // Cache the result
    try {
      await client.from('faq_cache').insert({
        query_text: query,
        query_normalized: normalized,
        answer,
        source: 'ai',
      });
    } catch {
      // ignore cache write failures
    }

    return NextResponse.json({ answer, source: 'ai' });
  } catch (e) {
    console.error('FAQ search error:', e);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
