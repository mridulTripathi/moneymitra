export type CompoundingFrequency = 'monthly' | 'quarterly' | 'half-yearly' | 'annually';

export function calculateFDMaturity(
  principal: number,
  annualRate: number,
  tenureMonths: number,
  frequency: CompoundingFrequency = 'quarterly',
  isSeniorCitizen = false
): { maturity: number; interest: number; effectiveYield: number } {
  const rate = annualRate + (isSeniorCitizen ? 0.5 : 0);
  const freqMap: Record<CompoundingFrequency, number> = {
    monthly: 12, quarterly: 4, 'half-yearly': 2, annually: 1
  };
  const n = freqMap[frequency];
  const r = rate / 100;
  const t = tenureMonths / 12;
  const maturity = principal * Math.pow(1 + r / n, n * t);
  const interest = maturity - principal;
  const effectiveYield = (Math.pow(1 + r / n, n) - 1) * 100;
  return { maturity, interest, effectiveYield };
}

export function calculateRDMaturity(
  monthlyDeposit: number,
  annualRate: number,
  tenureMonths: number
): { maturity: number; totalDeposited: number; interest: number } {
  const i = annualRate / 400; // quarterly rate
  const n = tenureMonths;
  // Iterative sum: each deposit P made at month k earns (n-k)/3 quarterly periods
  let maturity = 0;
  for (let k = 1; k <= n; k++) {
    maturity += monthlyDeposit * Math.pow(1 + i, (n - k) / 3);
  }
  const totalDeposited = monthlyDeposit * n;
  return { maturity, totalDeposited, interest: maturity - totalDeposited };
}
