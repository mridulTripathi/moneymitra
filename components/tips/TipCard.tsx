"use client";
import { ReactNode } from "react";
import { useTranslation } from "@/components/i18n/LanguageProvider";

export function TipCard({ icon = "💡", children }: { icon?: string; children: ReactNode }) {
  return (
    <div className="bg-[var(--tip-bg)] border border-[#0D9488]/20 dark:border-[#14B8A6]/20 rounded-xl p-4 text-sm text-[var(--tip-body)]">
      <div className="flex gap-2">
        <span aria-hidden="true">{icon}</span>
        <div>{children}</div>
      </div>
    </div>
  );
}

export function TipsDisclaimer() {
  const { t } = useTranslation();
  return (
    <p className="text-xs text-[var(--text-tertiary)] mt-1">
      {t("tips.disclaimer")}
    </p>
  );
}
