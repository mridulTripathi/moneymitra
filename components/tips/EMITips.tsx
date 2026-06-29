"use client";
import { formatShort } from "@/lib/utils";
import { TipCard, TipsDisclaimer } from "./TipCard";

interface Props {
  principal: number;
  rate: number;
  totalInterest: number;
}

export default function EMITips({ principal, rate, totalInterest }: Props) {
  const interestRatio = principal > 0 ? totalInterest / principal : 0;

  return (
    <div className="flex flex-col gap-3">
      {interestRatio > 0.6 && (
        <TipCard icon="🔥">
          Your total interest of <strong>{formatShort(totalInterest)}</strong> is{" "}
          <strong>{Math.round(interestRatio * 100)}%</strong> of the principal. A shorter tenure or
          regular prepayments could cut this dramatically.
        </TipCard>
      )}
      {rate > 9 && (
        <TipCard icon="📉">
          At <strong>{rate.toFixed(1)}%</strong>, your rate is on the higher side. Even a 0.5% reduction
          via a balance transfer can save lakhs over a long tenure — worth negotiating with your lender.
        </TipCard>
      )}
      <TipCard icon="⏱️">
        Prepaying early matters most: in the first few years almost all of your EMI is interest, so a
        lump sum now saves far more than the same amount later.
      </TipCard>
      <TipsDisclaimer />
    </div>
  );
}
