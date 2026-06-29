"use client";
import { formatShort, formatTenure } from "@/lib/utils";
import { TipCard, TipsDisclaimer } from "./TipCard";

interface Props {
  interestSaved: number;
  timeSavedMonths: number;
  mode: "reduceTenure" | "reduceEMI";
}

export default function PrepayTips({ interestSaved, timeSavedMonths, mode }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <TipCard icon="🎯">
        Prepay as early in the loan as you can. The same lump sum applied in year 2 saves far more
        interest than in year 15, because early EMIs are mostly interest.
      </TipCard>
      <TipCard icon="⚖️">
        {mode === "reduceTenure" ? (
          <>You chose <strong>reduce tenure</strong> — the better choice for saving interest. You save{" "}
          <strong>{formatShort(interestSaved)}</strong> and finish about <strong>{formatTenure(timeSavedMonths)}</strong> early.</>
        ) : (
          <>You chose <strong>reduce EMI</strong>, which lowers your monthly outgo. Switching to{" "}
          <strong>reduce tenure</strong> would usually save more total interest if your cash flow allows.</>
        )}
      </TipCard>
      <TipCard icon="📅">
        Make prepayment a habit — using your annual bonus to prepay once a year can shave years off the
        loan with no penalty on most floating-rate home loans.
      </TipCard>
      <TipsDisclaimer />
    </div>
  );
}
