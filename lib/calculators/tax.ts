export function calculateNewRegimeTax(grossSalary: number): number {
  const NEW_STD = 75000;
  const taxableIncome = Math.max(0, grossSalary - NEW_STD);
  if (taxableIncome <= 1200000) return 0;
  const slabs = [
    [400000, 0],
    [800000, 0.05],
    [1200000, 0.10],
    [1600000, 0.15],
    [2000000, 0.20],
    [2400000, 0.25],
    [Infinity, 0.30],
  ] as const;
  let tax = 0;
  let prev = 0;
  for (const [limit, rate] of slabs) {
    if (taxableIncome <= prev) break;
    tax += (Math.min(taxableIncome, limit) - prev) * rate;
    prev = limit;
  }
  return tax * 1.04; // with 4% cess
}

export function calculateNewRegimeTaxBeforeCess(grossSalary: number): number {
  const NEW_STD = 75000;
  const taxableIncome = Math.max(0, grossSalary - NEW_STD);
  if (taxableIncome <= 1200000) return 0;
  const slabs = [
    [400000, 0],
    [800000, 0.05],
    [1200000, 0.10],
    [1600000, 0.15],
    [2000000, 0.20],
    [2400000, 0.25],
    [Infinity, 0.30],
  ] as const;
  let tax = 0;
  let prev = 0;
  for (const [limit, rate] of slabs) {
    if (taxableIncome <= prev) break;
    tax += (Math.min(taxableIncome, limit) - prev) * rate;
    prev = limit;
  }
  return tax;
}

export interface OldRegimeDeductions {
  stdDeduction?: number; // defaults to 50000
  sec80C?: number;
  sec80D?: number;
  hra?: number;
  homeLoanInterest?: number;
  nps?: number;
  other?: number;
}

export function calculateOldRegimeTax(grossSalary: number, deductions: OldRegimeDeductions = {}): number {
  const OLD_STD = deductions.stdDeduction ?? 50000;
  let totalDed = OLD_STD;
  if (deductions.sec80C) totalDed += Math.min(deductions.sec80C, 150000);
  if (deductions.sec80D) totalDed += Math.min(deductions.sec80D, 25000);
  if (deductions.hra) totalDed += deductions.hra;
  if (deductions.homeLoanInterest) totalDed += Math.min(deductions.homeLoanInterest, 200000);
  if (deductions.nps) totalDed += Math.min(deductions.nps, 50000);
  if (deductions.other) totalDed += deductions.other;

  const taxableIncome = Math.max(0, grossSalary - totalDed);
  const slabs = [
    [250000, 0],
    [500000, 0.05],
    [1000000, 0.20],
    [Infinity, 0.30],
  ] as const;
  let tax = 0;
  let prev = 0;
  for (const [limit, rate] of slabs) {
    if (taxableIncome <= prev) break;
    tax += (Math.min(taxableIncome, limit) - prev) * rate;
    prev = limit;
  }
  if (taxableIncome <= 500000) tax = 0;
  return tax * 1.04; // with 4% cess
}

export function calculateOldRegimeTaxBeforeCess(grossSalary: number, deductions: OldRegimeDeductions = {}): number {
  return calculateOldRegimeTax(grossSalary, deductions) / 1.04;
}

export function compareRegimes(grossSalary: number, deductions: OldRegimeDeductions = {}): {
  winner: 'new' | 'old';
  savedAmt: number;
  newTax: number;
  oldTax: number;
} {
  const newTax = calculateNewRegimeTax(grossSalary);
  const oldTax = calculateOldRegimeTax(grossSalary, deductions);
  const savings = oldTax - newTax;
  return {
    winner: savings >= 0 ? 'new' : 'old',
    savedAmt: Math.abs(savings),
    newTax,
    oldTax,
  };
}
