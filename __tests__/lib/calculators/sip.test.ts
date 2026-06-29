import { calculateSIP, calculateStepUpSIP, calcTotalInvestedStepUp } from '@/lib/calculators/sip';

describe('calculateSIP', () => {
  it('beginning-of-period formula used', () => {
    // ₹10K/12%/20yr annuity-due formula ≈ ₹9,991,568
    const corpus = calculateSIP(10000, 12, 20);
    expect(corpus).toBeGreaterThan(9900000);
    expect(corpus).toBeLessThan(10100000);
  });

  it('grows a 10k monthly SIP at 12% over 20 years to ~1 crore', () => {
    const corpus = calculateSIP(10000, 12, 20);
    expect(corpus).toBeGreaterThan(9500000);
    expect(corpus).toBeLessThan(10500000);
  });

  it('returns plain sum at zero return', () => {
    expect(calculateSIP(5000, 0, 10)).toBe(5000 * 120);
  });

  it('corpus exceeds total invested for positive returns', () => {
    const corpus = calculateSIP(5000, 12, 15);
    expect(corpus).toBeGreaterThan(5000 * 12 * 15);
  });
});

describe('calculateStepUpSIP', () => {
  it('beats a flat SIP of the same starting amount', () => {
    const flat = calculateSIP(10000, 12, 20);
    const stepped = calculateStepUpSIP(10000, 12, 20, 10);
    expect(stepped).toBeGreaterThan(flat);
  });

  it('equals contributions-only style growth at 0% return roughly equals invested', () => {
    const corpus = calculateStepUpSIP(10000, 0, 5, 10);
    const invested = calcTotalInvestedStepUp(10000, 5, 10);
    expect(corpus).toBeCloseTo(invested, 0);
  });
});

describe('calcTotalInvestedStepUp', () => {
  it('with 0 step-up equals flat invested amount', () => {
    expect(calcTotalInvestedStepUp(10000, 10, 0)).toBe(10000 * 12 * 10);
  });

  it('increases invested when step-up is positive', () => {
    const flat = calcTotalInvestedStepUp(10000, 10, 0);
    const stepped = calcTotalInvestedStepUp(10000, 10, 10);
    expect(stepped).toBeGreaterThan(flat);
  });
});
