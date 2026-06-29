export function calculatePPF(
  yearlyInvestment: number,
  tenureYears: number,
  annualRate = 7.1,
  timing: 'start' | 'end' = 'start'
): {
  totalInvested: number;
  totalInterest: number;
  maturityValue: number;
  yearlyBreakdown: Array<{ year: number; opening: number; investment: number; interest: number; closing: number }>;
} {
  const cappedYearly = Math.min(yearlyInvestment, 150000);
  const r = annualRate / 100;
  let balance = 0;
  const breakdown = [];
  for (let y = 1; y <= tenureYears; y++) {
    const opening = balance;
    let investmentForInterest: number;
    if (timing === 'start') {
      balance += cappedYearly;
      investmentForInterest = balance;
    } else {
      investmentForInterest = balance;
      balance += cappedYearly;
    }
    const interest = Math.round(investmentForInterest * r);
    balance += interest;
    breakdown.push({ year: y, opening, investment: cappedYearly, interest, closing: balance });
  }
  const totalInvested = cappedYearly * tenureYears;
  return { totalInvested, totalInterest: balance - totalInvested, maturityValue: balance, yearlyBreakdown: breakdown };
}
