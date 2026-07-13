"use client";
import EmailCapture from "@/components/EmailCapture";
import { useTranslation } from "@/components/i18n/LanguageProvider";

export default function RatesAlertsCard() {
  const { t } = useTranslation();
  return (
    <div className="bg-[var(--tip-bg)] border border-teal-200 dark:border-teal-800 rounded-2xl p-6 mt-6">
      <div className="flex items-start gap-3">
        <span className="text-2xl">📬</span>
        <div className="flex-1">
          <h3 className="font-semibold text-[var(--text-primary)]">{t("rates.alertsHeading")}</h3>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">{t("rates.alertsBody")}</p>
          <EmailCapture sourcePage="rates" />
        </div>
      </div>
    </div>
  );
}
