"use client";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import SliderInput from "@/components/SliderInput";
import EmailCapture from "@/components/EmailCapture";
import EMITips from "@/components/tips/EMITips";
import { calcEMI, amortizationSchedule, formatINR, formatShort, formatIndian } from "@/lib/utils";
import { track, getLoanRange } from "@/lib/analytics";

const EMIChart = dynamic(() => import("./EMIChart"), {
  ssr: false,
  loading: () => <div className="h-[200px] rounded-xl bg-[#F1F5F9] dark:bg-[#0F172A] animate-pulse" />,
});

export default function EMICalculator() {
  const [principal, setPrincipal] = useState(3000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [showTable, setShowTable] = useState(false);

  // Down payment factor card
  const [showDownPayment, setShowDownPayment] = useState(false);
  const [propertyValue, setPropertyValue] = useState(5000000);
  const [downPayment, setDownPayment] = useState(1500000);

  // Invest vs pay down card
  const [showInvestVsPay, setShowInvestVsPay] = useState(false);
  const [extraAmount, setExtraAmount] = useState(500000);
  const [mfReturn, setMfReturn] = useState(13);

  const emi = useMemo(() => calcEMI(principal, rate, tenure), [principal, rate, tenure]);
  const trackRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (trackRef.current) clearTimeout(trackRef.current);
    trackRef.current = setTimeout(() => track('calculator-used', { type: 'emi', loan_range: getLoanRange(principal) }), 2000);
    return () => { if (trackRef.current) clearTimeout(trackRef.current); };
  }, [principal, rate, tenure]);
  const totalPayable = emi * tenure * 12;
  const totalInterest = totalPayable - principal;

  const schedule = useMemo(() => amortizationSchedule(principal, rate, tenure), [principal, rate, tenure]);

  const yearlySchedule = useMemo(() => {
    const years: { year: number; principal: number; interest: number; balance: number }[] = [];
    for (let y = 0; y < tenure; y++) {
      const months = schedule.slice(y * 12, (y + 1) * 12);
      years.push({
        year: y + 1,
        principal: months.reduce((s, m) => s + m.principal, 0),
        interest: months.reduce((s, m) => s + m.interest, 0),
        balance: months[months.length - 1]?.balance ?? 0,
      });
    }
    return years;
  }, [schedule, tenure]);

  const share = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("p", String(principal));
    url.searchParams.set("r", String(rate));
    url.searchParams.set("t", String(tenure));
    navigator.clipboard.writeText(url.toString()).then(() => alert("Link copied!"));
  }, [principal, rate, tenure]);

  const downloadCSV = () => {
    const rows = [
      ["Month", "Principal Paid", "Interest Paid", "Balance Remaining"],
      ...schedule.map((r) => [r.month, r.principal.toFixed(2), r.interest.toFixed(2), r.balance.toFixed(2)]),
    ];
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "emi_schedule.csv";
    a.click();
  };

  return (
    <>
      {/* Sticky mobile result */}
      <div className="md:hidden sticky top-14 z-40 bg-white dark:bg-[#1E293B] border-b border-[#E2E8F0] dark:border-[#334155] px-4 py-3 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Monthly EMI</p>
          <p className="text-2xl font-bold text-[#F59E0B] tabular-nums" aria-live="polite" aria-atomic="true">
            {formatINR(Math.round(emi))}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Total Interest</p>
          <p className="text-base font-semibold text-red-500 tabular-nums" aria-live="polite" aria-atomic="true">
            {formatShort(totalInterest)}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Inputs */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-sm border border-[#E2E8F0] dark:border-[#334155]">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xl" aria-hidden="true">💰</span>
            <h2 className="font-bold text-[#0F172A] dark:text-[#F1F5F9] text-lg">Loan Details</h2>
          </div>
          <SliderInput label="Loan Amount" value={principal} min={100000} max={50000000} step={50000} onChange={setPrincipal} prefix="₹" format={formatIndian} hint="Home loan, car loan, personal loan…" />
          <SliderInput label="Annual Interest Rate" value={rate} min={5} max={20} step={0.1} onChange={setRate} suffix="%" format={(v) => v.toFixed(1)} hint="Check your loan offer letter" />
          <SliderInput label="Loan Tenure" value={tenure} min={1} max={30} step={1} onChange={setTenure} suffix=" yr" format={String} hint="How many years to repay" />
          <button onClick={share} className="mt-1 text-sm text-[#0D9488] dark:text-[#14B8A6] hover:text-[#0F766E] flex items-center gap-1.5 font-medium" aria-label="Copy shareable link to clipboard">
            🔗 Share this calculation
          </button>
        </div>

        {/* Results */}
        <div className="flex flex-col gap-4">
          {/* Desktop result card */}
          <div className="hidden md:block bg-white dark:bg-[#1E293B] rounded-2xl p-6 shadow-sm border border-[#E2E8F0] dark:border-[#334155]">
            <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-1">Monthly EMI</p>
            <p className="text-5xl font-bold text-[#F59E0B] tabular-nums result-value" aria-live="polite" aria-atomic="true">
              {formatINR(Math.round(emi))}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="bg-[#F8FAFC] dark:bg-[#0F172A] rounded-xl p-3">
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-1">Total Payable</p>
                <p className="font-bold text-[#0F172A] dark:text-[#F1F5F9] tabular-nums text-lg" aria-live="polite">{formatShort(totalPayable)}</p>
              </div>
              <div className="bg-red-50 rounded-xl p-3">
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-1">Total Interest</p>
                <p className="font-bold text-red-500 tabular-nums text-lg" aria-live="polite">{formatShort(totalInterest)}</p>
              </div>
            </div>
          </div>

          {/* Mobile breakdown */}
          <div className="md:hidden bg-white dark:bg-[#1E293B] rounded-2xl p-5 shadow-sm border border-[#E2E8F0] dark:border-[#334155]">
            <p className="text-sm font-medium text-[#64748B] dark:text-[#94A3B8] mb-3">Breakdown</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#F8FAFC] dark:bg-[#0F172A] rounded-xl p-3">
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-1">Loan Amount</p>
                <p className="font-bold text-[#0F172A] dark:text-[#F1F5F9] tabular-nums">{formatShort(principal)}</p>
              </div>
              <div className="bg-[#F8FAFC] dark:bg-[#0F172A] rounded-xl p-3">
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-1">Total Payable</p>
                <p className="font-bold text-[#0F172A] dark:text-[#F1F5F9] tabular-nums">{formatShort(totalPayable)}</p>
              </div>
              <div className="col-span-2 bg-red-50 rounded-xl p-3">
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-1">Interest over {tenure} years</p>
                <p className="font-bold text-red-500 tabular-nums text-lg" aria-live="polite">{formatShort(totalInterest)}</p>
                <p className="text-xs text-[#94A3B8] mt-1">{((totalInterest / principal) * 100).toFixed(0)}% extra over the principal</p>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-sm border border-[#E2E8F0] dark:border-[#334155]">
            <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9] mb-1">Principal vs Interest</p>
            <p className="text-xs text-[#94A3B8] mb-3">Where your money actually goes</p>
            <EMIChart principal={principal} totalInterest={totalInterest} totalPayable={totalPayable} />
          </div>
        </div>
      </div>

      {/* Amortization table */}
      <div className="mt-5 bg-white dark:bg-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-sm border border-[#E2E8F0] dark:border-[#334155]">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <button
            onClick={() => setShowTable(!showTable)}
            className="font-semibold text-[#0D9488] dark:text-[#14B8A6] hover:text-[#0F766E] flex items-center gap-2 transition-colors"
            aria-expanded={showTable}
            aria-controls="amortization-table"
          >
            <span className="text-lg" aria-hidden="true">{showTable ? "▲" : "▼"}</span>
            {showTable ? "Hide" : "View"} full repayment schedule
          </button>
          {showTable && (
            <button onClick={downloadCSV} className="text-sm bg-[#F1F5F9] dark:bg-[#0F172A] hover:bg-[#E2E8F0] text-[#0F172A] dark:text-[#F1F5F9] px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5">
              ⬇ Export CSV
            </button>
          )}
        </div>
        {!showTable && <p className="text-sm text-[#94A3B8]">See exactly how much principal and interest you pay each year.</p>}
        {showTable && (
          <div id="amortization-table" className="overflow-x-auto -mx-1">
            <table className="w-full text-sm min-w-[400px]">
              <thead>
                <tr className="border-b-2 border-[#E2E8F0] dark:border-[#334155]">
                  <th className="text-left py-2.5 pr-4 text-[#64748B] dark:text-[#94A3B8] font-semibold" scope="col">Year</th>
                  <th className="text-right py-2.5 pr-4 text-[#64748B] dark:text-[#94A3B8] font-semibold" scope="col">Principal Paid</th>
                  <th className="text-right py-2.5 pr-4 text-[#64748B] dark:text-[#94A3B8] font-semibold" scope="col">Interest Paid</th>
                  <th className="text-right py-2.5 text-[#64748B] dark:text-[#94A3B8] font-semibold" scope="col">Balance</th>
                </tr>
              </thead>
              <tbody>
                {yearlySchedule.map((row) => (
                  <tr key={row.year} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] dark:bg-[#0F172A] transition-colors">
                    <td className="py-2.5 pr-4 font-medium text-[#0F172A] dark:text-[#F1F5F9]">Year {row.year}</td>
                    <td className="py-2.5 pr-4 text-right text-[#10B981] dark:text-[#34D399] tabular-nums font-medium">{formatINR(Math.round(row.principal))}</td>
                    <td className="py-2.5 pr-4 text-right text-red-500 tabular-nums font-medium">{formatINR(Math.round(row.interest))}</td>
                    <td className="py-2.5 text-right text-[#0F172A] dark:text-[#F1F5F9] tabular-nums">{formatINR(Math.round(row.balance))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <EmailCapture />
      </div>

      {/* Contextual tips */}
      <div className="mt-5">
        <EMITips principal={principal} rate={rate} totalInterest={totalInterest} />
      </div>

      {/* Card A: Down Payment Factor */}
      <div className="mt-5 bg-white dark:bg-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-sm border border-[#E2E8F0] dark:border-[#334155]">
        <button
          onClick={() => setShowDownPayment(!showDownPayment)}
          className="font-semibold text-[#0D9488] dark:text-[#14B8A6] hover:text-[#0F766E] flex items-center gap-2 transition-colors"
          aria-expanded={showDownPayment}
        >
          <span className="text-lg" aria-hidden="true">{showDownPayment ? "▲" : "▼"}</span>
          Down payment &amp; LTV impact
        </button>
        {!showDownPayment && <p className="text-sm text-[#94A3B8] mt-2">See how your down payment changes the loan amount and EMI.</p>}
        {showDownPayment && (() => {
          const loanFromDP = Math.max(0, propertyValue - downPayment);
          const ltv = propertyValue > 0 ? (loanFromDP / propertyValue) * 100 : 0;
          const dpEMI = calcEMI(loanFromDP, rate, tenure);
          return (
            <div className="mt-4 grid lg:grid-cols-2 gap-5">
              <div>
                <SliderInput label="Property Value" value={propertyValue} min={500000} max={100000000} step={100000} onChange={setPropertyValue} prefix="₹" format={formatIndian} rangeHint="Min ₹5L · Max ₹10Cr" />
                <SliderInput label="Down Payment" value={downPayment} min={0} max={propertyValue} step={50000} onChange={setDownPayment} prefix="₹" format={formatIndian} hint="Banks usually require at least 10-20%" />
              </div>
              <div className="flex flex-col gap-3 justify-center">
                <div className="bg-[#F8FAFC] dark:bg-[#0F172A] rounded-xl p-4">
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-1">Loan needed</p>
                  <p className="font-bold text-[#0F172A] dark:text-[#F1F5F9] tabular-nums text-xl" aria-live="polite">{formatINR(Math.round(loanFromDP))}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#F0FDFA] dark:bg-[#042F2E] rounded-xl p-3">
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-1">LTV ratio</p>
                    <p className="font-bold text-[#0D9488] dark:text-[#14B8A6] tabular-nums text-lg" aria-live="polite">{ltv.toFixed(0)}%</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-3">
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-1">New EMI</p>
                    <p className="font-bold text-[#F59E0B] tabular-nums text-lg" aria-live="polite">{formatINR(Math.round(dpEMI))}</p>
                  </div>
                </div>
                {ltv > 80 && <p className="text-xs text-amber-600">⚠️ LTV above 80% — a larger down payment usually means a better rate.</p>}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Card B: Invest vs Pay Down */}
      <div className="mt-5 bg-white dark:bg-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-sm border border-[#E2E8F0] dark:border-[#334155]">
        <button
          onClick={() => setShowInvestVsPay(!showInvestVsPay)}
          className="font-semibold text-[#0D9488] dark:text-[#14B8A6] hover:text-[#0F766E] flex items-center gap-2 transition-colors"
          aria-expanded={showInvestVsPay}
        >
          <span className="text-lg" aria-hidden="true">{showInvestVsPay ? "▲" : "▼"}</span>
          Invest the money vs pay down the loan
        </button>
        {!showInvestVsPay && <p className="text-sm text-[#94A3B8] mt-2">Should a lump sum go into your loan or the market?</p>}
        {showInvestVsPay && (() => {
          // Pay-down scenario: interest saved by prepaying extraAmount now (reduce tenure)
          const sched = amortizationSchedule(principal, rate, tenure);
          const baselineInterest = sched.reduce((s, m) => s + m.interest, 0);
          const newPrincipal = Math.max(0, principal - extraAmount);
          const newSched = amortizationSchedule(newPrincipal, rate, tenure);
          const newInterest = newSched.reduce((s, m) => s + m.interest, 0);
          const interestSaved = Math.max(0, baselineInterest - newInterest);
          // Invest scenario: lump sum compounding for the loan tenure (approx via SIP-of-one with 0 contributions)
          const invested = extraAmount * Math.pow(1 + mfReturn / 100, tenure);
          const investGain = invested - extraAmount;
          const investWins = investGain > interestSaved;
          return (
            <div className="mt-4 grid lg:grid-cols-2 gap-5">
              <div>
                <SliderInput label="Lump-sum Amount" value={extraAmount} min={50000} max={5000000} step={50000} onChange={setExtraAmount} prefix="₹" format={formatIndian} rangeHint="Min ₹50K · Max ₹50L" />
                <SliderInput label="Expected MF Return" value={mfReturn} min={6} max={18} step={0.5} onChange={setMfReturn} suffix="%" format={(v) => v.toFixed(1)} hint="Equity funds historically ~12%" />
              </div>
              <div className="flex flex-col gap-3 justify-center">
                <div className="grid grid-cols-2 gap-3">
                  <div className={`rounded-xl p-3 ${!investWins ? "bg-[#F0FDFA] dark:bg-[#042F2E] border border-[#0D9488]/30" : "bg-[#F8FAFC] dark:bg-[#0F172A]"}`}>
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-1">Pay down → interest saved</p>
                    <p className="font-bold text-[#0D9488] dark:text-[#14B8A6] tabular-nums text-lg" aria-live="polite">{formatShort(interestSaved)}</p>
                  </div>
                  <div className={`rounded-xl p-3 ${investWins ? "bg-[#F0FDFA] dark:bg-[#042F2E] border border-[#0D9488]/30" : "bg-[#F8FAFC] dark:bg-[#0F172A]"}`}>
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-1">Invest → gain</p>
                    <p className="font-bold text-[#F59E0B] tabular-nums text-lg" aria-live="polite">{formatShort(investGain)}</p>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-sm font-semibold text-[#92400E]">
                    {investWins ? "📈 Investing comes out ahead" : "🏦 Paying down the loan comes out ahead"} on these assumptions.
                  </p>
                  <p className="text-xs text-[#92400E] mt-1">
                    Paying down is a guaranteed, risk-free return equal to your loan rate. Investment returns are not guaranteed and carry market risk. This is general information, not financial advice.
                  </p>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </>
  );
}
