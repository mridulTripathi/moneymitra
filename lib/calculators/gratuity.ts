export function calculateGratuity(
  basicPlusDA: number,
  yearsOfService: number,
  isCovered: boolean
): {
  eligible: boolean;
  gratuity: number;
  taxFree: number;
  taxable: number;
} {
  if (yearsOfService < 5) return { eligible: false, gratuity: 0, taxFree: 0, taxable: 0 };
  const divisor = isCovered ? 26 : 30;
  const gratuity = (basicPlusDA * 15 * yearsOfService) / divisor;
  const taxFree = Math.min(gratuity, 2000000);
  const taxable = Math.max(0, gratuity - taxFree);
  return { eligible: true, gratuity, taxFree, taxable };
}
