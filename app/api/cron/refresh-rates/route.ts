import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 60;

const VALID_BANK_TYPES = new Set(['public', 'private', 'nbfc', 'small_finance']);
const VALID_RATE_TYPES = new Set(['home_loan', 'personal_loan', 'car_loan', 'two_wheeler_loan', 'fd_1yr', 'rd_1yr']);

interface RBIPayload {
  repo_rate: number;
  reverse_repo_rate?: number;
  crr: number;
  slr: number;
  bank_rate?: number;
}

interface BankPayload {
  bank_name: string;
  bank_short_name: string;
  bank_type: string;
  rate_type: string;
  min_rate: number;
  max_rate: number;
}

function isReasonableRate(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= 30;
}

function isValidRBI(r: unknown): r is RBIPayload {
  if (!r || typeof r !== 'object') return false;
  const rbi = r as Record<string, unknown>;
  return isReasonableRate(rbi.repo_rate) && isReasonableRate(rbi.crr) && isReasonableRate(rbi.slr);
}

function isValidBank(b: unknown): b is BankPayload {
  if (!b || typeof b !== 'object') return false;
  const bank = b as Record<string, unknown>;
  return (
    typeof bank.bank_name === 'string' && bank.bank_name.length > 0 &&
    typeof bank.bank_short_name === 'string' && bank.bank_short_name.length > 0 &&
    typeof bank.bank_type === 'string' && VALID_BANK_TYPES.has(bank.bank_type) &&
    typeof bank.rate_type === 'string' && VALID_RATE_TYPES.has(bank.rate_type) &&
    isReasonableRate(bank.min_rate) && isReasonableRate(bank.max_rate) &&
    (bank.min_rate as number) <= (bank.max_rate as number)
  );
}

const RESEARCH_SYSTEM_PROMPT = `You are a financial data researcher. Search the web for CURRENT interest rates in India.

Research current published rates for these banks: SBI, HDFC Bank, ICICI Bank, Axis Bank, Kotak Mahindra Bank, Punjab National Bank, Bank of Baroda, Canara Bank, Yes Bank, IDFC First Bank, Union Bank, AU Small Finance Bank, Jana Small Finance Bank, Ujjivan Small Finance Bank, Suryoday Small Finance Bank, Bajaj Finance, TVS Credit, Hero FinCorp — for rate types: home_loan, personal_loan, car_loan, two_wheeler_loan, fd_1yr (1-year fixed deposit), rd_1yr (1-year recurring deposit). Also find the current RBI repo rate, reverse repo rate, CRR, SLR, and bank rate.

Do a REASONABLE number of searches (roughly 8-12 total) — you do not need every bank/rate_type combination to be complete. Partial data is expected and fine.

MANDATORY FINAL STEP: Regardless of how much data you found, your response MUST end with a block wrapped exactly like this, with no text after the closing tag:

<json>
{
  "rbi": { "repo_rate": number, "reverse_repo_rate": number, "crr": number, "slr": number, "bank_rate": number },
  "banks": [
    { "bank_name": string, "bank_short_name": string, "bank_type": "public"|"private"|"nbfc"|"small_finance", "rate_type": "home_loan"|"personal_loan"|"car_loan"|"two_wheeler_loan"|"fd_1yr"|"rd_1yr", "min_rate": number, "max_rate": number }
  ]
}
</json>

Include in "banks" only the entries you actually verified from a search result — omit anything you couldn't confirm rather than guessing. Do not skip the <json> block for any reason, even if you only found data for a few banks. Do not write any explanation, apology, or caveats — only search, then emit the <json> block.`;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = createServiceClient();
  const summary = { rbiUpdated: false, banksUpdated: 0, banksSkipped: 0, errors: [] as string[] };

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 8000,
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 15 }],
      system: RESEARCH_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: "Look up today's current RBI policy rates and current bank interest rates for India, and return the JSON exactly as instructed." }],
    });

    // Server-side web search produces interleaved content blocks (preamble text,
    // tool_use, tool_result, more text...) — the JSON payload is typically in the
    // final text block, so concatenate all text blocks rather than taking the first.
    const raw = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n');
    const jsonMatch = raw.match(/<json>([\s\S]*?)<\/json>/) ?? raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error(`No JSON object found in AI response. Raw text: ${raw.slice(0, 500)}`);
    const parsed = JSON.parse(jsonMatch[1] ?? jsonMatch[0]);

    const today = new Date().toISOString().slice(0, 10);

    // RBI policy rates — always insert a fresh dated snapshot (existing query pattern
    // reads the most recent row by effective_date, so a new row per day is correct).
    if (isValidRBI(parsed.rbi)) {
      const { error } = await client.from('rbi_policy_rates').insert({
        repo_rate: parsed.rbi.repo_rate,
        reverse_repo_rate: parsed.rbi.reverse_repo_rate ?? null,
        crr: parsed.rbi.crr,
        slr: parsed.rbi.slr,
        bank_rate: parsed.rbi.bank_rate ?? null,
        effective_date: today,
      });
      if (error) summary.errors.push(`RBI insert failed: ${error.message}`);
      else summary.rbiUpdated = true;
    } else {
      summary.errors.push('RBI data failed validation, skipped');
    }

    // Bank rates — update the existing row for (bank_short_name, rate_type) if one
    // exists, otherwise insert. Only rate fields + effective_date are touched on
    // update, so curated bank_url / senior_citizen_extra values are preserved.
    if (Array.isArray(parsed.banks)) {
      for (const b of parsed.banks) {
        if (!isValidBank(b)) {
          summary.banksSkipped++;
          continue;
        }
        const { data: existing } = await client
          .from('bank_rates')
          .select('id')
          .eq('bank_short_name', b.bank_short_name)
          .eq('rate_type', b.rate_type)
          .maybeSingle();

        if (existing) {
          const { error } = await client
            .from('bank_rates')
            .update({ min_rate: b.min_rate, max_rate: b.max_rate, effective_date: today, updated_at: new Date().toISOString() })
            .eq('id', existing.id);
          if (error) summary.errors.push(`${b.bank_short_name}/${b.rate_type} update failed: ${error.message}`);
          else summary.banksUpdated++;
        } else {
          const { error } = await client.from('bank_rates').insert({
            bank_name: b.bank_name,
            bank_short_name: b.bank_short_name,
            bank_type: b.bank_type,
            rate_type: b.rate_type,
            min_rate: b.min_rate,
            max_rate: b.max_rate,
            senior_citizen_extra: 0.5,
            effective_date: today,
          });
          if (error) summary.errors.push(`${b.bank_short_name}/${b.rate_type} insert failed: ${error.message}`);
          else summary.banksUpdated++;
        }
      }
    } else {
      summary.errors.push('No banks array found in AI response');
    }

    if (summary.rbiUpdated || summary.banksUpdated > 0) {
      await client.from('rates_last_updated').upsert({
        id: 1,
        updated_at: new Date().toISOString(),
        updated_by: 'cron',
        notes: `Auto-updated: RBI=${summary.rbiUpdated}, banks updated=${summary.banksUpdated}, skipped=${summary.banksSkipped}`,
      });
    }

    return NextResponse.json({ success: true, ...summary });
  } catch (e) {
    console.error('Rate refresh cron error:', e);
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : 'Unknown error', ...summary }, { status: 500 });
  }
}
