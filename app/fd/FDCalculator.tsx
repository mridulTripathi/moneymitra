"use client";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import SliderInput from "@/components/SliderInput";
import EmailCapture from "@/components/EmailCapture";
import { formatINR, formatShort, formatIndian } from "@/lib/utils";
import { calculateFDMaturity, calculateRDMaturity, type CompoundingFrequency } from "@/lib/calculators/fd";

const FDChart = dynamic(() => import("./FDChart"), {
  ssr: false,
  loading: () => <div className="h-[240px] rounded-xl bg-[#F1F5F9] dark:bg-[#0F172A] animate-pulse" />,
});

type Tab = "fd" | "rd";
const FREQS: { value: CompoundingFrequency; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "half-yearly", label: "Half-yearly" },
  { value: "annually", label: "Annually" },
];

export default function FDCalculator() {
  const [tab, setTab] = useState<Tab>("fd");
  const [principal, setPrincipal] = useState(500000);
  const [monthly, setMonthly] = useState(10000);
  const [rate, setRate] = useState(7);
  const [tenureMonths, setTenureMonths] = useState(60);
  const [freq, setFreq] = useState<CompoundingFrequency>("quarterly");
  const [senior, setSenior] = useState(false);

  const fd = useMemo(
    () => calculateFDMaturity(principal, rate, tenureMonths, freq, senior),
    [principal, rate, tenureMonths, freq, senior]
  );
  const rd = useMemo(
    () => calculateRDMaturity(monthly, rate + (senior ? 0.5 : 0), tenureMonths),
    [monthly, rate, tenureMonths, senior]
  );

  const isFD = tab === "fd";
  const maturity = isFD ? fd.maturity : rd.maturity;
  const interest = isFD ? fd.interest : rd.interest;
  const invested = isFD ? principal : rd.totalDeposited;

  const chartData = useMemo(() => {
    const years = Math.max(1, Math.ceil(tenureMonths / 12));
    const pts: { year: number; value: number }[] = [{ year: 0, value: invested === principal && isFD ? principal : 0 }];
    for (let y = 1; y <= years; y++) {
      const months = Math.min(y * 12, tenureMonths);
      if (isFD) {
        pts.push({ year: y, value: Math.round(calculateFDMaturity(principal, rate, months, freq, senior).maturity) });
      } else {
        pts.push({ year: y, value: Math.round(calculateRDMaturity(monthly, rate + (senior ? 0.5 : 0), months).maturity) });
      }
    }
    return pts;
  }, [isFD, principal, monthly, rate, tenureMonths, freq, senior, invested]);

  return (
    <>
      {/* Sticky mobile result */}
      <div className="md:hidden sticky top-14 z-40 bg-white dark:bg-[#1E293B] border-b border-[#E2E8F0] dark:border-[#334155] px-4 py-3 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Maturity Value</p>
          <p className="text-2xl font-bold text-[#0D9488] dark:text-[#14B8A6] tabular-nums" aria-live="polite" aria-atomic="true">{formatShort(maturity)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Interest Earned</p>
          <p className="text-base font-semibold text-[#10B981] dark:text-[#34D399] tabular-nums" aria-live="polite">{formatShort(interest)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {(["fd", "rd"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              tab === t ? "bg-[#0D9488] text-white" : "bg-[#F1F5F9] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E2E8F0]"
            }`}
          >
            {t === "fd" ? "Fixed Deposit" : "Recurring Deposit"}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Inputs */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-sm border border-[#E2E8F0] dark:border-[#334155]">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xl" aria-hidden="true">🏦</span>
            <h2 className="font-bold text-[#0F172A] dark:text-[#F1F5F9] text-lg">Deposit Details</h2>
          </div>
          {isFD ? (
            <SliderInput label="Deposit Amount" value={principal} min={10000} max={10000000} step={10000} onChange={setPrincipal} prefix="₹" format={formatIndian} rangeHint="Min ₹10K · Max ₹1Cr" />
          ) : (
            <SliderInput label="Monthly Deposit" value={monthly} min={500} max={200000} step={500} onChange={setMonthly} prefix="₹" format={formatIndian} rangeHint="Min ₹500 · Max ₹2L" />
          )}
          <SliderInput label="Interest Rate" value={rate} min={3} max={9} step={0.05} onChange={setRate} suffix="%" format={(v) => v.toFixed(2)} hint="Check your bank's FD rate card" />
          <SliderInput label="Tenure" value={tenureMonths} min={3} max={120} step={1} onChange={setTenureMonths} suffix=" mo" format={String} rangeHint="3 months to 10 years" />

          {isFD && (
            <div className="mb-4">
              <label className="text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9] mb-2 block">Compounding Frequency</label>
              <div className="flex flex-wrap gap-2">
                {FREQS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFreq(f.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      freq === f.value ? "bg-[#0D9488] text-white" : "bg-[#F1F5F9] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E2E8F0]"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <label className="flex items-center gap-2 mt-2 cursor-pointer text-sm text-[#0F172A] dark:text-[#F1F5F9]">
            <input type="checkbox" checked={senior} onChange={(e) => setSenior(e.target.checked)} className="accent-[#0D9488] w-4 h-4" />
            Senior citizen (+0.50% rate)
          </label>
        </div>

        {/* Results */}
        <div className="flex flex-col gap-4">
          <div className="hidden md:block bg-white dark:bg-[#1E293B] rounded-2xl p-6 shadow-sm border border-[#E2E8F0] dark:border-[#334155]">
            <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-1">Maturity Value</p>
            <p className="text-5xl font-bold text-[#0D9488] dark:text-[#14B8A6] tabular-nums" aria-live="polite" aria-atomic="true">{formatINR(Math.round(maturity))}</p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="bg-[#F8FAFC] dark:bg-[#0F172A] rounded-xl p-3">
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-1">{isFD ? "Invested" : "Total Deposited"}</p>
                <p className="font-bold text-[#0F172A] dark:text-[#F1F5F9] tabular-nums text-lg">{formatShort(invested)}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-3">
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-1">Interest Earned</p>
                <p className="font-bold text-[#10B981] dark:text-[#34D399] tabular-nums text-lg" aria-live="polite">{formatShort(interest)}</p>
              </div>
            </div>
            {isFD && (
              <p className="text-xs text-[#94A3B8] mt-3">Effective annual yield: {fd.effectiveYield.toFixed(2)}%</p>
            )}
          </div>

          <div className="md:hidden bg-white dark:bg-[#1E293B] rounded-2xl p-5 shadow-sm border border-[#E2E8F0] dark:border-[#334155]">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#F8FAFC] dark:bg-[#0F172A] rounded-xl p-3">
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-1">{isFD ? "Invested" : "Total Deposited"}</p>
                <p className="font-bold text-[#0F172A] dark:text-[#F1F5F9] tabular-nums">{formatShort(invested)}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-3">
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-1">Interest Earned</p>
                <p className="font-bold text-[#10B981] dark:text-[#34D399] tabular-nums">{formatShort(interest)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-sm border border-[#E2E8F0] dark:border-[#334155]">
            <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9] mb-1">Growth Over Time</p>
            <p className="text-xs text-[#94A3B8] mb-3">How your deposit compounds year by year</p>
            <FDChart data={chartData} />
            <EmailCapture sourcePage="fd" />
          </div>
        </div>
      </div>
    </>
  );
}
