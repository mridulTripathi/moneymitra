"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import SliderInput from "@/components/SliderInput";
import EmailCapture from "@/components/EmailCapture";
import { formatINR, formatIndian } from "@/lib/utils";
import { calculateHRAExemption } from "@/lib/calculators/hra";
import { useTranslation } from "@/components/i18n/LanguageProvider";

export default function HRACalculator() {
  const { t } = useTranslation();
  const [basic, setBasic] = useState(50000);
  const [da, setDa] = useState(0);
  const [hraReceived, setHraReceived] = useState(20000);
  const [rent, setRent] = useState(25000);
  const [isMetro, setIsMetro] = useState(true);

  const result = useMemo(
    () => calculateHRAExemption(basic, da, hraReceived, rent, isMetro),
    [basic, da, hraReceived, rent, isMetro]
  );

  const rows = [
    { label: t("hra.calculator.actualHraReceived"), value: result.value1, winner: result.exemption === result.value1 },
    { label: isMetro ? t("hra.calculator.metroPctOfBasic") : t("hra.calculator.nonMetroPctOfBasic"), value: result.value2, winner: result.exemption === result.value2 },
    { label: t("hra.calculator.rentMinusTenPct"), value: result.value3, winner: result.exemption === result.value3 },
  ];

  return (
    <>
      <div className="md:hidden sticky top-14 z-40 bg-[var(--bg-card)] border-b border-[var(--border-default)] px-4 py-3 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-xs text-[var(--text-secondary)]">{t("hra.calculator.mobileExemptLabel")}</p>
          <p className="text-2xl font-bold text-[#10B981] dark:text-[#34D399] tabular-nums" aria-live="polite" aria-atomic="true">{formatINR(Math.round(result.exemption))}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--text-secondary)]">{t("hra.calculator.mobileTaxableLabel")}</p>
          <p className="text-base font-semibold text-red-500 tabular-nums" aria-live="polite">{formatINR(Math.round(result.taxableHRA))}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-[var(--bg-card)] rounded-2xl p-5 sm:p-6 shadow-sm border border-[var(--border-default)]">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xl" aria-hidden="true">🏠</span>
            <h2 className="font-bold text-[var(--text-primary)] text-lg">{t("hra.calculator.salaryRentHeading")}</h2>
          </div>
          <SliderInput label={t("hra.calculator.basicSalaryLabel")} value={basic} min={5000} max={500000} step={1000} onChange={setBasic} prefix="₹" format={formatIndian} hint={t("hra.calculator.basicSalaryHint")} />
          <SliderInput label={t("hra.calculator.daLabel")} value={da} min={0} max={200000} step={1000} onChange={setDa} prefix="₹" format={formatIndian} hint={t("hra.calculator.daHint")} />
          <SliderInput label={t("hra.calculator.hraReceivedLabel")} value={hraReceived} min={0} max={300000} step={1000} onChange={setHraReceived} prefix="₹" format={formatIndian} hint={t("hra.calculator.hraReceivedHint")} />
          <SliderInput label={t("hra.calculator.rentPaidLabel")} value={rent} min={0} max={300000} step={1000} onChange={setRent} prefix="₹" format={formatIndian} hint={t("hra.calculator.rentPaidHint")} />
          <label className="flex items-center gap-2 mt-2 cursor-pointer text-sm text-[var(--text-primary)]">
            <input type="checkbox" checked={isMetro} onChange={(e) => setIsMetro(e.target.checked)} className="accent-[#0D9488] w-4 h-4" />
            {t("hra.calculator.metroCheckbox")}
          </label>
        </div>

        <div className="flex flex-col gap-4">
          <div className="hidden md:block bg-[var(--bg-card)] rounded-2xl p-6 shadow-sm border border-[var(--border-default)]">
            <p className="text-sm text-[var(--text-secondary)] mb-1">{t("hra.calculator.exemptHraPerMonth")}</p>
            <p className="text-5xl font-bold text-[#10B981] dark:text-[#34D399] tabular-nums" aria-live="polite" aria-atomic="true">{formatINR(Math.round(result.exemption))}</p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-xl p-3">
                <p className="text-xs text-[var(--text-secondary)] mb-1">{t("hra.calculator.exemptPerYear")}</p>
                <p className="font-bold text-[#10B981] dark:text-[#34D399] tabular-nums text-lg">{formatINR(Math.round(result.exemption * 12))}</p>
              </div>
              <div className="bg-red-50 dark:bg-red-950/50 rounded-xl p-3">
                <p className="text-xs text-[var(--text-secondary)] mb-1">{t("hra.calculator.taxablePerMonth")}</p>
                <p className="font-bold text-red-500 tabular-nums text-lg" aria-live="polite">{formatINR(Math.round(result.taxableHRA))}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] rounded-2xl p-5 sm:p-6 shadow-sm border border-[var(--border-default)]">
            <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">{t("hra.calculator.threeConditionHeading")}</p>
            <p className="text-xs text-[var(--text-tertiary)] mb-3">{t("hra.calculator.threeConditionSubtitle")}</p>
            <div className="flex flex-col gap-2">
              {rows.map((r) => (
                <div key={r.label} className={`flex items-center justify-between rounded-xl px-4 py-3 border ${r.winner ? "bg-[var(--tip-bg)] border-[#0D9488]/30" : "bg-[var(--bg-base)] border-[var(--border-default)]"}`}>
                  <span className="text-sm text-[#374151] dark:text-[#CBD5E1]">{r.label}</span>
                  <span className={`text-sm font-bold tabular-nums ${r.winner ? "text-[#0D9488] dark:text-[#14B8A6]" : "text-[var(--text-primary)]"}`}>
                    {formatINR(Math.round(Math.max(0, r.value)))}{r.winner ? t("hra.calculator.winnerSuffix") : ""}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-[var(--text-tertiary)] mt-3">
              {t("hra.calculator.oldRegimeOnlyNote")}
              <Link href="/tax" className="text-[#0D9488] dark:text-[#14B8A6] hover:text-[#0F766E] font-medium">{t("hra.calculator.compareRegimesLink")}</Link>
            </p>
            <EmailCapture sourcePage="hra" />
          </div>
        </div>
      </div>
    </>
  );
}
