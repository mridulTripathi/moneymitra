export function calculateHRAExemption(
  basicSalaryMonthly: number,
  daMonthly: number,
  hraReceivedMonthly: number,
  rentPaidMonthly: number,
  isMetro: boolean
): {
  value1: number; // actual HRA
  value2: number; // 50%/40% of basic+DA
  value3: number; // rent - 10% of basic+DA
  exemption: number;
  taxableHRA: number;
} {
  const basicPlusDA = basicSalaryMonthly + daMonthly;
  const value1 = hraReceivedMonthly;
  const value2 = basicPlusDA * (isMetro ? 0.5 : 0.4);
  const value3 = Math.max(0, rentPaidMonthly - basicPlusDA * 0.1);
  const exemption = Math.min(value1, value2, value3);
  const taxableHRA = Math.max(0, hraReceivedMonthly - exemption);
  return { value1, value2, value3, exemption, taxableHRA };
}
