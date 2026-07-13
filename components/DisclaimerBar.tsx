"use client";
import { useTranslation } from "@/components/i18n/LanguageProvider";

export function DisclaimerBar() {
  const { t } = useTranslation();
  return (
    <div className="sticky top-[56px] z-30 bg-[#FEF3C7] dark:bg-[#3f2d0a] border-b border-amber-300 dark:border-amber-700 py-2 px-4 text-center shadow-sm">
      <p className="text-xs text-amber-900 dark:text-amber-300 font-medium">
        {t("disclaimer.text")}
      </p>
    </div>
  );
}
