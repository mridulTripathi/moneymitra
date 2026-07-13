"use client";
import { useState, useMemo } from "react";
import SliderInput from "@/components/SliderInput";
import EmailCapture from "@/components/EmailCapture";
import { formatINR, formatShort, formatIndian } from "@/lib/utils";
import { calculateGratuity } from "@/lib/calculators/gratuity";
import { useTranslation } from "@/components/i18n/LanguageProvider";

export default function GratuityCalculator() {
  const { t } = useTranslation();
  const [basicPlusDA, setBasicPlusDA] = useState(50000);
  const [years, setYears] = useState(10);
  const [isCovered, setIsCovered] = useState(true);

  const result = useMemo(() => calculateGratuity(basicPlusDA, years, isCovered), [basicPlusDA, years, isCovered]);

  return (
    <>
      <div className="md:hidden sticky top-14 z-40 bg-[var(--bg-card)] border-b border-[var(--border-default)] px-4 py-3 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-xs text-[var(--text-secondary)]">{t("gratuity.calculator.mobileGratuityLabel")}</p>
          <p className="text-2xl font-bold text-[#0D9488] dark:text-[#14B8A6] tabular-nums" aria-live="polite" aria-atomic="true">{result.eligible ? formatShort(result.gratuity) : "—"}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--text-secondary)]">{t("gratuity.calculator.mobileTaxFreeLabel")}</p>
          <p className="text-base font-semibold text-[#10B981] dark:text-[#34D399] tabular-nums" aria-live="polite">{formatShort(result.taxFree)}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-[var(--bg-card)] rounded-2xl p-5 sm:p-6 shadow-sm border border-[var(--border-default)]">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xl" aria-hidden="true">🎁</span>
            <h2 className="font-bold text-[var(--text-primary)] text-lg">{t("gratuity.calculator.serviceDetailsHeading")}</h2>
          </div>
          <SliderInput label={t("gratuity.calculator.basicPlusDaLabel")} value={basicPlusDA} min={5000} max={500000} step={1000} onChange={setBasicPlusDA} prefix="₹" format={formatIndian} hint={t("gratuity.calculator.basicPlusDaHint")} />
          <SliderInput label={t("gratuity.calculator.yearsLabel")} value={years} min={1} max={40} step={1} onChange={setYears} suffix=" yr" format={String} hint={t("gratuity.calculator.yearsHint")} />
          <div className="mb-2">
            <label className="text-sm font-medium text-[var(--text-primary)] mb-2 block">{t("gratuity.calculator.coveredQuestionLabel")}</label>
            <div className="flex gap-2">
              <button onClick={() => setIsCovered(true)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isCovered ? "bg-[#0D9488] text-white" : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"}`}>{t("gratuity.calculator.coveredButton")}</button>
              <button onClick={() => setIsCovered(false)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!isCovered ? "bg-[#0D9488] text-white" : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"}`}>{t("gratuity.calculator.notCoveredButton")}</button>
            </div>
            <p className="text-xs text-[var(--text-tertiary)] mt-2">{t("gratuity.calculator.helperNote")}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-[var(--bg-card)] rounded-2xl p-6 shadow-sm border border-[var(--border-default)]">
            {result.eligible ? (
              <>
                <p className="text-sm text-[var(--text-secondary)] mb-1">{t("gratuity.calculator.gratuityAmount")}</p>
                <p className="text-5xl font-bold text-[#0D9488] dark:text-[#14B8A6] tabular-nums" aria-live="polite" aria-atomic="true">{formatINR(Math.round(result.gratuity))}</p>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-xl p-3">
                    <p className="text-xs text-[var(--text-secondary)] mb-1">{t("gratuity.calculator.taxFreePortion")}</p>
                    <p className="font-bold text-[#10B981] dark:text-[#34D399] tabular-nums text-lg">{formatShort(result.taxFree)}</p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950/50 rounded-xl p-3">
                    <p className="text-xs text-[var(--text-secondary)] mb-1">{t("gratuity.calculator.taxablePortion")}</p>
                    <p className="font-bold text-red-500 tabular-nums text-lg">{formatShort(result.taxable)}</p>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-tertiary)] mt-3">
                  {t("gratuity.calculator.formulaNotePrefix")}{formatINR(basicPlusDA)}{t("gratuity.calculator.formulaNoteMid1")}{years}{t("gratuity.calculator.formulaNoteMid2")}{isCovered ? 26 : 30}{t("gratuity.calculator.formulaNoteSuffix")}
                </p>
              </>
            ) : (
              <div className="py-6 text-center">
                <p className="text-4xl mb-2">{t("gratuity.calculator.notEligibleIcon")}</p>
                <p className="font-bold text-[var(--text-primary)] mb-1">{t("gratuity.calculator.notEligibleHeading")}</p>
                <p className="text-sm text-[var(--text-secondary)]">{t("gratuity.calculator.notEligibleBodyPrefix")}{years}{years !== 1 ? t("gratuity.calculator.notEligibleBodyYearPlural") : t("gratuity.calculator.notEligibleBodyYearSingular")}{t("gratuity.calculator.notEligibleBodySuffix")}</p>
              </div>
            )}
          </div>

          <div className="bg-[var(--bg-card)] rounded-2xl p-5 sm:p-6 shadow-sm border border-[var(--border-default)]">
            <p className="text-sm text-[#374151] dark:text-[#CBD5E1]">
              {t("gratuity.calculator.explainerText")}
            </p>
            <EmailCapture sourcePage="gratuity" />
          </div>
        </div>
      </div>
    </>
  );
}
