import { calculateFDMaturity, calculateRDMaturity } from '@/lib/calculators/fd';

describe('calculateFDMaturity', () => {
  it('matures 1L at 7% for 12 months quarterly to ~107186', () => {
    const r = calculateFDMaturity(100000, 7, 12, 'quarterly');
    expect(r.maturity).toBeCloseTo(107186, -1);
    expect(r.interest).toBeCloseTo(7186, -1);
  });

  it('effective yield exceeds nominal for quarterly compounding', () => {
    const r = calculateFDMaturity(100000, 7, 12, 'quarterly');
    expect(r.effectiveYield).toBeGreaterThan(7);
    expect(r.effectiveYield).toBeLessThan(7.3);
  });

  it('monthly compounding yields more than annual', () => {
    const m = calculateFDMaturity(100000, 7, 12, 'monthly').maturity;
    const a = calculateFDMaturity(100000, 7, 12, 'annually').maturity;
    expect(m).toBeGreaterThan(a);
  });

  it('adds 0.5% for senior citizens', () => {
    const reg = calculateFDMaturity(100000, 7, 12, 'quarterly', false).maturity;
    const sen = calculateFDMaturity(100000, 7, 12, 'quarterly', true).maturity;
    expect(sen).toBeGreaterThan(reg);
  });

  it('uses quarterly compounding and not-senior by default', () => {
    const def = calculateFDMaturity(100000, 7, 12);
    const explicit = calculateFDMaturity(100000, 7, 12, 'quarterly', false);
    expect(def.maturity).toBeCloseTo(explicit.maturity, 5);
  });

  it('grows over a longer tenure', () => {
    const r = calculateFDMaturity(500000, 7, 60, 'quarterly');
    expect(r.maturity).toBeCloseTo(707389, -2);
  });
});

describe('calculateRDMaturity', () => {
  it('totals deposits correctly', () => {
    const r = calculateRDMaturity(5000, 7, 36);
    expect(r.totalDeposited).toBe(180000);
    expect(r.maturity).toBeGreaterThan(r.totalDeposited);
    expect(r.interest).toBeGreaterThan(0);
  });

  it('larger monthly deposit gives larger maturity', () => {
    const a = calculateRDMaturity(5000, 7, 36).maturity;
    const b = calculateRDMaturity(10000, 7, 36).maturity;
    expect(b).toBeGreaterThan(a);
  });
});
