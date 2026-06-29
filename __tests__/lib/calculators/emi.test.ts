import { calculateEMI, calculateAmortization, calculatePrepayment } from '@/lib/calculators/emi';

describe('calculateEMI', () => {
  it('₹30L 8.5% 20yr = ₹26035', () => {
    expect(calculateEMI(3000000, 8.5, 20)).toBeCloseTo(26035, 0);
  });

  it('computes EMI for a 30L loan at 8.5% for 20 years', () => {
    expect(calculateEMI(3000000, 8.5, 20)).toBeCloseTo(26035, -1);
  });

  it('computes EMI for a 40L loan at 8.5% for 20 years', () => {
    expect(calculateEMI(4000000, 8.5, 20)).toBeCloseTo(34713, -1);
  });

  it('handles zero interest rate', () => {
    expect(calculateEMI(120000, 0, 1)).toBe(10000);
  });

  it('scales linearly with principal', () => {
    const a = calculateEMI(1000000, 9, 15);
    const b = calculateEMI(2000000, 9, 15);
    expect(b).toBeCloseTo(a * 2, 5);
  });
});

describe('calculateAmortization', () => {
  it('produces one row per month', () => {
    const sched = calculateAmortization(3000000, 8.5, 20);
    expect(sched).toHaveLength(240);
  });

  it('amortization closes to zero', () => {
    const sched = calculateAmortization(3000000, 8.5, 20);
    expect(sched[sched.length - 1].balance).toBeCloseTo(0, 0);
  });

  it('drives the balance to ~0 at the end', () => {
    const sched = calculateAmortization(3000000, 8.5, 20);
    expect(sched[sched.length - 1].balance).toBeLessThan(1);
  });

  it('early payments are mostly interest', () => {
    const sched = calculateAmortization(4000000, 8.5, 20);
    expect(sched[0].interest).toBeGreaterThan(sched[0].principal);
  });

  it('total principal repaid equals the loan amount', () => {
    const sched = calculateAmortization(1000000, 7, 10);
    const totalPrincipal = sched.reduce((s, m) => s + m.principal, 0);
    expect(totalPrincipal).toBeCloseTo(1000000, 0);
  });

  it('handles zero rate amortization', () => {
    const sched = calculateAmortization(120000, 0, 1);
    expect(sched[0].interest).toBe(0);
    expect(sched[11].balance).toBeCloseTo(0, 5);
  });
});

describe('calculatePrepayment', () => {
  it('saves interest and time in reduce-tenure mode', () => {
    const r = calculatePrepayment(4000000, 8.5, 20, 24, 500000, 1, 'reduceTenure');
    expect(r.interestSaved).toBeGreaterThan(0);
    expect(r.timeSavedMonths).toBeGreaterThan(0);
    expect(r.newEMI).toBeCloseTo(calculateEMI(4000000, 8.5, 20), 0);
  });

  it('lowers EMI in reduce-EMI mode', () => {
    const baseEMI = calculateEMI(4000000, 8.5, 20);
    const r = calculatePrepayment(4000000, 8.5, 20, 24, 500000, 1, 'reduceEMI');
    expect(r.newEMI).toBeLessThan(baseEMI);
    expect(r.interestSaved).toBeGreaterThan(0);
  });

  it('reduce-tenure saves more interest than reduce-EMI for the same prepayment', () => {
    const tenure = calculatePrepayment(4000000, 8.5, 20, 24, 500000, 1, 'reduceTenure');
    const emi = calculatePrepayment(4000000, 8.5, 20, 24, 500000, 1, 'reduceEMI');
    expect(tenure.interestSaved).toBeGreaterThan(emi.interestSaved);
  });

  it('handles a prepayment that clears the loan', () => {
    const r = calculatePrepayment(1000000, 8, 10, 12, 100000000, 1, 'reduceTenure');
    expect(r.interestSaved).toBeGreaterThanOrEqual(0);
    expect(r.timeSavedMonths).toBeGreaterThan(0);
  });

  it('handles zero EMIs paid', () => {
    const r = calculatePrepayment(2000000, 9, 15, 0, 200000, 1, 'reduceTenure');
    expect(r.interestSaved).toBeGreaterThan(0);
  });

  it('handles reduce-EMI clearing the loan', () => {
    const r = calculatePrepayment(1000000, 8, 10, 12, 100000000, 1, 'reduceEMI');
    expect(r.newEMI).toBe(0);
  });

  it('handles zero rate prepayment', () => {
    const r = calculatePrepayment(120000, 0, 1, 2, 10000, 1, 'reduceTenure');
    expect(r.interestSaved).toBeGreaterThanOrEqual(0);
  });

  it('handles zero rate reduce-EMI prepayment', () => {
    const r = calculatePrepayment(240000, 0, 2, 6, 24000, 3, 'reduceEMI');
    expect(r.newEMI).toBeGreaterThan(0);
    expect(r.interestSaved).toBeGreaterThanOrEqual(0);
  });

  it('handles a prepayment late in the schedule', () => {
    // large prepayMonth exercises the pre-schedule balance loop and fallback
    const r = calculatePrepayment(4000000, 8.5, 20, 24, 300000, 200, 'reduceTenure');
    expect(r.interestSaved).toBeGreaterThanOrEqual(0);
    expect(r.newTenureMonths).toBeGreaterThan(0);
  });
});
