"use client";
import { formatShort, formatTenure } from "@/lib/utils";
import { TipCard, TipsDisclaimer } from "./TipCard";
import { useTranslation } from "@/components/i18n/LanguageProvider";

interface Props {
  interestSaved: number;
  timeSavedMonths: number;
  mode: "reduceTenure" | "reduceEMI";
}

export default function PrepayTips({ interestSaved, timeSavedMonths, mode }: Props) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3">
      <TipCard icon="🎯">
        {t("tips.prepay.prepayEarly")}
      </TipCard>
      <TipCard icon="⚖️">
        {mode === "reduceTenure"
          ? t("tips.prepay.modeReduceTenure", { interestSaved: formatShort(interestSaved), timeSaved: formatTenure(timeSavedMonths) })
          : t("tips.prepay.modeReduceEmi")}
      </TipCard>
      <TipCard icon="📅">
        {t("tips.prepay.habit")}
      </TipCard>
      <TipsDisclaimer />
    </div>
  );
}
