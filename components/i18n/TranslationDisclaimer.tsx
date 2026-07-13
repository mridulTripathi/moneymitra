"use client";
import { useTranslation } from "./LanguageProvider";

export default function TranslationDisclaimer() {
  const { t, locale, languages } = useTranslation();

  if (locale === "en") return null;

  const current = languages.find((l) => l.code === locale);
  const nativeName = current?.nativeName ?? locale;

  return (
    <div className="bg-[#FEF3C7] dark:bg-[#3f2d0a] border-b border-amber-300 dark:border-amber-700 py-2 px-4 text-center">
      <p className="text-xs text-amber-900 dark:text-amber-300 font-medium">
        <span aria-hidden="true">🌐 </span>
        {t("common.translationDisclaimer", { language: nativeName })}
      </p>
    </div>
  );
}
