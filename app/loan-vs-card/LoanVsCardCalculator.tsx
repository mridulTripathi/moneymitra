"use client";
import { useState, useMemo } from "react";
import SliderInput from "@/components/SliderInput";
import EmailCapture from "@/components/EmailCapture";
import { formatINR, formatIndian } from "@/lib/utils";
import { calculateEMI } from "@/lib/calculators/emi";

const GST = 0.18;

export default function LoanVsCardCalculator() {
  const [amount, setAmount] = useState(200000);
  const [months, setMonths] = useState(12);
  const [loanRate, setLoanRate] = useState(12);
  const [loanFeePct, setLoanFeePct] = useState(2);
  const [cardRate, setCardRate] = useState(36);

  const loan = useMemo(() => {
    const emi = calculateEMI(amount, loanRate, months / 12);
    const totalPaid = emi * months;
    const interest = totalPaid - amount;
    const fee = amount * (loanFeePct / 100);
    const gstOnFee = fee * GST;
    const totalCost = interest + fee + gstOnFee;
    return { emi, interest, fee, gstOnFee, totalCost, totalOutgo: amount + totalCost };
  }, [amount, months, loanRate, loanFeePct]);

  const card = useMemo(() => {
    const emi = calculateEMI(amount, cardRate, months / 12);
    const totalPaid = emi * months;
    const interest = totalPaid - amount;
    const gstOnInterest = interest * GST;
    const totalCost = interest + gstOnInterest;
    return { emi, interest, gstOnInterest, totalCost, totalOutgo: amount + totalCost };
  }, [amount, months, cardRate]);

  const loanWins = loan.totalCost <= card.totalCost;
  const savings = Math.abs(loan.totalCost - card.totalCost);

  return (
    <>
      <div className="md:hidden sticky top-14 z-40 bg-[var(--bg-card)] border-b border-[var(--border-default)] px-4 py-3 shadow-sm">
        <p className="text-xs text-[var(--text-secondary)]">Cheaper option</p>
        <p className="text-xl font-bold text-[#0D9488] dark:text-[#14B8A6]" aria-live="polite" aria-atomic="true">
          {loanWins ? "Personal Loan" : "Credit Card EMI"} · saves {formatINR(Math.round(savings))}
        </p>
      </div>

      {/* Winner banner */}
      <div className="mb-5 rounded-2xl p-5 bg-[var(--tip-bg)] border border-[#0D9488]/30">
        <p className="text-sm text-[var(--text-secondary)] mb-1">Cheaper option for you</p>
        <p className="text-2xl font-bold text-[#0D9488] dark:text-[#14B8A6]" aria-live="polite" aria-atomic="true">
          {loanWins ? "🏦 Personal Loan" : "💳 Credit Card EMI"}
        </p>
        <p className="text-sm text-[#374151] dark:text-[#CBD5E1] mt-1">
          Saves you <span className="font-bold">{formatINR(Math.round(savings))}</span> in total cost over {months} months.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-[var(--bg-card)] rounded-2xl p-5 sm:p-6 shadow-sm border border-[var(--border-default)]">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xl" aria-hidden="true">⚖️</span>
            <h2 className="font-bold text-[var(--text-primary)] text-lg">Purchase Details</h2>
          </div>
          <SliderInput label="Amount to Finance" value={amount} min={10000} max={2000000} step={5000} onChange={setAmount} prefix="₹" format={formatIndian} rangeHint="Min ₹10K · Max ₹20L" />
          <SliderInput label="Repayment Tenure" value={months} min={3} max={60} step={1} onChange={setMonths} suffix=" mo" format={String} hint="How many months to repay" />
          <SliderInput label="Personal Loan Rate" value={loanRate} min={9} max={30} step={0.5} onChange={setLoanRate} suffix="%" format={(v) => v.toFixed(1)} hint="Typical 10.5–24%" />
          <SliderInput label="Loan Processing Fee" value={loanFeePct} min={0} max={5} step={0.25} onChange={setLoanFeePct} suffix="%" format={(v) => v.toFixed(2)} hint="Usually 1–3% + GST" />
          <SliderInput label="Credit Card EMI Rate" value={cardRate} min={12} max={48} step={0.5} onChange={setCardRate} suffix="%" format={(v) => v.toFixed(1)} hint="Revolving balances 36–45%" />
        </div>

        <div className="flex flex-col gap-4">
          <div className={`bg-[var(--bg-card)] rounded-2xl p-5 shadow-sm border ${loanWins ? "border-[#0D9488]/40" : "border-[var(--border-default)]"}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[var(--text-primary)]">🏦 Personal Loan</h3>
              {loanWins && <span className="text-xs bg-[#0D9488] text-white px-2 py-0.5 rounded-full font-semibold">Cheaper</span>}
            </div>
            <Row label="Monthly EMI" value={loan.emi} />
            <Row label="Interest" value={loan.interest} />
            <Row label={`Processing fee (${loanFeePct}%)`} value={loan.fee} />
            <Row label="GST on fee" value={loan.gstOnFee} />
            <Row label="Total extra cost" value={loan.totalCost} bold />
          </div>

          <div className={`bg-[var(--bg-card)] rounded-2xl p-5 shadow-sm border ${!loanWins ? "border-[#0D9488]/40" : "border-[var(--border-default)]"}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[var(--text-primary)]">💳 Credit Card EMI</h3>
              {!loanWins && <span className="text-xs bg-[#0D9488] text-white px-2 py-0.5 rounded-full font-semibold">Cheaper</span>}
            </div>
            <Row label="Monthly EMI" value={card.emi} />
            <Row label="Interest" value={card.interest} />
            <Row label="GST on interest" value={card.gstOnInterest} />
            <Row label="Total extra cost" value={card.totalCost} bold />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="text-xs text-[#92400E]">
              ⚠️ This is a general comparison, not financial advice. Actual rates, fees, and no-cost-EMI terms vary by lender and offer.
              Always confirm the effective annual rate before deciding.
            </p>
            <EmailCapture sourcePage="loan-vs-card" />
          </div>
        </div>
      </div>
    </>
  );
}

function Row({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-1.5 ${bold ? "border-t border-[var(--border-default)] mt-1 pt-2.5" : ""}`}>
      <span className={`text-sm ${bold ? "font-semibold text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>{label}</span>
      <span className={`text-sm tabular-nums ${bold ? "font-bold text-[var(--text-primary)]" : "text-[var(--text-primary)]"}`}>{formatINR(Math.round(value))}</span>
    </div>
  );
}
