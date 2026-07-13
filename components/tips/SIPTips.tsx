"use client";
import { formatShort } from "@/lib/utils";
import { TipCard, TipsDisclaimer } from "./TipCard";
import { useTranslation } from "@/components/i18n/LanguageProvider";

interface Props {
  corpus: number;
  tab: "basic" | "stepup";
  last5Pct?: number;
}

export default function SIPTips({ corpus, tab, last5Pct }: Props) {
  const { t } = useTranslation();
  const toCrore = corpus >= 10000000;

  return (
    <div className="flex flex-col gap-3">
      <TipCard icon="📈">
        {typeof last5Pct === "number" ? t("tips.sip.compoundingWithPct", { last5Pct }) : t("tips.sip.compoundingNoPct")}
      </TipCard>
      {tab === "basic" && (
        <TipCard icon="🚀">
          {t("tips.sip.stepupSuggestion")}
        </TipCard>
      )}
      <TipCard icon="💰">
        {t("tips.sip.smallIncreases")}
      </TipCard>
      {toCrore ? (
        <TipCard icon="🏆">
          {t("tips.sip.onTrackCrore", { corpus: formatShort(corpus) })}
        </TipCard>
      ) : (
        <TipCard icon="🎯">
          {t("tips.sip.belowCrore", { corpus: formatShort(corpus) })}
        </TipCard>
      )}
      <TipsDisclaimer />
    </div>
  );
}
