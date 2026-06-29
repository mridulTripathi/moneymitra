"use client";
import { formatShort } from "@/lib/utils";
import { TipCard, TipsDisclaimer } from "./TipCard";

interface Props {
  corpus: number;
  tab: "basic" | "stepup";
  last5Pct?: number;
}

export default function SIPTips({ corpus, tab, last5Pct }: Props) {
  const toCrore = corpus >= 10000000;

  return (
    <div className="flex flex-col gap-3">
      <TipCard icon="📈">
        Compounding loads the gains at the end{typeof last5Pct === "number" ? <> — your final 5 years contribute about <strong>{last5Pct}%</strong> of the corpus</> : null}.
        Staying invested through market ups and downs is what builds wealth.
      </TipCard>
      {tab === "basic" && (
        <TipCard icon="🚀">
          Try the <strong>step-up SIP</strong> tab. Increasing your SIP by 10% a year in line with your salary
          can grow your corpus by 50–80% over a long horizon.
        </TipCard>
      )}
      <TipCard icon="💰">
        Small increases compound: at 12% over 20 years, each extra ₹1,000/month adds roughly{" "}
        <strong>₹10 lakh</strong> to your final corpus.
      </TipCard>
      {toCrore ? (
        <TipCard icon="🏆">
          You&apos;re on track to cross <strong>₹1 crore</strong> ({formatShort(corpus)}). Keep the SIP running
          and resist the urge to stop during market dips.
        </TipCard>
      ) : (
        <TipCard icon="🎯">
          A projected corpus of <strong>{formatShort(corpus)}</strong>. Extending the tenure or stepping up
          contributions could push you past the ₹1 crore milestone.
        </TipCard>
      )}
      <TipsDisclaimer />
    </div>
  );
}
