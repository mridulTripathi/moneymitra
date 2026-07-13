"use client";
import { usePathname } from "next/navigation";
import { pageRecommendations } from "@/lib/page-recommendations";
import { track } from "@/lib/analytics";
import { useTranslation } from "@/components/i18n/LanguageProvider";

export default function RelatedTools() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const recommendations = pageRecommendations[pathname];

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <section className="my-6 bg-[var(--tip-bg)] border border-[#0D9488]/20 dark:border-[#14B8A6]/20 rounded-2xl p-5">
      <h3 className="text-sm font-bold text-[#0D9488] dark:text-[#14B8A6] uppercase tracking-wide mb-3 flex items-center gap-1.5">
        {t("relatedTools.heading")}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {recommendations.map((rec) => (
          <a
            key={rec.path}
            href={rec.path}
            onClick={() => track('related-tool-clicked', { from: pathname, to: rec.path })}
            className="block bg-[var(--bg-card)] border border-[#0D9488]/30 dark:border-[#14B8A6]/30 rounded-xl p-4 hover:border-[#0D9488] dark:hover:border-[#14B8A6] hover:shadow-md transition-all group"
          >
            <p className="font-semibold text-[var(--text-primary)] group-hover:text-[#0D9488] dark:group-hover:text-[#14B8A6] flex items-center justify-between">
              {t(`relatedTools.${rec.i18nKey}.label`)}
              <span className="text-[#0D9488] dark:text-[#14B8A6] group-hover:translate-x-0.5 transition-transform">→</span>
            </p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {t(`relatedTools.${rec.i18nKey}.reason`)}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
