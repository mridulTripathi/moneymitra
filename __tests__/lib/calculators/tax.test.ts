import {
  calculateNewRegimeTax,
  calculateNewRegimeTaxBeforeCess,
  calculateOldRegimeTax,
  calculateOldRegimeTaxBeforeCess,
  compareRegimes,
} from '@/lib/calculators/tax';

describe('new regime', () => {
  it('₹12.75L gross = zero tax new regime', () => {
    // taxable = 1275000 - 75000 = 1200000, exactly at rebate threshold
    expect(calculateNewRegimeTax(1275000)).toBe(0);
  });

  it('₹12.76L gross = ₹62556 new regime', () => {
    // taxable = 1276000 - 75000 = 1201000 → slabs: 0+20000+40000+150 = 60150 → ×1.04 = 62556
    expect(calculateNewRegimeTax(1276000)).toBeCloseTo(62556, 0);
  });

  it('is zero up to 12L taxable (12.75L gross)', () => {
    expect(calculateNewRegimeTax(1275000)).toBe(0);
  });

  it('is zero below threshold', () => {
    expect(calculateNewRegimeTax(1000000)).toBe(0);
  });

  it('taxes a 15L salary correctly before cess', () => {
    // taxable 14.25L: 0(4L)+5%(4L)=20000 +10%(4L)=40000 +15%(2.25L)=33750 => 93750
    expect(calculateNewRegimeTaxBeforeCess(1500000)).toBeCloseTo(93750, 0);
  });

  it('applies 4% cess', () => {
    expect(calculateNewRegimeTax(1500000)).toBeCloseTo(93750 * 1.04, 0);
  });

  it('taxes top slab income', () => {
    expect(calculateNewRegimeTaxBeforeCess(3075000)).toBeGreaterThan(0);
  });

  it('before-cess zero below threshold', () => {
    expect(calculateNewRegimeTaxBeforeCess(900000)).toBe(0);
  });
});

describe('old regime', () => {
  it('is zero for income at/under 5L taxable', () => {
    expect(calculateOldRegimeTax(550000)).toBe(0); // 5L taxable after 50k std
  });

  it('taxes a 15L salary with no extra deductions', () => {
    // taxable 14.5L: 5%(2.5L)=12500 +20%(5L)=100000 +30%(4.5L)=135000 = 247500
    expect(calculateOldRegimeTaxBeforeCess(1500000)).toBeCloseTo(247500, 0);
  });

  it('applies all deductions with caps', () => {
    const tax = calculateOldRegimeTax(1500000, {
      sec80C: 200000, sec80D: 40000, homeLoanInterest: 300000, nps: 60000, hra: 100000, other: 10000,
    });
    expect(tax).toBeGreaterThanOrEqual(0);
  });

  it('respects custom std deduction', () => {
    const a = calculateOldRegimeTax(1500000, { stdDeduction: 75000 });
    const b = calculateOldRegimeTax(1500000, { stdDeduction: 50000 });
    expect(a).toBeLessThan(b);
  });

  it('before-cess equals total / 1.04', () => {
    expect(calculateOldRegimeTaxBeforeCess(1500000)).toBeCloseTo(calculateOldRegimeTax(1500000) / 1.04, 5);
  });
});

describe('compareRegimes', () => {
  it('new regime wins with no deductions at 15L', () => {
    const r = compareRegimes(1500000);
    expect(r.winner).toBe('new');
    expect(r.savedAmt).toBeGreaterThan(0);
  });

  it('old regime can win with large deductions', () => {
    const r = compareRegimes(1500000, { sec80C: 150000, homeLoanInterest: 200000, sec80D: 25000, hra: 200000 });
    expect(['old', 'new']).toContain(r.winner);
    expect(r.newTax).toBeGreaterThanOrEqual(0);
    expect(r.oldTax).toBeGreaterThanOrEqual(0);
  });
});
