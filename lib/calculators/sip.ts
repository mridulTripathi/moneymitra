export function calculateSIP(monthly: number, annualReturn: number, years: number): number {
  const r = annualReturn / 12 / 100;
  const n = years * 12;
  if (r === 0) return monthly * n;
  return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
}

export function calculateStepUpSIP(monthly: number, annualReturn: number, years: number, stepUpPercent: number): number {
  let corpus = 0;
  let currentMonthly = monthly;
  const r = annualReturn / 12 / 100;
  for (let y = 0; y < years; y++) {
    for (let m = 0; m < 12; m++) {
      const monthsLeft = (years - y) * 12 - m;
      corpus += currentMonthly * Math.pow(1 + r, monthsLeft);
    }
    currentMonthly *= 1 + stepUpPercent / 100;
  }
  return corpus;
}

export function calcTotalInvestedStepUp(monthly: number, years: number, stepUpPercent: number): number {
  let inv = 0, m = monthly;
  for (let y = 0; y < years; y++) { inv += m * 12; m *= 1 + stepUpPercent / 100; }
  return inv;
}
