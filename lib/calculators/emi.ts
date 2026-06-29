export function calculateEMI(principal: number, annualRate: number, tenureYears: number): number {
  const r = annualRate / 12 / 100;
  const n = tenureYears * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function calculateAmortization(
  principal: number,
  annualRate: number,
  tenureYears: number
): Array<{ month: number; principal: number; interest: number; balance: number }> {
  const r = annualRate / 12 / 100;
  const emi = calculateEMI(principal, annualRate, tenureYears);
  let balance = principal;
  const rows = [];
  const n = tenureYears * 12;
  for (let m = 1; m <= n; m++) {
    const interestPart = balance * r;
    const principalPart = emi - interestPart;
    balance = Math.max(0, balance - principalPart);
    rows.push({ month: m, principal: principalPart, interest: interestPart, balance });
  }
  return rows;
}

export type PrepayMode = 'reduceTenure' | 'reduceEMI';
export interface PrepayResult {
  interestSaved: number;
  timeSavedMonths: number;
  newEMI: number;
  newTenureMonths: number;
}

export function calculatePrepayment(
  principal: number,
  annualRate: number,
  tenureYears: number,
  paidEMIs: number,
  prepayAmount: number,
  prepayMonth: number,
  mode: PrepayMode
): PrepayResult {
  const r = annualRate / 12 / 100;
  const n = tenureYears * 12;
  const emi = calculateEMI(principal, annualRate, tenureYears);
  const fullSchedule = calculateAmortization(principal, annualRate, tenureYears);
  const balanceAfterPaid = paidEMIs > 0 ? (fullSchedule[paidEMIs - 1]?.balance ?? principal) : principal;
  const remainingMonths = n - paidEMIs;

  const withoutInterest = fullSchedule.slice(paidEMIs).reduce((s, m) => s + m.interest, 0);

  const prepayIdx = Math.min(prepayMonth - 1, remainingMonths - 1);
  let balBefore = balanceAfterPaid;
  const preSchedule = calculateAmortization(balanceAfterPaid, annualRate, Math.ceil(remainingMonths / 12) + 1);
  for (let i = 0; i < prepayIdx; i++) {
    balBefore = preSchedule[i]?.balance ?? balBefore;
  }

  const newPrincipal = Math.max(0, balBefore - prepayAmount);
  const preInterest = preSchedule.slice(0, prepayIdx).reduce((s, m) => s + m.interest, 0);

  let withTenure: number;
  let withEMI: number;
  let withInterest: number;

  if (mode === 'reduceTenure') {
    withEMI = emi;
    if (newPrincipal <= 0) {
      withTenure = prepayIdx;
      withInterest = 0;
    } else {
      const calc = r === 0 ? newPrincipal / emi : -Math.log(1 - (newPrincipal * r) / emi) / Math.log(1 + r);
      withTenure = prepayIdx + Math.ceil(calc);
      const sch2 = calculateAmortization(newPrincipal, annualRate, Math.ceil(calc / 12) + 1);
      withInterest = sch2.slice(0, Math.ceil(calc)).reduce((s, m) => s + m.interest, 0);
    }
  } else {
    const monthsLeft = remainingMonths - prepayIdx;
    withTenure = remainingMonths;
    if (newPrincipal <= 0) {
      withEMI = 0;
      withInterest = 0;
    } else {
      withEMI = calculateEMI(newPrincipal, annualRate, monthsLeft / 12);
      const sch2 = calculateAmortization(newPrincipal, annualRate, monthsLeft / 12);
      withInterest = sch2.reduce((s, m) => s + m.interest, 0);
    }
  }

  const interestSaved = Math.max(0, withoutInterest - preInterest - withInterest);
  const timeSavedMonths = Math.max(0, remainingMonths - withTenure);

  return { interestSaved, timeSavedMonths, newEMI: withEMI, newTenureMonths: withTenure };
}
