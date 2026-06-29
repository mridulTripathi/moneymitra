"use client";
import { useState } from "react";
import { track } from "@/lib/analytics";
import RBIRates from "./RBIRates";
import BankRatesTable from "./BankRatesTable";
import type { BankRate } from "./page";

interface Props {
  rbi: { repo_rate: number; reverse_repo_rate: number | null; crr: number | null; slr: number | null; bank_rate?: number | null };
  bankRates: BankRate[];
  lastUpdated: string | null;
}

const TABS = [
  { key: "home_loan", label: "Home Loan" },
  { key: "fd_1yr", label: "FD (1 yr)" },
  { key: "personal_loan", label: "Personal Loan" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function RatesPage({ rbi, bankRates, lastUpdated }: Props) {
  const [tab, setTab] = useState<TabKey>("home_loan");
  const [showSenior, setShowSenior] = useState(false);

  const filtered = bankRates.filter((r) => r.rate_type === tab);
  const isFD = tab === "fd_1yr";

  return (
    <>
      <RBIRates rbi={rbi} />

      <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-sm border border-[#E2E8F0] dark:border-[#334155]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex gap-2 flex-wrap">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); track('rates-tab-viewed', { tab: t.key }); }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  tab === t.key ? "bg-[#0D9488] text-white" : "bg-[#F1F5F9] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E2E8F0]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          {isFD && (
            <label className="flex items-center gap-2 cursor-pointer text-sm text-[#0F172A] dark:text-[#F1F5F9]">
              <input type="checkbox" checked={showSenior} onChange={(e) => setShowSenior(e.target.checked)} className="accent-[#0D9488] w-4 h-4" />
              Show senior citizen rates
            </label>
          )}
        </div>

        <BankRatesTable rates={filtered} showSenior={showSenior} isFD={isFD} />

        {lastUpdated && (
          <p className="text-xs text-[#94A3B8] mt-4">
            Rates last updated {new Date(lastUpdated).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}.
            Indicative only — confirm with the bank before applying.
          </p>
        )}
      </div>
    </>
  );
}
