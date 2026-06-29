import { calculateGratuity } from '@/lib/calculators/gratuity';

describe('calculateGratuity', () => {
  it('4yr11mo not eligible', () => {
    // 4 years 11 months = 4.917 years < 5, so not eligible
    const r = calculateGratuity(50000, 4.917, true);
    expect(r.eligible).toBe(false);
    expect(r.gratuity).toBe(0);
  });

  it('is not eligible under 5 years', () => {
    const r = calculateGratuity(50000, 4, true);
    expect(r.eligible).toBe(false);
    expect(r.gratuity).toBe(0);
  });

  it('computes covered formula (÷26)', () => {
    const r = calculateGratuity(50000, 10, true);
    expect(r.gratuity).toBeCloseTo((50000 * 15 * 10) / 26, 0);
    expect(r.eligible).toBe(true);
  });

  it('computes non-covered formula (÷30)', () => {
    const r = calculateGratuity(50000, 10, false);
    expect(r.gratuity).toBeCloseTo((50000 * 15 * 10) / 30, 0);
  });

  it('caps tax-free at 20 lakh', () => {
    const r = calculateGratuity(500000, 40, true);
    expect(r.taxFree).toBe(2000000);
    expect(r.taxable).toBeGreaterThan(0);
  });

  it('has no taxable portion under the limit', () => {
    const r = calculateGratuity(60000, 10, true);
    expect(r.taxable).toBe(0);
    expect(r.taxFree).toBe(r.gratuity);
  });
});
