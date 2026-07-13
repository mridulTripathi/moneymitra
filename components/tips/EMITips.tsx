"use client";
import { formatShort } from "@/lib/utils";
import { TipCard, TipsDisclaimer } from "./TipCard";
import { useTranslation } from "@/components/i18n/LanguageProvider";

interface Props {
  principal: number;
  rate: number;
  totalInterest: number;
}

export default function EMITips({ principal, rate, totalInterest }: Props) {
  const { t } = useTranslation();
  const interestRatio = principal > 0 ? totalInterest / principal : 0;

  return (
    <div className="flex flex-col gap-3">
      {interestRatio > 0.6 && (
        <TipCard icon="🔥">
          {t("tips.emi.highInterestRatio", { totalInterest: formatShort(totalInterest), pct: Math.round(interestRatio * 100) })}
        </TipCard>
      )}
      {rate > 9 && (
        <TipCard icon="📉">
          {t("tips.emi.highRate", { rate: rate.toFixed(1) })}
        </TipCard>
      )}
      <TipCard icon="⏱️">
        {t("tips.emi.prepayEarly")}
      </TipCard>
      <TipsDisclaimer />
    </div>
  );
}
