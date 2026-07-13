"use client";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import SliderInput from "@/components/SliderInput";
import EmailCapture from "@/components/EmailCapture";
import { formatINR, formatShort, formatIndian } from "@/lib/utils";
import { calculateFDMaturity, calculateRDMaturity, type CompoundingFrequency } from "@/lib/calculators/fd";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { useTranslation } from "@/components/i18n/LanguageProvider";

const FDChart = dynamic(() => import("./FDChart"), {
  ssr: false,
  loading: () => <div className="h-[240px] rounded-xl bg-[var(--bg-elevated)] animate-pulse" />,
});

type Tab = "fd" | "rd";
const FREQS: { value: CompoundingFrequency; labelKey: string }[] = [
  { value: "monthly", labelKey: "fd.calculator.freqMonthly" },
  { value: "quarterly", labelKey: "fd.calculator.freqQuarterly" },
  { value: "half-yearly", labelKey: "fd.calculator.freqHalfYearly" },
  { value: "annually", labelKey: "fd.calculator.freqAnnually" },
];

export default function FDCalculator() {
  const { t } = useTranslation();
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
      <div className="md:hidden sticky top-14 z-40 bg-[var(--bg-card)] border-b border-[var(--border-default)] px-4 py-3 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-xs text-[var(--text-secondary)]">{t("fd.calculator.mobileMaturityLabel")}</p>
          <p className="text-2xl font-bold text-[#0D9488] dark:text-[#14B8A6] tabular-nums" aria-live="polite" aria-atomic="true">{formatShort(maturity)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--text-secondary)]">{t("fd.calculator.mobileInterestLabel")}</p>
          <p className="text-base font-semibold text-[#10B981] dark:text-[#34D399] tabular-nums" aria-live="polite">{formatShort(interest)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {(["fd", "rd"] as Tab[]).map((tabKey) => (
          <button
            key={tabKey}
            onClick={() => setTab(tabKey)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              tab === tabKey ? "bg-[#0D9488] text-white" : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
            }`}
          >
            {tabKey === "fd" ? t("fd.calculator.tabFixedDeposit") : t("fd.calculator.tabRecurringDeposit")}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Inputs */}
        <div className="bg-[var(--bg-card)] rounded-2xl p-5 sm:p-6 shadow-sm border border-[var(--border-default)]">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xl" aria-hidden="true">🏦</span>
            <h2 className="font-bold text-[var(--text-primary)] text-lg">{t("fd.calculator.depositDetails")}</h2>
          </div>
          {isFD ? (
            <SliderInput label={t("fd.calculator.depositAmountLabel")} value={principal} min={10000} max={10000000} step={10000} onChange={setPrincipal} prefix="₹" format={formatIndian} rangeHint={t("fd.calculator.depositAmountRangeHint")} />
          ) : (
            <SliderInput label={t("fd.calculator.monthlyDepositLabel")} value={monthly} min={500} max={200000} step={500} onChange={setMonthly} prefix="₹" format={formatIndian} rangeHint={t("fd.calculator.monthlyDepositRangeHint")} />
          )}
          <SliderInput label={t("fd.calculator.interestRateLabel")} value={rate} min={3} max={9} step={0.05} onChange={setRate} suffix="%" format={(v) => v.toFixed(2)} hint={t("fd.calculator.interestRateHint")} />
          <SliderInput label={t("fd.calculator.tenureLabel")} value={tenureMonths} min={3} max={120} step={1} onChange={setTenureMonths} suffix=" mo" format={String} rangeHint={t("fd.calculator.tenureRangeHint")} />

          {isFD && (
            <div className="mb-4">
              <label className="text-sm font-medium text-[var(--text-primary)] mb-2 block">{t("fd.calculator.compoundingFrequency")}</label>
              <div className="flex flex-wrap gap-2">
                {FREQS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFreq(f.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      freq === f.value ? "bg-[#0D9488] text-white" : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                    }`}
                  >
                    {t(f.labelKey)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <label className="flex items-center gap-2 mt-2 cursor-pointer text-sm text-[var(--text-primary)]">
            <input type="checkbox" checked={senior} onChange={(e) => setSenior(e.target.checked)} className="accent-[#0D9488] w-4 h-4" />
            {t("fd.calculator.seniorCitizenLabel")}
          </label>
        </div>

        {/* Results */}
        <div className="flex flex-col gap-4">
          <div className="hidden md:block bg-[var(--bg-card)] rounded-2xl p-6 shadow-sm border border-[var(--border-default)]">
            <p className="text-sm text-[var(--text-secondary)] mb-1">{t("fd.calculator.maturityValue")}</p>
            <AnimatedNumber value={maturity} duration={700} formatter={(n) => formatINR(Math.round(n))} className="text-5xl font-bold text-[#0D9488] dark:text-[#14B8A6] tabular-nums" aria-live="polite" aria-atomic="true" />
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="bg-[var(--bg-base)] rounded-xl p-3">
                <p className="text-xs text-[var(--text-secondary)] mb-1">{isFD ? t("fd.calculator.invested") : t("fd.calculator.totalDeposited")}</p>
                <p className="font-bold text-[var(--text-primary)] tabular-nums text-lg">{formatShort(invested)}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-3">
                <p className="text-xs text-[var(--text-secondary)] mb-1">{t("fd.calculator.interestEarned")}</p>
                <AnimatedNumber value={interest} duration={600} formatter={(n) => formatShort(n)} className="font-bold text-[#10B981] dark:text-[#34D399] tabular-nums text-lg" aria-live="polite" />
              </div>
            </div>
            {isFD && (
              <p className="text-xs text-[var(--text-tertiary)] mt-3">{t("fd.calculator.effectiveYield", { value: fd.effectiveYield.toFixed(2) })}</p>
            )}
          </div>

          <div className="md:hidden bg-[var(--bg-card)] rounded-2xl p-5 shadow-sm border border-[var(--border-default)]">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[var(--bg-base)] rounded-xl p-3">
                <p className="text-xs text-[var(--text-secondary)] mb-1">{isFD ? t("fd.calculator.invested") : t("fd.calculator.totalDeposited")}</p>
                <p className="font-bold text-[var(--text-primary)] tabular-nums">{formatShort(invested)}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-3">
                <p className="text-xs text-[var(--text-secondary)] mb-1">{t("fd.calculator.interestEarned")}</p>
                <p className="font-bold text-[#10B981] dark:text-[#34D399] tabular-nums">{formatShort(interest)}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] rounded-2xl p-5 sm:p-6 shadow-sm border border-[var(--border-default)]">
            <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">{t("fd.calculator.chartHeading")}</p>
            <p className="text-xs text-[var(--text-tertiary)] mb-3">{t("fd.calculator.chartSubtitle")}</p>
            <FDChart data={chartData} />
            <EmailCapture sourcePage="fd" />
          </div>
        </div>
      </div>
    </>
  );
}
