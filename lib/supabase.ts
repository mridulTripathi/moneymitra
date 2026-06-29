import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const FALLBACK_URL = 'https://placeholder.supabase.co';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Lazily created anon client for client-side reads.
let _supabase: SupabaseClient | null = null;
export function getSupabase(): SupabaseClient {
  if (!_supabase) _supabase = createClient(supabaseUrl, supabaseAnonKey);
  return _supabase;
}

// Service role client for server-side admin writes.
// Falls back to anon key if service role key not set — works when RLS is disabled.
export function createServiceClient(): SupabaseClient {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL,
    serviceKey
  );
}
