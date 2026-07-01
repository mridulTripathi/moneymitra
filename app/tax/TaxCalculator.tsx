"use client";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { formatINR, formatShort, formatIndian } from "@/lib/utils";
import EmailCapture from "@/components/EmailCapture";
import TaxTips from "@/components/tips/TaxTips";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

const TaxChart = dynamic(() => import("./TaxChart"), {
  ssr: false,
  loading: () => <div className="h-[200px] rounded-xl bg-[var(--bg-elevated)] animate-pulse" />,
});

interface Deductions {
  sec80C: boolean; sec80C_amt: number;
  sec80D: boolean; sec80D_amt: number;
  hra: boolean; hra_amt: number;
  homeLoan: boolean; homeLoan_amt: number;
  nps: boolean; nps_amt: number;
  other: boolean; other_amt: number; other_label: string;
}

function calcNewRegimeTax(taxableIncome: number): number {
  // Rebate u/s 87A: if taxable income <= 12L, tax = 0
  if (taxableIncome <= 1200000) return 0;
  const slabs = [
    [400000, 0],
    [800000, 0.05],
    [1200000, 0.10],
    [1600000, 0.15],
    [2000000, 0.20],
    [2400000, 0.25],
    [Infinity, 0.30],
  ] as const;
  let tax = 0;
  let prev = 0;
  for (const [limit, rate] of slabs) {
    if (taxableIncome <= prev) break;
    tax += (Math.min(taxableIncome, limit) - prev) * rate;
    prev = limit;
  }
  return tax;
}

function calcOldRegimeTax(taxableIncome: number): number {
  // Rebate u/s 87A: if taxable income <= 5L, tax = 0
  const slabs = [
    [250000, 0],
    [500000, 0.05],
    [1000000, 0.20],
    [Infinity, 0.30],
  ] as const;
  let tax = 0;
  let prev = 0;
  for (const [limit, rate] of slabs) {
    if (taxableIncome <= prev) break;
    tax += (Math.min(taxableIncome, limit) - prev) * rate;
    prev = limit;
  }
  if (taxableIncome <= 500000) tax = 0;
  return tax;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors mr-2 flex-shrink-0 ${checked ? "bg-[#0D9488]" : "bg-[var(--bg-hover)]"}`}
      aria-label={label}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-[var(--bg-card)] shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

function AmtInput({ value, onChange, max }: { value: number; onChange: (v: number) => void; max?: number }) {
  return (
    <div className="flex items-center gap-1 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-lg px-2 py-1 w-36">
      <span className="text-[var(--text-secondary)] text-xs">₹</span>
      <input
        type="text"
        value={formatIndian(value)}
        onChange={(e) => {
          const n = parseInt(e.target.value.replace(/,/g, ""), 10);
          if (!isNaN(n)) onChange(max ? Math.min(n, max) : n);
        }}
        className="bg-transparent text-right text-xs font-semibold text-[var(--text-primary)] w-full outline-none tabular-nums"
        inputMode="numeric"
      />
    </div>
  );
}

export default function TaxCalculator() {
  const [grossSalary, setGrossSalary] = useState(1200000);
  const [ded, setDed] = useState<Deductions>({
    sec80C: true, sec80C_amt: 150000,
    sec80D: true, sec80D_amt: 25000,
    hra: false, hra_amt: 120000,
    homeLoan: false, homeLoan_amt: 200000,
    nps: true, nps_amt: 50000,
    other: false, other_amt: 0, other_label: "Other deduction",
  });

  const result = useMemo(() => {
    const NEW_STD = 75000;
    const OLD_STD = 50000;

    const newTaxable = Math.max(0, grossSalary - NEW_STD);
    const newTaxBeforeCess = calcNewRegimeTax(newTaxable);
    const newCess = newTaxBeforeCess * 0.04;
    const newTotalTax = newTaxBeforeCess + newCess;
    const newTakeHome = (grossSalary - newTotalTax) / 12;

    let oldDeductions = OLD_STD;
    if (ded.sec80C) oldDeductions += Math.min(ded.sec80C_amt, 150000);
    if (ded.sec80D) oldDeductions += Math.min(ded.sec80D_amt, 25000);
    if (ded.hra) oldDeductions += ded.hra_amt;
    if (ded.homeLoan) oldDeductions += Math.min(ded.homeLoan_amt, 200000);
    if (ded.nps) oldDeductions += Math.min(ded.nps_amt, 50000);
    if (ded.other) oldDeductions += ded.other_amt;

    const oldTaxable = Math.max(0, grossSalary - oldDeductions);
    const oldTaxBeforeCess = calcOldRegimeTax(oldTaxable);
    const oldCess = oldTaxBeforeCess * 0.04;
    const oldTotalTax = oldTaxBeforeCess + oldCess;
    const oldTakeHome = (grossSalary - oldTotalTax) / 12;

    const savings = oldTotalTax - newTotalTax;
    const winner: "new" | "old" = savings >= 0 ? "new" : "old";
    const savedAmt = Math.abs(savings);

    return {
      new: { deductions: NEW_STD, taxable: newTaxable, taxBefore: newTaxBeforeCess, cess: newCess, total: newTotalTax, takeHome: newTakeHome },
      old: { deductions: oldDeductions, taxable: oldTaxable, taxBefore: oldTaxBeforeCess, cess: oldCess, total: oldTotalTax, takeHome: oldTakeHome },
      winner, savedAmt,
    };
  }, [grossSalary, ded]);

  const upd = <K extends keyof Deductions>(k: K, v: Deductions[K]) =>
    setDed((d) => ({ ...d, [k]: v }));

  const share = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("gs", String(grossSalary));
    navigator.clipboard.writeText(url.toString());
  };

  const chartData = [
    { name: "Old Regime", tax: Math.round(result.old.total) },
    { name: "New Regime", tax: Math.round(result.new.total) },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Sticky mobile result bar */}
      <div className="md:hidden sticky top-14 z-40 bg-[var(--bg-card)] border-b border-[var(--border-default)] px-4 py-3 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-xs text-[var(--text-secondary)]">Best choice</p>
          <p className="text-base font-bold text-[#0D9488] dark:text-[#14B8A6]">
            {result.winner === "new" ? "New Regime" : "Old Regime"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--text-secondary)]">You save</p>
          <p className="text-lg font-bold text-[#F59E0B] tabular-nums">{formatShort(result.savedAmt)}</p>
        </div>
      </div>

      {/* Gross salary input */}
      <div className="bg-[var(--bg-card)] rounded-2xl p-6 shadow-sm border border-[var(--border-default)]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-[var(--text-primary)] block mb-1">Annual Gross Salary</label>
            <div className="flex items-center gap-2 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl px-4 py-3">
              <span className="text-[var(--text-secondary)] text-lg">₹</span>
              <input
                type="text"
                value={formatIndian(grossSalary)}
                onChange={(e) => {
                  const n = parseInt(e.target.value.replace(/,/g, ""), 10);
                  if (!isNaN(n)) setGrossSalary(n);
                }}
                className="bg-transparent text-xl font-bold text-[var(--text-primary)] w-full outline-none tabular-nums"
                inputMode="numeric"
              />
            </div>
          </div>
          <div className="text-sm text-[var(--text-secondary)]">
            <span className="bg-[var(--bg-elevated)] px-3 py-1 rounded-lg">FY 2025-26</span>
          </div>
        </div>
        <input
          type="range"
          min={300000}
          max={10000000}
          step={50000}
          value={grossSalary}
          onChange={(e) => setGrossSalary(Number(e.target.value))}
          className="w-full mt-4"
        />
        <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-1">
          <span>₹3L</span><span>₹1Cr</span>
        </div>
        <button onClick={share} className="mt-3 text-sm text-[#0D9488] dark:text-[#14B8A6] hover:underline">🔗 Share this calculation</button>
      </div>

      {/* Old regime deductions */}
      <div className="bg-[var(--bg-card)] rounded-2xl p-6 shadow-sm border border-[var(--border-default)]">
        <h2 className="font-semibold text-[var(--text-primary)] mb-1">Old Regime Deductions</h2>
        <p className="text-xs text-[var(--text-secondary)] mb-4">Toggle the deductions that apply to you</p>
        <div className="flex flex-col gap-3">
          {[
            { key: "sec80C" as const, label: "80C — PF / ELSS / LIC / PPF", amtKey: "sec80C_amt" as const, max: 150000, cap: "Max ₹1.5L" },
            { key: "sec80D" as const, label: "80D — Health Insurance", amtKey: "sec80D_amt" as const, max: 25000, cap: "Max ₹25K" },
            { key: "hra" as const, label: "HRA Exemption", amtKey: "hra_amt" as const, cap: "Actual exempt amount" },
            { key: "homeLoan" as const, label: "24(b) — Home Loan Interest", amtKey: "homeLoan_amt" as const, max: 200000, cap: "Max ₹2L" },
            { key: "nps" as const, label: "80CCD(1B) — NPS", amtKey: "nps_amt" as const, max: 50000, cap: "Max ₹50K" },
            { key: "other" as const, label: "Other deduction", amtKey: "other_amt" as const, cap: "" },
          ].map((item) => (
            <div key={item.key} className="py-3 border-b border-[var(--border-subtle)] last:border-0">
              {/* Toggle + label row */}
              <div className="flex items-center gap-3">
                <Toggle
                  label={item.label}
                  checked={ded[item.key] as boolean}
                  onChange={(v) => upd(item.key, v)}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-[var(--text-primary)]">{item.label}</span>
                  {item.cap && <span className="ml-2 text-xs text-[var(--text-tertiary)]">{item.cap}</span>}
                </div>
              </div>
              {/* Amount input on new row when active */}
              {ded[item.key] && (
                <div className="mt-2 ml-14">
                  <AmtInput value={ded[item.amtKey] as number} onChange={(v) => upd(item.amtKey, v)} max={item.max} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Winner banner */}
      <div
        className={`rounded-2xl p-5 text-center ${result.winner === "new" ? "bg-[#0D9488] text-white" : "bg-[#7C3AED] text-white"}`}
        aria-live="polite"
        aria-atomic="true"
      >
        <p className="text-2xl font-bold mb-1">
          {result.winner === "new" ? "🎉 New Regime" : "🏆 Old Regime"} saves you{" "}
          <AnimatedNumber value={result.savedAmt} duration={700} formatter={(n) => formatShort(n)} /> this year
        </p>
        <p className="text-sm opacity-90">
          You save{" "}
          <strong><AnimatedNumber value={result.savedAmt / 12} duration={700} formatter={(n) => formatINR(Math.round(n))} />/month</strong> by choosing the{" "}
          {result.winner === "new" ? "New" : "Old"} Regime
        </p>
      </div>

      {/* Side-by-side comparison */}
      <div className="grid md:grid-cols-2 gap-4">
        {(["old", "new"] as const).map((regime) => {
          const r = result[regime];
          const isWinner = result.winner === regime;
          return (
            <div
              key={regime}
              className={`bg-[var(--bg-card)] rounded-2xl p-6 shadow-sm border-2 ${isWinner ? "border-[#0D9488]" : "border-[var(--border-default)]"}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[var(--text-primary)] text-lg">
                  {regime === "old" ? "Old Regime" : "New Regime"}
                </h3>
                {isWinner && (
                  <span className="text-xs bg-[#0D9488] text-white px-2 py-1 rounded-full font-medium">
                    Better choice ✓
                  </span>
                )}
              </div>
              <TaxRow label="Gross Income" value={formatINR(grossSalary)} />
              <TaxRow label="Total Deductions" value={`−${formatINR(Math.round(r.deductions))}`} color="text-[#10B981] dark:text-[#34D399]" />
              <TaxRow label="Taxable Income" value={formatINR(Math.round(r.taxable))} bold />
              <div className="my-2 border-t border-dashed border-[var(--border-default)]" />
              <TaxRow label="Tax (before cess)" value={formatINR(Math.round(r.taxBefore))} />
              <TaxRow label="Health & Education Cess (4%)" value={formatINR(Math.round(r.cess))} />
              <div className="flex justify-between items-center py-1.5">
                <span className="text-sm text-[var(--text-secondary)]">Total Tax</span>
                <AnimatedNumber value={r.total} duration={500} formatter={(n) => formatINR(Math.round(n))} className="text-sm tabular-nums font-bold text-red-500" />
              </div>
              <div className="mt-3 p-3 bg-[#F0FDF9] dark:bg-emerald-950/40 rounded-xl">
                <p className="text-xs text-[var(--text-secondary)]">Monthly Take-Home</p>
                <p className="text-xl font-bold text-[#0D9488] dark:text-[#14B8A6] tabular-nums">
                  {formatINR(Math.round(r.takeHome))}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="bg-[var(--bg-card)] rounded-2xl p-6 shadow-sm border border-[var(--border-default)]">
        <h3 className="font-semibold text-[var(--text-primary)] mb-1">Tax Comparison</h3>
        <p className="text-xs text-[var(--text-tertiary)] mb-4">Shorter bar = less tax = more money in your pocket</p>
        <TaxChart oldTax={result.old.total} newTax={result.new.total} />
        <EmailCapture />
      </div>

      <TaxTips winner={result.winner} difference={result.savedAmt} totalDeductions={result.old.deductions} />


      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
        💡 <strong>Note:</strong> These calculations are for salaried individuals. The New Regime has lower rates but fewer deductions. The Old Regime benefits those with significant 80C investments, HRA exemption, and home loan interest deductions.
      </div>
    </div>
  );
}

function TaxRow({ label, value, bold, color = "text-[var(--text-primary)]" }: { label: string; value: string; bold?: boolean; color?: string }) {
  return (
    <div className="flex justify-between items-center py-1.5">
      <span className="text-sm text-[var(--text-secondary)]">{label}</span>
      <span className={`text-sm tabular-nums ${bold ? "font-bold" : "font-medium"} ${color}`}>{value}</span>
    </div>
  );
}
