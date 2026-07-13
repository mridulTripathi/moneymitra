"use client";
import { formatINR } from "@/lib/utils";
import { TipCard, TipsDisclaimer } from "./TipCard";
import { useTranslation } from "@/components/i18n/LanguageProvider";

interface Props {
  winner: "new" | "old";
  difference: number;
  totalDeductions: number;
}

export default function TaxTips({ winner, difference, totalDeductions }: Props) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3">
      {difference < 10000 && (
        <TipCard icon="🤏">
          {t("tips.tax.closeGap", { amount: formatINR(Math.round(difference)) })}
        </TipCard>
      )}
      {winner === "old" && totalDeductions < 375000 && (
        <TipCard icon="📋">
          {t("tips.tax.oldNotMaximized")}
        </TipCard>
      )}
      {winner === "new" && (
        <TipCard icon="✅">
          {t("tips.tax.newWins")}
        </TipCard>
      )}
      <TipCard icon="📈">
        {t("tips.tax.recheckYearly")}
      </TipCard>
      <TipsDisclaimer />
    </div>
  );
}
