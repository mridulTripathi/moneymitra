"use client";
import Link from "next/link";
import FAQSearch from "@/components/FAQSearch";
import FAQAccordion from "@/components/FAQAccordion";
import { SuggestToolForm } from "@/components/SuggestTool";
import { useTranslation } from "@/components/i18n/LanguageProvider";

const homeFaqs = [
  { q: "What calculators does MoneyMitra offer?", a: "MoneyMitra offers 9 free financial calculators: EMI Calculator, Home Loan Prepayment Simulator, SIP & Step-Up SIP Calculator, New vs Old Tax Regime Comparator, FD & RD Calculator, PPF Calculator, HRA Exemption Calculator, Gratuity Calculator, and Personal Loan vs Credit Card EMI Comparator. All are free, instant, and require no signup." },
  { q: "Is MoneyMitra free to use?", a: "Yes. All calculators on MoneyMitra are completely free — no signup, no subscription, no hidden charges. Every calculation happens on your device and no personal financial data is stored anywhere." },
  { q: "How accurate are MoneyMitra's financial calculations?", a: "MoneyMitra uses standard financial formulas used by banks in India — the EMI formula, compound interest formula, and current tax slabs. Results match bank calculators to the rupee. All calculations are illustrative — verify with your lender or advisor before making decisions." },
  { q: "Does MoneyMitra store my financial data?", a: "No. All calculations happen entirely in your browser. No financial data is sent to any server or stored anywhere. MoneyMitra is 100% private." },
];

const calculatorKeys = [
  { key: "emi", emoji: "💰", href: "/emi", color: "bg-teal-50 dark:bg-teal-950/60 border-teal-100 dark:border-teal-800", iconBg: "bg-teal-100 dark:bg-teal-900/70" },
  { key: "prepay", emoji: "🏠", href: "/prepay", color: "bg-amber-50 dark:bg-amber-950/60 border-amber-100 dark:border-amber-800", iconBg: "bg-amber-100 dark:bg-amber-900/70" },
  { key: "sip", emoji: "📈", href: "/sip", color: "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-100 dark:border-emerald-800", iconBg: "bg-emerald-100 dark:bg-emerald-900/70" },
  { key: "tax", emoji: "🧾", href: "/tax", color: "bg-purple-50 dark:bg-purple-950/60 border-purple-100 dark:border-purple-800", iconBg: "bg-purple-100 dark:bg-purple-900/70" },
  { key: "fd", emoji: "🏦", href: "/fd", color: "bg-blue-50 dark:bg-blue-950/60 border-blue-100 dark:border-blue-800", iconBg: "bg-blue-100 dark:bg-blue-900/70" },
  { key: "ppf", emoji: "📊", href: "/ppf", color: "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-100 dark:border-indigo-800", iconBg: "bg-indigo-100 dark:bg-indigo-900/70" },
  { key: "hra", emoji: "🏡", href: "/hra", color: "bg-rose-50 dark:bg-rose-950/60 border-rose-100 dark:border-rose-800", iconBg: "bg-rose-100 dark:bg-rose-900/70" },
  { key: "gratuity", emoji: "🎁", href: "/gratuity", color: "bg-orange-50 dark:bg-orange-950/60 border-orange-100 dark:border-orange-800", iconBg: "bg-orange-100 dark:bg-orange-900/70" },
  { key: "loanVsCard", emoji: "💳", href: "/loan-vs-card", color: "bg-cyan-50 dark:bg-cyan-950/60 border-cyan-100 dark:border-cyan-800", iconBg: "bg-cyan-100 dark:bg-cyan-900/70" },
] as const;

const featureKeys = ["instant", "private", "everywhere"] as const;
const featureIcons = { instant: "⚡", private: "🔒", everywhere: "📱" };

export interface RatesSnapshot {
  rbi: { repo_rate: number; crr: number | null; slr: number | null; bank_rate?: number | null } | null;
  bestHomeLoan: { min_rate: number; bank_name: string } | null;
  bestFD: { max_rate: number; bank_name: string } | null;
  bestPersonalLoan: { min_rate: number; bank_name: string } | null;
  lastUpdated: string | null;
}

export default function HomeContent({ ratesSnapshot }: { ratesSnapshot: RatesSnapshot }) {
  const { t } = useTranslation();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#134e4a] text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="inline-block bg-[var(--bg-card)]/10 rounded-full px-4 py-1 text-sm font-medium mb-6 backdrop-blur-sm">
            {t("home.heroBadge")}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 leading-tight">
            {t("home.heroTitleLine1")}
            <br />
            {t("home.heroTitleLine2")}
          </h1>
          <p className="text-lg sm:text-xl text-teal-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            {t("home.heroSubtitle")}
          </p>
          <a
            href="#calculators"
            className="inline-flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold px-8 py-4 rounded-full text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            {t("home.startCalculating")}
          </a>
        </div>
      </section>

      {/* Live Rates Section */}
      <section className="bg-slate-50 dark:bg-[#0a0f1a] py-8 -mx-4 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              {t("home.liveMarketRates")}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </h2>
            <span className="text-xs text-[var(--text-tertiary)]">
              {t("home.updated", { frequency: t("common.frequencyMonthly") })}
            </span>
          </div>

          {/* RBI Strip */}
          <div className="bg-slate-900 dark:bg-[#0a1219] rounded-xl px-5 py-3 mb-4 overflow-hidden">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <span className="text-green-400 font-bold text-xs tracking-widest uppercase flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                {t("home.rbiLive")}
              </span>
              {ratesSnapshot.rbi ? (
                <>
                  <span className="text-white">{t("home.repo")} <span className="text-green-400 font-semibold">{ratesSnapshot.rbi.repo_rate}%</span></span>
                  {ratesSnapshot.rbi.crr && <span className="text-white">{t("home.crr")} <span className="text-slate-300 font-semibold">{ratesSnapshot.rbi.crr}%</span></span>}
                  {ratesSnapshot.rbi.slr && <span className="text-white">{t("home.slr")} <span className="text-slate-300 font-semibold">{ratesSnapshot.rbi.slr}%</span></span>}
                  {ratesSnapshot.rbi.bank_rate && <span className="text-white">{t("home.bankRate")} <span className="text-slate-300 font-semibold">{ratesSnapshot.rbi.bank_rate}%</span></span>}
                </>
              ) : (
                <span className="text-slate-400 text-sm">{t("home.loadingRbiRates")}</span>
              )}
            </div>
          </div>

          {/* Best Rate Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Home Loan */}
            <a href="/rates?tab=home-loan" className="bg-[var(--bg-card)] border-l-4 border-[#0D9488] rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow block">
              <p className="text-xs text-[var(--text-secondary)] font-medium mb-1">{t("home.bestHomeLoan")}</p>
              {ratesSnapshot.bestHomeLoan ? (
                <>
                  <p className="text-3xl font-bold text-[#0D9488]">From {ratesSnapshot.bestHomeLoan.min_rate}%</p>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{ratesSnapshot.bestHomeLoan.bank_name}</p>
                </>
              ) : (
                <div className="h-10 bg-[var(--bg-elevated)] rounded animate-pulse mt-1" />
              )}
              <p className="text-xs text-[#0D9488] mt-3 font-medium">{t("home.seeAllRates")}</p>
            </a>

            {/* FD */}
            <a href="/rates?tab=fd" className="bg-[var(--bg-card)] border-l-4 border-[#F59E0B] rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow block">
              <p className="text-xs text-[var(--text-secondary)] font-medium mb-1">{t("home.bestFDRate")}</p>
              {ratesSnapshot.bestFD ? (
                <>
                  <p className="text-3xl font-bold text-[#F59E0B]">Up to {ratesSnapshot.bestFD.max_rate}%</p>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{ratesSnapshot.bestFD.bank_name}</p>
                </>
              ) : (
                <div className="h-10 bg-[var(--bg-elevated)] rounded animate-pulse mt-1" />
              )}
              <p className="text-xs text-[#F59E0B] mt-3 font-medium">{t("home.seeAllRates")}</p>
            </a>

            {/* Personal Loan */}
            <a href="/rates?tab=personal-loan" className="bg-[var(--bg-card)] border-l-4 border-blue-500 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow block">
              <p className="text-xs text-[var(--text-secondary)] font-medium mb-1">{t("home.bestPersonalLoan")}</p>
              {ratesSnapshot.bestPersonalLoan ? (
                <>
                  <p className="text-3xl font-bold text-blue-500">From {ratesSnapshot.bestPersonalLoan.min_rate}%</p>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{ratesSnapshot.bestPersonalLoan.bank_name}</p>
                </>
              ) : (
                <div className="h-10 bg-[var(--bg-elevated)] rounded animate-pulse mt-1" />
              )}
              <p className="text-xs text-blue-500 mt-3 font-medium">{t("home.seeAllRates")}</p>
            </a>
          </div>
        </div>
      </section>

      {/* Calculator cards */}
      <section id="calculators" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-[var(--text-primary)] mb-2">{t("home.chooseYourCalculator")}</h2>
        <p className="text-center text-[var(--text-secondary)] mb-6">{t("home.everyToolYouNeed")}</p>
        <FAQSearch />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {calculatorKeys.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className={`group flex flex-col p-6 rounded-2xl border ${c.color} hover:shadow-lg transition-all hover:-translate-y-1`}
            >
              <div className={`w-12 h-12 ${c.iconBg} rounded-xl flex items-center justify-center text-2xl mb-4`} aria-hidden="true">
                {c.emoji}
              </div>
              <h3 className="font-bold text-[var(--text-primary)] mb-1 text-lg">{t(`home.calculatorsList.${c.key}.title`)}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed flex-1">{t(`home.calculatorsList.${c.key}.desc`)}</p>
              <span className="mt-4 text-[#0D9488] dark:text-[#14B8A6] font-semibold text-sm">{t("home.calculate")}</span>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/rates" className="inline-flex items-center gap-2 text-sm text-[#0D9488] dark:text-[#14B8A6] font-medium hover:underline">
            {t("home.currentBankRatesLink")}
          </Link>
        </div>
      </section>

      {/* Why MoneyMitra */}
      <section className="bg-[var(--bg-card)] border-t border-[var(--border-default)] py-16" aria-label="Why use MoneyMitra">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{t("home.whyMoneyMitra")}</h2>
          <p className="text-[var(--text-secondary)] mb-10">{t("home.builtForRealPeople")}</p>
          <div className="grid sm:grid-cols-3 gap-6">
            {featureKeys.map((key) => (
              <div key={key} className="flex flex-col items-center p-6 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-default)]">
                <span className="text-4xl mb-3" aria-hidden="true">{featureIcons[key]}</span>
                <h3 className="font-bold text-[var(--text-primary)] mb-1">{t(`home.features.${key}.title`)}</h3>
                <p className="text-[var(--text-secondary)] text-sm">{t(`home.features.${key}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Suggest a Tool */}
      <section className="bg-[var(--tip-bg)] border border-teal-200 dark:border-teal-800 rounded-2xl p-8 mx-auto max-w-2xl my-12">
        <div className="text-center mb-6">
          <span className="text-3xl">🛠️</span>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mt-2">{t("home.whatToolNext")}</h2>
          <p className="text-[var(--text-secondary)] text-sm mt-1">{t("home.tellUsWhat")}</p>
        </div>
        <SuggestToolForm sourcePage="home" />
      </section>

      {/* Home FAQ */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <FAQAccordion items={homeFaqs} />
      </section>
    </>
  );
}
