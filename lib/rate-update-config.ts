// Central config for how often bank/RBI rates auto-refresh. Reads from
// environment variables so the cadence can change without code edits or
// touching the (static) Vercel cron schedule.
export type RateUpdateFrequency = 'daily' | 'weekly' | 'monthly';

const VALID_FREQUENCIES: RateUpdateFrequency[] = ['daily', 'weekly', 'monthly'];

export function getRateUpdateFrequency(): RateUpdateFrequency {
  const raw = (process.env.RATE_UPDATE_FREQUENCY ?? 'weekly').toLowerCase();
  return (VALID_FREQUENCIES as string[]).includes(raw) ? (raw as RateUpdateFrequency) : 'weekly';
}

// 0 = Sunday, 1 = Monday, ... 6 = Saturday. Only used when frequency is "weekly".
export function getRateUpdateDayOfWeek(): number {
  const raw = parseInt(process.env.RATE_UPDATE_DAY_OF_WEEK ?? '1', 10);
  return Number.isFinite(raw) && raw >= 0 && raw <= 6 ? raw : 1;
}

// Only used when frequency is "monthly" — 1-28 to stay valid in every month.
export function getRateUpdateDayOfMonth(): number {
  const raw = parseInt(process.env.RATE_UPDATE_DAY_OF_MONTH ?? '1', 10);
  return Number.isFinite(raw) && raw >= 1 && raw <= 28 ? raw : 1;
}

export function frequencyLabel(freq: RateUpdateFrequency): string {
  return freq;
}

// Whether an update should actually run today, given the configured cadence
// and how long it's been since the last successful update. The underlying
// Vercel cron trigger fires daily (see vercel.json) so this decides which of
// those daily invocations actually does the work.
export function isUpdateDue(lastUpdatedAt: string | null): boolean {
  const freq = getRateUpdateFrequency();
  const now = new Date();

  if (freq === 'daily') return true;

  const daysSinceUpdate = lastUpdatedAt
    ? (now.getTime() - new Date(lastUpdatedAt).getTime()) / (1000 * 60 * 60 * 24)
    : Infinity;

  if (freq === 'weekly') {
    const isTargetDay = now.getUTCDay() === getRateUpdateDayOfWeek();
    return isTargetDay || daysSinceUpdate >= 7; // catch-up if the target day's run was missed
  }

  // monthly
  const isTargetDay = now.getUTCDate() === getRateUpdateDayOfMonth();
  return isTargetDay || daysSinceUpdate >= 30;
}
