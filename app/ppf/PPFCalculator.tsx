"use client";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import SliderInput from "@/components/SliderInput";
import EmailCapture from "@/components/EmailCapture";
import { formatINR, formatShort, formatIndian } from "@/lib/utils";
import { calculatePPF } from "@/lib/calculators/ppf";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { useTranslation } from "@/components/i18n/LanguageProvider";

const PPFChart = dynamic(() => import("./PPFChart"), {
  ssr: false,
  loading: () => <div className="h-[280px] rounded-xl bg-[var(--bg-elevated)] animate-pulse" />,
});

export default function PPFCalculator() {
  const { t } = useTranslation();
  const [yearly, setYearly] = useState(150000);
  const [tenure, setTenure] = useState(15);
  const [rate, setRate] = useState(7.1);
  const [showTable, setShowTable] = useState(false);

  const result = useMemo(() => calculatePPF(yearly, tenure, rate, "start"), [yearly, tenure, rate]);

  const chartData = useMemo(() => {
    const out: { year: number; invested: number; interest: number }[] = [];
    let cumInv = 0;
    let cumInt = 0;
    for (const r of result.yearlyBreakdown) {
      cumInv += r.investment;
      cumInt += r.interest;
      out.push({ year: r.year, invested: cumInv, interest: cumInt });
    }
    return out;
  }, [result]);

  return (
    <>
      <div className="md:hidden sticky top-14 z-40 bg-[var(--bg-card)] border-b border-[var(--border-default)] px-4 py-3 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-xs text-[var(--text-secondary)]">{t("ppf.calculator.mobileMaturityLabel")}</p>
          <p className="text-2xl font-bold text-[#0D9488] dark:text-[#14B8A6] tabular-nums" aria-live="polite" aria-atomic="true">{formatShort(result.maturityValue)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--text-secondary)]">{t("ppf.calculator.mobileInterestLabel")}</p>
          <p className="text-base font-semibold text-[#10B981] dark:text-[#34D399] tabular-nums" aria-live="polite">{formatShort(result.totalInterest)}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-[var(--bg-card)] rounded-2xl p-5 sm:p-6 shadow-sm border border-[var(--border-default)]">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xl" aria-hidden="true">🌱</span>
            <h2 className="font-bold text-[var(--text-primary)] text-lg">{t("ppf.calculator.ppfDetails")}</h2>
          </div>
          <SliderInput label={t("ppf.calculator.yearlyInvestmentLabel")} value={yearly} min={500} max={150000} step={500} onChange={setYearly} prefix="₹" format={formatIndian} hint={t("ppf.calculator.yearlyInvestmentHint")} rangeHint={t("ppf.calculator.yearlyInvestmentRangeHint")} />
          <SliderInput label={t("ppf.calculator.tenureLabel")} value={tenure} min={15} max={50} step={1} onChange={setTenure} suffix=" yr" format={String} hint={t("ppf.calculator.tenureHint")} />
          <SliderInput label={t("ppf.calculator.interestRateLabel")} value={rate} min={6} max={9} step={0.1} onChange={setRate} suffix="%" format={(v) => v.toFixed(1)} hint={t("ppf.calculator.interestRateHint")} />
          {yearly >= 150000 && (
            <p className="text-xs text-[var(--text-tertiary)] mt-1">{t("ppf.calculator.cappedNote")}</p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="hidden md:block bg-[var(--bg-card)] rounded-2xl p-6 shadow-sm border border-[var(--border-default)]">
            <p className="text-sm text-[var(--text-secondary)] mb-1">{t("ppf.calculator.maturityValue")}</p>
            <AnimatedNumber value={result.maturityValue} duration={800} formatter={(n) => formatINR(Math.round(n))} className="text-5xl font-bold text-[#0D9488] dark:text-[#14B8A6] tabular-nums" aria-live="polite" aria-atomic="true" />
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="bg-[var(--bg-base)] rounded-xl p-3">
                <p className="text-xs text-[var(--text-secondary)] mb-1">{t("ppf.calculator.totalInvested")}</p>
                <p className="font-bold text-[var(--text-primary)] tabular-nums text-lg">{formatShort(result.totalInvested)}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-3">
                <p className="text-xs text-[var(--text-secondary)] mb-1">{t("ppf.calculator.totalInterest")}</p>
                <AnimatedNumber value={result.totalInterest} duration={700} formatter={(n) => formatShort(n)} className="font-bold text-[#10B981] dark:text-[#34D399] tabular-nums text-lg" aria-live="polite" />
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] rounded-2xl p-5 sm:p-6 shadow-sm border border-[var(--border-default)]">
            <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">{t("ppf.calculator.chartHeading")}</p>
            <p className="text-xs text-[var(--text-tertiary)] mb-3">{t("ppf.calculator.chartSubtitle")}</p>
            <PPFChart data={chartData} />
            <EmailCapture sourcePage="ppf" />
          </div>
        </div>
      </div>

      <div className="mt-5 bg-[var(--bg-card)] rounded-2xl p-5 sm:p-6 shadow-sm border border-[var(--border-default)]">
        <button onClick={() => setShowTable(!showTable)} className="font-semibold text-[#0D9488] dark:text-[#14B8A6] hover:text-[#0F766E] flex items-center gap-2 transition-colors" aria-expanded={showTable}>
          <span className="text-lg" aria-hidden="true">{showTable ? "▲" : "▼"}</span>
          {showTable ? t("ppf.calculator.hideBreakdown") : t("ppf.calculator.viewBreakdown")}
        </button>
        {showTable && (
          <div className="overflow-x-auto -mx-1 mt-4">
            <table className="w-full text-sm min-w-[420px]">
              <thead>
                <tr className="border-b-2 border-[var(--border-default)]">
                  <th className="text-left py-2.5 pr-4 text-[var(--text-secondary)] font-semibold" scope="col">{t("ppf.calculator.tableYear")}</th>
                  <th className="text-right py-2.5 pr-4 text-[var(--text-secondary)] font-semibold" scope="col">{t("ppf.calculator.tableOpening")}</th>
                  <th className="text-right py-2.5 pr-4 text-[var(--text-secondary)] font-semibold" scope="col">{t("ppf.calculator.tableInvested")}</th>
                  <th className="text-right py-2.5 pr-4 text-[var(--text-secondary)] font-semibold" scope="col">{t("ppf.calculator.tableInterest")}</th>
                  <th className="text-right py-2.5 text-[var(--text-secondary)] font-semibold" scope="col">{t("ppf.calculator.tableClosing")}</th>
                </tr>
              </thead>
              <tbody>
                {result.yearlyBreakdown.map((row) => (
                  <tr key={row.year} className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-base)] transition-colors">
                    <td className="py-2.5 pr-4 font-medium text-[var(--text-primary)]">{t("ppf.calculator.tableRowYear", { n: row.year })}</td>
                    <td className="py-2.5 pr-4 text-right text-[var(--text-secondary)] tabular-nums">{formatINR(Math.round(row.opening))}</td>
                    <td className="py-2.5 pr-4 text-right text-[var(--text-primary)] tabular-nums">{formatINR(Math.round(row.investment))}</td>
                    <td className="py-2.5 pr-4 text-right text-[#10B981] dark:text-[#34D399] tabular-nums font-medium">{formatINR(Math.round(row.interest))}</td>
                    <td className="py-2.5 text-right text-[var(--text-primary)] tabular-nums font-medium">{formatINR(Math.round(row.closing))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
