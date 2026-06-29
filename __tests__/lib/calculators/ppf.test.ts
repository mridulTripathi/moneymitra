import { calculatePPF } from '@/lib/calculators/ppf';

describe('calculatePPF', () => {
  it('1.5L 15yr 7.1% within 10K of 40.68L', () => {
    const r = calculatePPF(150000, 15, 7.1, 'start');
    // Expected ~40,68,209 ± ₹10,000
    expect(r.maturityValue).toBeGreaterThan(4058000);
    expect(r.maturityValue).toBeLessThan(4078000);
  });

  it('matures 1.5L/yr for 15 years at 7.1% to ~40.68L', () => {
    const r = calculatePPF(150000, 15, 7.1, 'start');
    expect(r.maturityValue).toBeGreaterThan(4000000);
    expect(r.maturityValue).toBeLessThan(4150000);
    expect(r.totalInvested).toBe(2250000);
  });

  it('defaults to 7.1% rate and start timing', () => {
    const def = calculatePPF(150000, 15);
    const explicit = calculatePPF(150000, 15, 7.1, 'start');
    expect(def.maturityValue).toBe(explicit.maturityValue);
  });

  it('caps yearly investment at 1.5L', () => {
    const capped = calculatePPF(200000, 15, 7.1);
    const exact = calculatePPF(150000, 15, 7.1);
    expect(capped.maturityValue).toBe(exact.maturityValue);
  });

  it('produces a row per year', () => {
    const r = calculatePPF(150000, 15, 7.1);
    expect(r.yearlyBreakdown).toHaveLength(15);
    expect(r.yearlyBreakdown[14].closing).toBe(r.maturityValue);
  });

  it('end timing earns less than start timing', () => {
    const start = calculatePPF(150000, 15, 7.1, 'start').maturityValue;
    const end = calculatePPF(150000, 15, 7.1, 'end').maturityValue;
    expect(start).toBeGreaterThan(end);
  });

  it('interest equals maturity minus invested', () => {
    const r = calculatePPF(100000, 20, 7.1);
    expect(r.totalInterest).toBeCloseTo(r.maturityValue - r.totalInvested, 0);
  });
});
