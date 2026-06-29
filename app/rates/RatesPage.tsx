"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { track } from "@/lib/analytics";
import RBIRates from "./RBIRates";
import BankRatesTable from "./BankRatesTable";
import type { BankRate } from "./page";

interface Props {
  rbi: { repo_rate: number; reverse_repo_rate: number | null; crr: number | null; slr: number | null; bank_rate?: number | null };
  bankRates: BankRate[];
  lastUpdated: string | null;
}

const LOAN_TABS = [
  { key: 'home_loan', label: 'Home Loan' },
  { key: 'personal_loan', label: 'Personal Loan' },
  { key: 'car_loan', label: 'Car Loan' },
] as const;

const INVEST_TABS = [
  { key: 'fd_1yr', label: 'FD' },
  { key: 'rd_1yr', label: 'RD' },
  { key: 'fd_sfb', label: 'Small Finance Bank FD' },
] as const;

type LoanTabKey = typeof LOAN_TABS[number]['key'];
type InvestTabKey = typeof INVEST_TABS[number]['key'];

export default function RatesPage({ rbi, bankRates }: Props) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [loanTab, setLoanTab] = useState<LoanTabKey>(() => {
    if (tabParam === 'home-loan') return 'home_loan';
    if (tabParam === 'personal-loan') return 'personal_loan';
    if (tabParam === 'car-loan') return 'car_loan';
    return 'home_loan';
  });
  const [investTab, setInvestTab] = useState<InvestTabKey>(() => {
    if (tabParam === 'fd') return 'fd_1yr';
    if (tabParam === 'rd') return 'rd_1yr';
    return 'fd_1yr';
  });
  const [showSenior, setShowSenior] = useState(false);

  return (
    <>
      <RBIRates rbi={rbi} />

      {/* SECTION A: Loan Rates */}
      <div className="bg-[var(--bg-card)] rounded-2xl p-5 sm:p-6 shadow-sm border border-[var(--border-default)] mb-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full">Borrowing</span>
          <h2 className="font-semibold text-[var(--text-primary)]">📉 Loan Rates</h2>
          <span className="text-xs text-[var(--text-tertiary)] ml-1">Lower is better ↓</span>
        </div>
        <div className="flex gap-2 flex-wrap mb-4">
          {LOAN_TABS.map((t) => (
            <button key={t.key} onClick={() => { setLoanTab(t.key); track('rates-tab-viewed', { tab: t.key }); }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${loanTab === t.key ? "bg-[#0D9488] text-white" : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[#E2E8F0]"}`}>
              {t.label}
            </button>
          ))}
        </div>
        <BankRatesTable rates={bankRates.filter(r => r.rate_type === loanTab)} showSenior={false} isFD={false} />
      </div>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border-default)]" /></div>
        <div className="relative flex justify-center">
          <span className="bg-[var(--bg-base)] px-4 text-xs text-[var(--text-tertiary)] font-medium tracking-widest uppercase">— Switch from borrowing to investing —</span>
        </div>
      </div>

      {/* SECTION B: Investment Rates */}
      <div className="bg-[var(--bg-card)] rounded-2xl p-5 sm:p-6 shadow-sm border border-[var(--border-default)]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-full">Investing</span>
            <h2 className="font-semibold text-[var(--text-primary)]">📈 Investment &amp; Deposit Rates</h2>
            <span className="text-xs text-[var(--text-tertiary)] ml-1">Higher is better ↑</span>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-[var(--text-primary)]">
            <input type="checkbox" checked={showSenior} onChange={(e) => setShowSenior(e.target.checked)} className="accent-[#0D9488] w-4 h-4" />
            Senior citizen rates (+0.5%)
          </label>
        </div>
        <div className="flex gap-2 flex-wrap mb-4">
          {INVEST_TABS.map((t) => (
            <button key={t.key} onClick={() => { setInvestTab(t.key); track('rates-tab-viewed', { tab: t.key }); }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${investTab === t.key ? "bg-[#F59E0B] text-white" : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[#E2E8F0]"}`}>
              {t.label}
            </button>
          ))}
        </div>
        {investTab === 'rd_1yr' && (
          <p className="text-xs text-[var(--text-tertiary)] mb-3">RD interest is compounded quarterly. Rates are typically similar to FD rates for the same tenure.</p>
        )}
        <BankRatesTable
          rates={bankRates.filter(r => {
            if (investTab === 'fd_sfb') return r.rate_type === 'fd_1yr' && r.bank_type === 'small_finance';
            return r.rate_type === investTab;
          })}
          showSenior={showSenior}
          isFD={investTab === 'fd_1yr' || investTab === 'fd_sfb' || investTab === 'rd_1yr'}
        />
      </div>
    </>
  );
}
