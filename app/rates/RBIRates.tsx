"use client";
import { useTranslation } from "@/components/i18n/LanguageProvider";

interface Props {
  rbi: { repo_rate: number; reverse_repo_rate: number | null; crr: number | null; slr: number | null; bank_rate?: number | null };
}

export default function RBIRates({ rbi }: Props) {
  const { t } = useTranslation();
  const items = [
    { key: "repoRate", label: t("rates.repoRate"), value: rbi.repo_rate },
    { key: "reverseRepo", label: t("rates.reverseRepo"), value: rbi.reverse_repo_rate },
    { key: "crr", label: t("rates.crr"), value: rbi.crr },
    { key: "slr", label: t("rates.slr"), value: rbi.slr },
    { key: "bankRate", label: t("rates.bankRate"), value: rbi.bank_rate ?? null },
  ].filter((i) => i.value != null);

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl p-5 shadow-sm border border-[var(--border-default)] mb-5">
      <p className="text-sm font-semibold text-[var(--text-primary)] mb-3">{t("rates.rbiPolicyRatesHeading")}</p>
      <div className="flex flex-wrap gap-3">
        {items.map((i) => (
          <div key={i.key} className="bg-[var(--tip-bg)] border border-[#0D9488]/20 rounded-xl px-4 py-3 min-w-[110px]">
            <p className="text-xs text-[var(--text-secondary)] mb-0.5">{i.label}</p>
            <p className="text-xl font-bold text-[#0D9488] dark:text-[#14B8A6] tabular-nums">{Number(i.value).toFixed(2)}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
