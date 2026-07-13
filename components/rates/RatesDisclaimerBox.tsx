"use client";
import { useTranslation } from "@/components/i18n/LanguageProvider";

export default function RatesDisclaimerBox() {
  const { t } = useTranslation();
  return (
    <div className="bg-amber-50 dark:bg-[#3f2d0a] border-l-4 border-amber-400 dark:border-amber-600 rounded-r-xl p-4 my-6">
      <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">{t("rates.disclaimerTitle")}</p>
      <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
        {t("rates.disclaimerBody", { frequency: t("common.frequencyMonthly") })}
      </p>
    </div>
  );
}
