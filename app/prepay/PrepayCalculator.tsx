"use client";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import EmailCapture from "@/components/EmailCapture";

const PrepayChart = dynamic(() => import("./PrepayChart"), {
  ssr: false,
  loading: () => <div className="h-[280px] rounded-xl bg-[var(--bg-elevated)] animate-pulse" />,
});
import SliderInput from "@/components/SliderInput";
import PrepayTips from "@/components/tips/PrepayTips";
import { calcEMI, amortizationSchedule, formatINR, formatShort, formatTenure, addMonths, formatIndian } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import RelatedTools from "@/components/RelatedTools";

type Mode = "reduceTenure" | "reduceEMI";

export default function PrepayCalculator() {
  const [loanAmt, setLoanAmt] = useState(3000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [emisPaid, setEmisPaid] = useState(24);
  const [prepayAmt, setPrepayAmt] = useState(500000);
  const [prepayMonth, setPrepayMonth] = useState(1);
  const [mode, setMode] = useState<Mode>("reduceTenure");

  const result = useMemo(() => {
    const r = rate / 12 / 100;
    const n = tenure * 12;
    const emi = calcEMI(loanAmt, rate, tenure);

    // Get balance after emisPaid months
    const fullSchedule = amortizationSchedule(loanAmt, rate, tenure);
    const balanceAfterPaid = emisPaid > 0 ? fullSchedule[emisPaid - 1]?.balance ?? loanAmt : loanAmt;
    const remainingMonths = n - emisPaid;

    // Without prepayment
    const withoutInterest = fullSchedule
      .slice(emisPaid)
      .reduce((s, m) => s + m.interest, 0);
    const withoutTenure = remainingMonths;
    const withoutEMI = emi;

    // Balance just before prepayment month (relative to current position)
    const prepayIdx = Math.min(prepayMonth - 1, remainingMonths - 1);
    let balBefore = balanceAfterPaid;
    const preSchedule = amortizationSchedule(balanceAfterPaid, rate, Math.ceil(remainingMonths / 12) + 1);
    for (let i = 0; i < prepayIdx; i++) {
      balBefore = preSchedule[i]?.balance ?? balBefore;
    }

    const newPrincipal = Math.max(0, balBefore - prepayAmt);

    let withTenure: number;
    let withEMI: number;
    let withInterest: number;

    if (mode === "reduceTenure") {
      // Same EMI, shorter tenure
      withEMI = emi;
      if (newPrincipal <= 0) {
        withTenure = prepayIdx;
        withInterest = 0;
      } else {
        // Calculate new tenure from newPrincipal with same EMI
        // n = -log(1 - P*r/EMI) / log(1+r)
        const calc = r === 0 ? newPrincipal / emi : -Math.log(1 - (newPrincipal * r) / emi) / Math.log(1 + r);
        withTenure = prepayIdx + Math.ceil(calc);
        const sch2 = amortizationSchedule(newPrincipal, rate, Math.ceil(calc / 12) + 1);
        withInterest = sch2.slice(0, Math.ceil(calc)).reduce((s, m) => s + m.interest, 0);
      }
    } else {
      // Same tenure, lower EMI
      const monthsLeft = remainingMonths - prepayIdx;
      withTenure = remainingMonths;
      if (newPrincipal <= 0) {
        withEMI = 0;
        withInterest = 0;
      } else {
        withEMI = calcEMI(newPrincipal, rate, monthsLeft / 12);
        const sch2 = amortizationSchedule(newPrincipal, rate, monthsLeft / 12);
        withInterest = sch2.reduce((s, m) => s + m.interest, 0);
      }
    }

    // Interest before prepayment (same for both)
    const preInterest = preSchedule.slice(0, prepayIdx).reduce((s, m) => s + m.interest, 0);

    const interestSaved = Math.max(0, withoutInterest - preInterest - withInterest);
    const timeSavedMonths = Math.max(0, withoutTenure - withTenure);

    const now = new Date();
    const withoutClose = addMonths(now, remainingMonths);
    const withClose = addMonths(now, withTenure);

    // Chart data: balance over time
    const chartData: { month: number; without: number; with: number }[] = [];
    const schedWithout = amortizationSchedule(balanceAfterPaid, rate, Math.ceil(remainingMonths / 12) + 1);
    const fullWithSchedule = amortizationSchedule(newPrincipal, rate, Math.ceil(withTenure / 12) + 1);

    const maxM = Math.max(remainingMonths, withTenure);
    for (let m = 0; m <= maxM; m += Math.max(1, Math.floor(maxM / 40))) {
      const wo = schedWithout[m - 1]?.balance ?? (m === 0 ? balanceAfterPaid : 0);
      let wi = 0;
      if (m <= prepayIdx) {
        wi = preSchedule[m - 1]?.balance ?? (m === 0 ? balanceAfterPaid : 0);
      } else {
        wi = fullWithSchedule[m - prepayIdx - 1]?.balance ?? 0;
      }
      chartData.push({ month: m, without: Math.round(Math.max(0, wo)), with: Math.round(Math.max(0, wi)) });
    }

    return {
      withoutEMI,
      withEMI,
      withoutTenure,
      withTenure,
      withoutInterest,
      withInterest: preInterest + withInterest,
      interestSaved,
      timeSavedMonths,
      withoutClose,
      withClose,
      chartData,
      withoutTotal: withoutInterest + balanceAfterPaid,
      withTotal: preInterest + withInterest + newPrincipal + prepayAmt,
    };
  }, [loanAmt, rate, tenure, emisPaid, prepayAmt, prepayMonth, mode]);

  const share = () => {
    const url = new URL(window.location.href);
    [["la", loanAmt], ["r", rate], ["t", tenure], ["ep", emisPaid], ["pa", prepayAmt], ["pm", prepayMonth]].forEach(
      ([k, v]) => url.searchParams.set(String(k), String(v))
    );
    navigator.clipboard.writeText(url.toString());
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Sticky mobile result bar */}
      <div className="md:hidden sticky top-14 z-40 bg-[var(--bg-card)] border-b border-[var(--border-default)] px-4 py-3 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-xs text-[var(--text-secondary)]">Interest saved</p>
          <p className="text-xl font-bold text-[#10B981] dark:text-[#34D399] tabular-nums">{formatShort(result.interestSaved)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--text-secondary)]">Time saved</p>
          <p className="text-base font-bold text-[#F59E0B]">{formatTenure(result.timeSavedMonths)}</p>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-card)] rounded-2xl p-6 shadow-sm border border-[var(--border-default)]">
          <h2 className="font-semibold text-[var(--text-primary)] mb-5 text-lg">Loan Details</h2>
          <SliderInput label="Original Loan Amount" value={loanAmt} min={100000} max={50000000} step={50000} onChange={setLoanAmt} prefix="₹" format={formatIndian} hint="From your loan sanction letter" />
          <SliderInput label="Annual Interest Rate" value={rate} min={5} max={20} step={0.1} onChange={setRate} suffix="%" format={(v) => v.toFixed(1)} hint="Current applicable rate" />
          <SliderInput label="Original Tenure" value={tenure} min={1} max={30} step={1} onChange={setTenure} suffix=" yr" format={String} hint="Total loan period agreed" />
          <SliderInput label="EMIs Already Paid" value={emisPaid} min={0} max={tenure * 12 - 1} step={1} onChange={setEmisPaid} suffix=" months" format={String} hint="How many monthly payments done so far" />
        </div>

        <div className="bg-[var(--bg-card)] rounded-2xl p-6 shadow-sm border border-[var(--border-default)]">
          <h2 className="font-semibold text-[var(--text-primary)] mb-5 text-lg">Prepayment Details</h2>
          <SliderInput label="Prepayment Amount" value={prepayAmt} min={10000} max={loanAmt} step={10000} onChange={setPrepayAmt} prefix="₹" format={formatIndian} />
          <SliderInput label="Prepayment After (months from now)" value={prepayMonth} min={1} max={Math.max(1, tenure * 12 - emisPaid - 1)} step={1} onChange={setPrepayMonth} suffix=" mo" format={String} />

          <div className="mt-4">
            <p className="text-sm font-medium text-[var(--text-primary)] mb-3">After prepayment, I want to:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setMode("reduceTenure")}
                className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all ${
                  mode === "reduceTenure"
                    ? "bg-[#0D9488] text-white border-[#0D9488]"
                    : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-default)] hover:border-[#0D9488]"
                }`}
              >
                Reduce tenure
                <br />
                <span className="text-xs font-normal opacity-80">Keep same EMI</span>
              </button>
              <button
                onClick={() => setMode("reduceEMI")}
                className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all ${
                  mode === "reduceEMI"
                    ? "bg-[#0D9488] text-white border-[#0D9488]"
                    : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-default)] hover:border-[#0D9488]"
                }`}
              >
                Reduce EMI
                <br />
                <span className="text-xs font-normal opacity-80">Keep same tenure</span>
              </button>
            </div>
          </div>

          <button onClick={share} className="mt-4 text-sm text-[#0D9488] dark:text-[#14B8A6] hover:underline">
            🔗 Share this calculation
          </button>
        </div>
      </div>

      {/* Comparison */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[var(--bg-card)] rounded-2xl p-6 shadow-sm border border-[var(--border-default)]">
          <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-4">Without Prepayment</p>
          <Row label="Monthly EMI" value={formatINR(Math.round(result.withoutEMI))} />
          <Row label="Remaining Tenure" value={formatTenure(result.withoutTenure)} />
          <Row label="Total Interest Remaining" value={formatShort(result.withoutInterest)} color="text-red-500" />
          <Row label="Loan Closes On" value={result.withoutClose} />
        </div>
        <div className="bg-[var(--bg-card)] rounded-2xl p-6 shadow-sm border border-[var(--border-default)] relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#10B981] dark:bg-[#34D399] text-white text-xs px-3 py-1 rounded-bl-xl font-medium">
            With Prepayment
          </div>
          <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-4">With Prepayment</p>
          <Row label="Monthly EMI" value={formatINR(Math.round(result.withEMI))} />
          <Row label="Remaining Tenure" value={formatTenure(result.withTenure)} />
          <Row label="Total Interest Remaining" value={formatShort(result.withInterest)} color="text-[#10B981] dark:text-[#34D399]" />
          <Row label="Loan Closes On" value={result.withClose} />
        </div>
      </div>

      {/* Savings callout */}
      <div className="bg-[#FFF8E7] dark:bg-amber-950/40 border border-[#F59E0B]/30 dark:border-amber-800 rounded-2xl p-6">
        <h3 className="font-bold text-[var(--text-primary)] mb-4 text-lg">💰 Your Savings</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="text-center">
            <AnimatedNumber value={result.interestSaved} duration={700} formatter={(n) => formatShort(n)} className="text-3xl font-bold text-[#F59E0B] tabular-nums result-value" aria-live="polite" aria-atomic="true" />
            <p className="text-sm text-[var(--text-secondary)] mt-1">✅ Interest saved</p>
          </div>
          <div className="text-center">
            <AnimatedNumber value={result.timeSavedMonths} duration={700} formatter={(n) => formatTenure(Math.round(n))} className="text-3xl font-bold text-[#10B981] dark:text-[#34D399] tabular-nums result-value" aria-live="polite" aria-atomic="true" />
            <p className="text-sm text-[var(--text-secondary)] mt-1">✅ Time saved</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
              <span>🎯</span> Loan closes on
            </p>
            <p className="text-3xl font-bold text-teal-600 dark:text-teal-400 mt-1">
              {result.withClose}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              instead of {result.withoutClose}
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-[var(--bg-card)] rounded-2xl p-6 shadow-sm border border-[var(--border-default)]">
        <h3 className="font-semibold text-[var(--text-primary)] mb-1">Outstanding Balance Over Time</h3>
        <p className="text-xs text-[var(--text-tertiary)] mb-4">The gap between the two lines is your interest saving</p>
        <PrepayChart data={result.chartData} />
        <EmailCapture />
      </div>

      <RelatedTools />

      <PrepayTips interestSaved={result.interestSaved} timeSavedMonths={result.timeSavedMonths} mode={mode} />

      <div className="bg-blue-50 dark:bg-[#0f1f33] border border-blue-100 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-300">
        💡 Most Indian banks allow 25% annual prepayment on floating rate home loans with no penalty. Check with your bank for the exact terms.
      </div>
    </div>
  );
}

function Row({ label, value, color = "text-[var(--text-primary)]" }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-[var(--border-subtle)] last:border-0">
      <span className="text-sm text-[var(--text-secondary)]">{label}</span>
      <span className={`text-sm font-semibold tabular-nums ${color}`}>{value}</span>
    </div>
  );
}
