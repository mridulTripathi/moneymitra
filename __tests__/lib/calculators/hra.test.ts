import { calculateHRAExemption } from '@/lib/calculators/hra';

describe('calculateHRAExemption', () => {
  it('takes the least of three for a Mumbai (metro) case', () => {
    // basic 50000, da 0, hra 20000, rent 25000, metro
    // v1=20000, v2=25000, v3=25000-5000=20000 => exemption 20000
    const r = calculateHRAExemption(50000, 0, 20000, 25000, true);
    expect(r.value1).toBe(20000);
    expect(r.value2).toBe(25000);
    expect(r.value3).toBe(20000);
    expect(r.exemption).toBe(20000);
    expect(r.taxableHRA).toBe(0);
  });

  it('uses 40% for non-metro', () => {
    const r = calculateHRAExemption(50000, 0, 30000, 30000, false);
    expect(r.value2).toBe(20000);
  });

  it('returns positive taxable HRA when exemption is capped', () => {
    const r = calculateHRAExemption(50000, 0, 30000, 10000, true);
    // v3 = 10000 - 5000 = 5000 is the least => taxable 25000
    expect(r.exemption).toBe(5000);
    expect(r.taxableHRA).toBe(25000);
  });

  it('negative V3 treated as zero', () => {
    // rent 1000 - 10% of 50000 = 1000 - 5000 = -4000, must clamp to 0
    const r = calculateHRAExemption(50000, 0, 20000, 1000, true);
    expect(r.value3).toBe(0);
    expect(r.exemption).toBe(0);
  });

  it('never returns negative rent-based value', () => {
    const r = calculateHRAExemption(50000, 0, 20000, 1000, true);
    expect(r.value3).toBe(0);
    expect(r.exemption).toBe(0);
  });

  it('includes DA in basic+DA base', () => {
    const r = calculateHRAExemption(40000, 10000, 30000, 30000, true);
    expect(r.value2).toBe(25000); // 50% of 50000
  });
});
