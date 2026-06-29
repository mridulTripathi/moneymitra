export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

/** Format number with Indian number system: 1,00,000 */
export function formatIndian(num: number): string {
  if (isNaN(num)) return "0";
  const fixed = Math.round(num);
  const str = fixed.toString();
  const lastThree = str.slice(-3);
  const rest = str.slice(0, -3);
  if (!rest) return lastThree;
  const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${formatted},${lastThree}`;
}

/** Format as ₹ with Indian number system */
export function formatINR(num: number): string {
  return `₹${formatIndian(num)}`;
}

/** Format large amounts as L/Cr shorthand */
export function formatShort(num: number): string {
  if (num >= 1_00_00_000) return `₹${(num / 1_00_00_000).toFixed(2)}Cr`;
  if (num >= 1_00_000) return `₹${(num / 1_00_000).toFixed(2)}L`;
  return formatINR(num);
}

/** EMI = P × r × (1+r)^n / ((1+r)^n - 1) */
export function calcEMI(principal: number, annualRate: number, tenureYears: number): number {
  const r = annualRate / 12 / 100;
  const n = tenureYears * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

/** Generate full amortization schedule, returns array of monthly rows */
export function amortizationSchedule(
  principal: number,
  annualRate: number,
  tenureYears: number
): Array<{ month: number; principal: number; interest: number; balance: number }> {
  const r = annualRate / 12 / 100;
  const emi = calcEMI(principal, annualRate, tenureYears);
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

/** Format months into years+months string */
export function formatTenure(months: number): string {
  const y = Math.floor(months / 12);
  const m = Math.round(months % 12);
  if (y === 0) return `${m} month${m !== 1 ? "s" : ""}`;
  if (m === 0) return `${y} year${y !== 1 ? "s" : ""}`;
  return `${y} yr ${m} mo`;
}

/** Add months to a date and return "Mon YYYY" string */
export function addMonths(base: Date, months: number): string {
  const d = new Date(base);
  d.setMonth(d.getMonth() + Math.round(months));
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}
