"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { track } from "@/lib/analytics";
import RBIRates from "./RBIRates";
import BankRatesTable from "./BankRatesTable";
import type { BankRate } from "./page";
import { useTranslation } from "@/components/i18n/LanguageProvider";

interface Props {
  rbi: { repo_rate: number; reverse_repo_rate: number | null; crr: number | null; slr: number | null; bank_rate?: number | null };
  bankRates: BankRate[];
  lastUpdated: string | null;
}

const LOAN_TABS = [
  { key: 'home_loan', labelKey: 'rates.tabHomeLoan' },
  { key: 'personal_loan', labelKey: 'rates.tabPersonalLoan' },
  { key: 'car_loan', labelKey: 'rates.tabCarLoan' },
  { key: 'two_wheeler_loan', labelKey: 'rates.tabTwoWheelerLoan' },
] as const;

const INVEST_TABS = [
  { key: 'fd_1yr', labelKey: 'rates.tabFd' },
  { key: 'rd_1yr', labelKey: 'rates.tabRd' },
  { key: 'fd_sfb', labelKey: 'rates.tabFdSfb' },
] as const;

type LoanTabKey = typeof LOAN_TABS[number]['key'];
type InvestTabKey = typeof INVEST_TABS[number]['key'];

export default function RatesPage({ rbi, bankRates }: Props) {
  const { t } = useTranslation();
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
          <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full">{t("rates.badgeBorrowing")}</span>
          <h2 className="font-semibold text-[var(--text-primary)]">{t("rates.loanRatesHeading")}</h2>
          <span className="text-xs text-[var(--text-tertiary)] ml-1">{t("rates.lowerIsBetter")}</span>
        </div>
        <div className="flex gap-2 flex-wrap mb-4">
          {LOAN_TABS.map((tab) => (
            <button key={tab.key} onClick={() => { setLoanTab(tab.key); track('rates-tab-viewed', { tab: tab.key }); }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${loanTab === tab.key ? "bg-[#0D9488] text-white" : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"}`}>
              {t(tab.labelKey)}
            </button>
          ))}
        </div>
        <BankRatesTable rates={bankRates.filter(r => r.rate_type === loanTab)} showSenior={false} isFD={false} />
      </div>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border-default)]" /></div>
        <div className="relative flex justify-center">
          <span className="bg-[var(--bg-base)] px-4 text-xs text-[var(--text-tertiary)] font-medium tracking-widest uppercase">{t("rates.switchDivider")}</span>
        </div>
      </div>

      {/* SECTION B: Investment Rates */}
      <div className="bg-[var(--bg-card)] rounded-2xl p-5 sm:p-6 shadow-sm border border-[var(--border-default)]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-full">{t("rates.badgeInvesting")}</span>
            <h2 className="font-semibold text-[var(--text-primary)]">{t("rates.investmentRatesHeading")}</h2>
            <span className="text-xs text-[var(--text-tertiary)] ml-1">{t("rates.higherIsBetter")}</span>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-[var(--text-primary)]">
            <input type="checkbox" checked={showSenior} onChange={(e) => setShowSenior(e.target.checked)} className="accent-[#0D9488] w-4 h-4" />
            {t("rates.seniorCitizenRatesLabel")}
          </label>
        </div>
        <div className="flex gap-2 flex-wrap mb-4">
          {INVEST_TABS.map((tab) => (
            <button key={tab.key} onClick={() => { setInvestTab(tab.key); track('rates-tab-viewed', { tab: tab.key }); }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${investTab === tab.key ? "bg-[#F59E0B] text-white" : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"}`}>
              {t(tab.labelKey)}
            </button>
          ))}
        </div>
        {investTab === 'rd_1yr' && (
          <div className="bg-blue-50 dark:bg-[#0f1f33] border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3 mb-3">
            <p className="text-sm text-blue-700 dark:text-blue-300">{t("rates.rdNote")}</p>
          </div>
        )}
        <BankRatesTable
          rates={bankRates.filter(r => {
            if (investTab === 'fd_sfb') return r.rate_type === 'fd_1yr' && r.bank_type === 'small_finance';
            return r.rate_type === investTab;
          })}
          showSenior={showSenior}
          isFD={investTab === 'fd_1yr' || investTab === 'fd_sfb' || investTab === 'rd_1yr'}
          isRD={investTab === 'rd_1yr'}
        />
      </div>
    </>
  );
}
