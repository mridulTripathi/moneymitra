"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import SliderInput from "@/components/SliderInput";
import EmailCapture from "@/components/EmailCapture";
import { formatINR, formatIndian } from "@/lib/utils";
import { calculateHRAExemption } from "@/lib/calculators/hra";

export default function HRACalculator() {
  const [basic, setBasic] = useState(50000);
  const [da, setDa] = useState(0);
  const [hraReceived, setHraReceived] = useState(20000);
  const [rent, setRent] = useState(25000);
  const [isMetro, setIsMetro] = useState(true);

  const result = useMemo(
    () => calculateHRAExemption(basic, da, hraReceived, rent, isMetro),
    [basic, da, hraReceived, rent, isMetro]
  );

  const rows = [
    { label: "Actual HRA received", value: result.value1, winner: result.exemption === result.value1 },
    { label: `${isMetro ? "50%" : "40%"} of Basic + DA`, value: result.value2, winner: result.exemption === result.value2 },
    { label: "Rent paid − 10% of Basic + DA", value: result.value3, winner: result.exemption === result.value3 },
  ];

  return (
    <>
      <div className="md:hidden sticky top-14 z-40 bg-[var(--bg-card)] border-b border-[var(--border-default)] px-4 py-3 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-xs text-[var(--text-secondary)]">Exempt HRA / month</p>
          <p className="text-2xl font-bold text-[#10B981] dark:text-[#34D399] tabular-nums" aria-live="polite" aria-atomic="true">{formatINR(Math.round(result.exemption))}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--text-secondary)]">Taxable HRA</p>
          <p className="text-base font-semibold text-red-500 tabular-nums" aria-live="polite">{formatINR(Math.round(result.taxableHRA))}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-[var(--bg-card)] rounded-2xl p-5 sm:p-6 shadow-sm border border-[var(--border-default)]">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xl" aria-hidden="true">🏠</span>
            <h2 className="font-bold text-[var(--text-primary)] text-lg">Your Salary &amp; Rent (monthly)</h2>
          </div>
          <SliderInput label="Basic Salary" value={basic} min={5000} max={500000} step={1000} onChange={setBasic} prefix="₹" format={formatIndian} hint="Monthly basic pay" />
          <SliderInput label="Dearness Allowance (DA)" value={da} min={0} max={200000} step={1000} onChange={setDa} prefix="₹" format={formatIndian} hint="Usually 0 for private sector" />
          <SliderInput label="HRA Received" value={hraReceived} min={0} max={300000} step={1000} onChange={setHraReceived} prefix="₹" format={formatIndian} hint="From your salary slip" />
          <SliderInput label="Rent Paid" value={rent} min={0} max={300000} step={1000} onChange={setRent} prefix="₹" format={formatIndian} hint="Actual monthly rent" />
          <label className="flex items-center gap-2 mt-2 cursor-pointer text-sm text-[var(--text-primary)]">
            <input type="checkbox" checked={isMetro} onChange={(e) => setIsMetro(e.target.checked)} className="accent-[#0D9488] w-4 h-4" />
            I live in a metro (Delhi, Mumbai, Kolkata, Chennai)
          </label>
        </div>

        <div className="flex flex-col gap-4">
          <div className="hidden md:block bg-[var(--bg-card)] rounded-2xl p-6 shadow-sm border border-[var(--border-default)]">
            <p className="text-sm text-[var(--text-secondary)] mb-1">Exempt HRA (per month)</p>
            <p className="text-5xl font-bold text-[#10B981] dark:text-[#34D399] tabular-nums" aria-live="polite" aria-atomic="true">{formatINR(Math.round(result.exemption))}</p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-xl p-3">
                <p className="text-xs text-[var(--text-secondary)] mb-1">Exempt / year</p>
                <p className="font-bold text-[#10B981] dark:text-[#34D399] tabular-nums text-lg">{formatINR(Math.round(result.exemption * 12))}</p>
              </div>
              <div className="bg-red-50 dark:bg-red-950/50 rounded-xl p-3">
                <p className="text-xs text-[var(--text-secondary)] mb-1">Taxable / month</p>
                <p className="font-bold text-red-500 tabular-nums text-lg" aria-live="polite">{formatINR(Math.round(result.taxableHRA))}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] rounded-2xl p-5 sm:p-6 shadow-sm border border-[var(--border-default)]">
            <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">The 3-condition rule</p>
            <p className="text-xs text-[var(--text-tertiary)] mb-3">Your exemption is the lowest of these three.</p>
            <div className="flex flex-col gap-2">
              {rows.map((r) => (
                <div key={r.label} className={`flex items-center justify-between rounded-xl px-4 py-3 border ${r.winner ? "bg-[var(--tip-bg)] border-[#0D9488]/30" : "bg-[var(--bg-base)] border-[var(--border-default)]"}`}>
                  <span className="text-sm text-[#374151] dark:text-[#CBD5E1]">{r.label}</span>
                  <span className={`text-sm font-bold tabular-nums ${r.winner ? "text-[#0D9488] dark:text-[#14B8A6]" : "text-[var(--text-primary)]"}`}>
                    {formatINR(Math.round(Math.max(0, r.value)))}{r.winner ? " ✓" : ""}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-[var(--text-tertiary)] mt-3">
              HRA exemption applies under the old tax regime only.{" "}
              <Link href="/tax" className="text-[#0D9488] dark:text-[#14B8A6] hover:text-[#0F766E] font-medium">Compare regimes →</Link>
            </p>
            <EmailCapture sourcePage="hra" />
          </div>
        </div>
      </div>
    </>
  );
}
