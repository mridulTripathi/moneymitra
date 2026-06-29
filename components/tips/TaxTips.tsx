"use client";
import { formatINR } from "@/lib/utils";
import { TipCard, TipsDisclaimer } from "./TipCard";

interface Props {
  winner: "new" | "old";
  difference: number;
  totalDeductions: number;
}

export default function TaxTips({ winner, difference, totalDeductions }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {difference < 10000 && (
        <TipCard icon="🤏">
          The two regimes are within <strong>{formatINR(Math.round(difference))}</strong> of each other.
          When it&apos;s this close, the simpler <strong>new regime</strong> (less paperwork, no proofs) is often
          worth the small difference.
        </TipCard>
      )}
      {winner === "old" && totalDeductions < 375000 && (
        <TipCard icon="📋">
          The old regime wins for you, but you&apos;re not yet at full deductions. Maximising 80C (₹1.5L),
          80D, and home loan interest (₹2L) would widen the gap further.
        </TipCard>
      )}
      {winner === "new" && (
        <TipCard icon="✅">
          The new regime is cheaper for your profile thanks to the ₹75,000 standard deduction and the
          rebate that makes income up to ₹12 lakh tax-free.
        </TipCard>
      )}
      <TipCard icon="📈">
        Re-check this every year — as your salary grows and your deductions change, the winning regime can flip.
      </TipCard>
      <TipsDisclaimer />
    </div>
  );
}
