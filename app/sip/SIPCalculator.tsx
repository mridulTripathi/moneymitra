"use client";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import EmailCapture from "@/components/EmailCapture";

const SIPChart = dynamic(() => import("./SIPChart"), {
  ssr: false,
  loading: () => <div className="h-[300px] rounded-xl bg-[var(--bg-elevated)] animate-pulse" />,
});
import SliderInput from "@/components/SliderInput";
import SIPTips from "@/components/tips/SIPTips";
import { formatINR, formatShort, formatIndian } from "@/lib/utils";
import { calculateStepUpSIP } from "@/lib/calculators/sip";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

type Tab = "basic" | "stepup";

function calcBasicSIP(monthly: number, annualReturn: number, years: number) {
  const r = annualReturn / 12 / 100;
  const n = years * 12;
  const corpus = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  return corpus;
}

function calcStepUpSIP(monthly: number, annualReturn: number, years: number, stepUpPct: number) {
  let corpus = 0;
  let currentMonthly = monthly;
  const r = annualReturn / 12 / 100;
  for (let y = 0; y < years; y++) {
    for (let m = 0; m < 12; m++) {
      const monthsLeft = (years - y) * 12 - m;
      corpus += currentMonthly * Math.pow(1 + r, monthsLeft);
    }
    currentMonthly *= 1 + stepUpPct / 100;
  }
  return corpus;
}

function buildYearlyData(monthly: number, annualReturn: number, years: number, stepUpPct = 0) {
  const r = annualReturn / 12 / 100;
  const data = [];
  let corpus = 0;
  let invested = 0;
  let currentMonthly = monthly;
  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      corpus = (corpus + currentMonthly) * (1 + r);
      invested += currentMonthly;
    }
    data.push({
      year: y,
      invested: Math.round(invested),
      gains: Math.round(Math.max(0, corpus - invested)),
    });
    if (stepUpPct > 0) currentMonthly *= 1 + stepUpPct / 100;
  }
  return data;
}

export default function SIPCalculator() {
  const [tab, setTab] = useState<Tab>("basic");
  const [monthly, setMonthly] = useState(10000);
  const [returnRate, setReturnRate] = useState(12);
  const [years, setYears] = useState(15);
  const [stepUp, setStepUp] = useState(10);

  const result = useMemo(() => {
    const totalInvested = tab === "basic"
      ? monthly * 12 * years
      : (() => {
          let inv = 0, m = monthly;
          for (let y = 0; y < years; y++) { inv += m * 12; m *= 1 + stepUp / 100; }
          return inv;
        })();

    const corpus = tab === "basic"
      ? calcBasicSIP(monthly, returnRate, years)
      : calcStepUpSIP(monthly, returnRate, years, stepUp);

    const gains = corpus - totalInvested;
    const multiplier = corpus / totalInvested;
    const chartData = buildYearlyData(monthly, returnRate, years, tab === "stepup" ? stepUp : 0);

    // Insight: last 5 years contribution
    const last5 = chartData.slice(-5);
    const last5Gains = last5.reduce((s, d) => s + d.gains, 0) - (chartData[chartData.length - 6]?.gains ?? 0);
    const totalGains = gains;
    const last5Pct = totalGains > 0 ? ((last5Gains / corpus) * 100).toFixed(0) : "0";
    const last5Amount = chartData[chartData.length - 1]
      ? Math.round(corpus - (chartData[Math.max(0, chartData.length - 6)]?.invested ?? 0) - (chartData[Math.max(0, chartData.length - 6)]?.gains ?? 0))
      : 0;

    return { totalInvested, corpus, gains, multiplier, chartData, last5Pct, last5Amount };
  }, [tab, monthly, returnRate, years, stepUp]);

  const share = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("m", String(monthly));
    url.searchParams.set("r", String(returnRate));
    url.searchParams.set("y", String(years));
    if (tab === "stepup") url.searchParams.set("su", String(stepUp));
    navigator.clipboard.writeText(url.toString());
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Sticky mobile result bar */}
      <div className="md:hidden sticky top-14 z-40 bg-[var(--bg-card)] border-b border-[var(--border-default)] px-4 py-3 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-xs text-[var(--text-secondary)]">Total Corpus</p>
          <p className="text-xl font-bold text-[#0D9488] dark:text-[#14B8A6] tabular-nums">{formatShort(result.corpus)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--text-secondary)]">Returns</p>
          <p className="text-base font-bold text-[#F59E0B] tabular-nums">{result.multiplier.toFixed(1)}x</p>
        </div>
      </div>
      {/* Tab switcher */}
      <div className="flex bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl p-1 w-fit shadow-sm">
        {(["basic", "stepup"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t ? "bg-[#0D9488] text-white shadow-sm" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {t === "basic" ? "Basic SIP" : "Step-Up SIP"}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
        {/* Inputs */}
        <div className="bg-[var(--bg-card)] rounded-2xl p-6 shadow-sm border border-[var(--border-default)]">
          <h2 className="font-semibold text-[var(--text-primary)] mb-5 text-lg">Investment Details</h2>
          <SliderInput label="Monthly Investment" value={monthly} min={500} max={500000} step={500} onChange={setMonthly} prefix="₹" format={formatIndian} hint="How much you invest each month" />
          <SliderInput label="Expected Annual Return" value={returnRate} min={6} max={25} step={0.5} onChange={setReturnRate} suffix="%" format={(v) => v.toFixed(1)} hint="Equity MFs avg ~12%, debt ~7%" />
          <SliderInput label="Investment Period" value={years} min={1} max={40} step={1} onChange={setYears} suffix=" yr" format={String} hint="Longer = more compounding" />
          {tab === "stepup" && (
            <SliderInput label="Annual Step-Up %" value={stepUp} min={1} max={50} step={1} onChange={setStepUp} suffix="%" format={String} hint="Increase SIP by this % each year" />
          )}
          <button onClick={share} className="mt-2 text-sm text-[#0D9488] dark:text-[#14B8A6] hover:underline">
            🔗 Share this calculation
          </button>
        </div>

        {/* Results */}
        <div className="flex flex-col gap-4">
          <div className="bg-[var(--bg-card)] rounded-2xl p-6 shadow-sm border border-[var(--border-default)]">
            <p className="text-sm text-[var(--text-secondary)] mb-1">Total Corpus</p>
            <AnimatedNumber value={result.corpus} duration={800} formatter={(n) => formatShort(n)} className="text-4xl font-bold text-[#0D9488] dark:text-[#14B8A6] tabular-nums result-value" aria-live="polite" aria-atomic="true" />
            <div className="inline-block bg-[#F59E0B]/10 text-[#D97706] dark:text-[#FBBF24] text-sm font-bold px-3 py-1 rounded-full mt-2">
              {result.multiplier.toFixed(1)}x your money
            </div>
            {/* Step-up callout — only show when on basic SIP tab */}
            {tab === 'basic' && (
              <button onClick={() => setTab('stepup')} className="w-full mt-3 flex items-center justify-between bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-3 text-left">
                <p className="text-sm text-[var(--text-primary)]">
                  💡 <strong>Step up 10%/yr:</strong> corpus grows to{' '}
                  <span className="text-[#0D9488] font-bold">{formatShort(calculateStepUpSIP(monthly, returnRate, years, 10))}</span>
                  {' '}— {formatShort(calculateStepUpSIP(monthly, returnRate, years, 10) - result.corpus)} more
                </p>
                <span className="text-[var(--text-secondary)] ml-3 flex-shrink-0">Switch →</span>
              </button>
            )}
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[var(--text-secondary)]">Total Invested</p>
                <AnimatedNumber value={result.totalInvested} duration={600} formatter={(n) => formatShort(n)} className="font-semibold tabular-nums" />
              </div>
              <div>
                <p className="text-[var(--text-secondary)]">Estimated Returns</p>
                <AnimatedNumber value={result.gains} duration={700} formatter={(n) => formatShort(n)} className="font-semibold text-[#10B981] dark:text-[#34D399] tabular-nums" />
              </div>
            </div>
          </div>

          {/* Insight */}
          <div className="bg-[#F0FDF9] dark:bg-emerald-950/40 border border-[#10B981]/20 dark:border-emerald-800 rounded-2xl p-4 text-sm text-[#064E3B] dark:text-emerald-300">
            <p className="font-medium mb-1">💡 Power of Compounding</p>
            <p>
              Your final 5 years contribute <strong>{formatShort(Math.abs(result.last5Amount))}</strong> to your
              total corpus — that&apos;s <strong>{result.last5Pct}%</strong> of the total. This is why
              staying invested matters.
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-[var(--bg-card)] rounded-2xl p-6 shadow-sm border border-[var(--border-default)]">
        <h3 className="font-semibold text-[var(--text-primary)] mb-1">Wealth Growth Year by Year</h3>
        <p className="text-xs text-[var(--text-tertiary)] mb-4">Teal = invested, amber = returns. Notice how returns overtake investments over time.</p>
        <SIPChart data={result.chartData} years={years} />
        <EmailCapture />
      </div>

      <SIPTips corpus={result.corpus} tab={tab} last5Pct={Number(result.last5Pct)} />
    </div>
  );
}
