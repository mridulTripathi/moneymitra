"use client";
import { SITE_NAME } from "@/lib/seo";
import Link from "next/link";
import { useTranslation } from "@/components/i18n/LanguageProvider";

export default function RatesPageIntro({ lastUpdated }: { lastUpdated: string | null }) {
  const { t } = useTranslation();
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-xs text-[var(--text-tertiary)] mb-4">
        <ol className="flex items-center gap-1">
          <li><Link href="/" className="hover:text-[#0D9488]">{SITE_NAME}</Link></li>
          <li aria-hidden="true">›</li>
          <li className="text-[var(--text-primary)]">{t("rates.breadcrumb")}</li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">{t("rates.title")}</h1>
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-xs font-medium px-3 py-1 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            {t("rates.liveBadge")}
          </div>
          <span className="text-slate-500 dark:text-slate-400 text-sm">
            {t("rates.updatedFrequency", { frequency: t("common.frequencyMonthly") })}
            {lastUpdated ? t("rates.lastUpdated", { date: new Date(lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) }) : ''}
          </span>
        </div>
        <p className="text-xs text-[var(--text-tertiary)] mt-2">
          {t("rates.notRealtimeNote")}
        </p>
      </div>
    </>
  );
}
