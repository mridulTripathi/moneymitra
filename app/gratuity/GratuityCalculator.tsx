"use client";
import { useState, useMemo } from "react";
import SliderInput from "@/components/SliderInput";
import EmailCapture from "@/components/EmailCapture";
import { formatINR, formatShort, formatIndian } from "@/lib/utils";
import { calculateGratuity } from "@/lib/calculators/gratuity";

export default function GratuityCalculator() {
  const [basicPlusDA, setBasicPlusDA] = useState(50000);
  const [years, setYears] = useState(10);
  const [isCovered, setIsCovered] = useState(true);

  const result = useMemo(() => calculateGratuity(basicPlusDA, years, isCovered), [basicPlusDA, years, isCovered]);

  return (
    <>
      <div className="md:hidden sticky top-14 z-40 bg-white dark:bg-[#1E293B] border-b border-[#E2E8F0] dark:border-[#334155] px-4 py-3 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Gratuity Amount</p>
          <p className="text-2xl font-bold text-[#0D9488] dark:text-[#14B8A6] tabular-nums" aria-live="polite" aria-atomic="true">{result.eligible ? formatShort(result.gratuity) : "—"}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Tax-free</p>
          <p className="text-base font-semibold text-[#10B981] dark:text-[#34D399] tabular-nums" aria-live="polite">{formatShort(result.taxFree)}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-sm border border-[#E2E8F0] dark:border-[#334155]">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xl" aria-hidden="true">🎁</span>
            <h2 className="font-bold text-[#0F172A] dark:text-[#F1F5F9] text-lg">Service Details</h2>
          </div>
          <SliderInput label="Last drawn Basic + DA (monthly)" value={basicPlusDA} min={5000} max={500000} step={1000} onChange={setBasicPlusDA} prefix="₹" format={formatIndian} hint="Only basic + DA counts" />
          <SliderInput label="Years of Service" value={years} min={1} max={40} step={1} onChange={setYears} suffix=" yr" format={String} hint="Completed years (5+ to qualify)" />
          <div className="mb-2">
            <label className="text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9] mb-2 block">Employer covered by Gratuity Act?</label>
            <div className="flex gap-2">
              <button onClick={() => setIsCovered(true)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isCovered ? "bg-[#0D9488] text-white" : "bg-[#F1F5F9] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E2E8F0]"}`}>Covered (÷26)</button>
              <button onClick={() => setIsCovered(false)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!isCovered ? "bg-[#0D9488] text-white" : "bg-[#F1F5F9] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E2E8F0]"}`}>Not covered (÷30)</button>
            </div>
            <p className="text-xs text-[#94A3B8] mt-2">Most companies with 10+ employees are covered.</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 shadow-sm border border-[#E2E8F0] dark:border-[#334155]">
            {result.eligible ? (
              <>
                <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-1">Gratuity Amount</p>
                <p className="text-5xl font-bold text-[#0D9488] dark:text-[#14B8A6] tabular-nums" aria-live="polite" aria-atomic="true">{formatINR(Math.round(result.gratuity))}</p>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-xl p-3">
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-1">Tax-free portion</p>
                    <p className="font-bold text-[#10B981] dark:text-[#34D399] tabular-nums text-lg">{formatShort(result.taxFree)}</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-3">
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-1">Taxable portion</p>
                    <p className="font-bold text-red-500 tabular-nums text-lg">{formatShort(result.taxable)}</p>
                  </div>
                </div>
                <p className="text-xs text-[#94A3B8] mt-3">
                  Formula: ({formatINR(basicPlusDA)} × 15 × {years}) ÷ {isCovered ? 26 : 30}. Tax-free up to ₹20 lakh.
                </p>
              </>
            ) : (
              <div className="py-6 text-center">
                <p className="text-4xl mb-2">⏳</p>
                <p className="font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-1">Not eligible yet</p>
                <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Gratuity requires at least 5 years of continuous service. You have {years} year{years !== 1 ? "s" : ""}.</p>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-sm border border-[#E2E8F0] dark:border-[#334155]">
            <p className="text-sm text-[#374151] dark:text-[#CBD5E1]">
              Gratuity is a lump-sum reward for long service, paid on resignation, retirement, or termination after 5 years.
              It is one of the most tax-efficient payouts you receive — fully tax-free up to the ₹20 lakh lifetime ceiling.
            </p>
            <EmailCapture sourcePage="gratuity" />
          </div>
        </div>
      </div>
    </>
  );
}
