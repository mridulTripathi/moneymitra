import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import FAQSearch from "@/components/FAQSearch";
import FAQAccordion from "@/components/FAQAccordion";
import { SuggestToolForm } from "@/components/SuggestTool";
import { SITE_URL, SITE_NAME, pages } from "@/lib/seo";
import { createServiceClient } from "@/lib/supabase";
import { getRateUpdateFrequency } from "@/lib/rate-update-config";

export const revalidate = 21600;

export const metadata: Metadata = {
  title: { absolute: "MoneyMitra — Free Financial Calculators for India" },
  description: pages.home.description,
  alternates: {
    canonical: SITE_URL,
    languages: { "en-IN": SITE_URL },
  },
  openGraph: {
    title: pages.home.title,
    description: pages.home.description,
    url: SITE_URL,
  },
  twitter: {
    title: pages.home.title,
    description: pages.home.description,
  },
};

async function getRatesSnapshot() {
  try {
    const client = createServiceClient();
    const [rbiRes, bankRes, updRes] = await Promise.all([
      client.from('rbi_policy_rates').select('*').order('effective_date', { ascending: false }).limit(1).single(),
      client.from('bank_rates').select('bank_name,bank_short_name,rate_type,min_rate,max_rate').in('rate_type', ['home_loan', 'fd_1yr', 'personal_loan']),
      client.from('rates_last_updated').select('updated_at').eq('id', 1).single(),
    ]);
    const rbi = rbiRes.data;
    const banks = bankRes.data ?? [];
    const bestHomeLoan = banks.filter((b: {rate_type: string, min_rate: number}) => b.rate_type === 'home_loan').sort((a: {min_rate: number}, b: {min_rate: number}) => a.min_rate - b.min_rate)[0];
    const bestFD = banks.filter((b: {rate_type: string, max_rate: number}) => b.rate_type === 'fd_1yr').sort((a: {max_rate: number}, b: {max_rate: number}) => b.max_rate - a.max_rate)[0];
    const bestPersonalLoan = banks.filter((b: {rate_type: string, min_rate: number}) => b.rate_type === 'personal_loan').sort((a: {min_rate: number}, b: {min_rate: number}) => a.min_rate - b.min_rate)[0];
    return { rbi, bestHomeLoan, bestFD, bestPersonalLoan, lastUpdated: updRes.data?.updated_at ?? null };
  } catch {
    return { rbi: null, bestHomeLoan: null, bestFD: null, bestPersonalLoan: null, lastUpdated: null };
  }
}

const webAppSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      description: pages.home.description,
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/{search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebApplication",
      name: SITE_NAME,
      url: SITE_URL,
      description:
        "Free financial calculators for India — EMI, SIP, home loan prepayment, tax regime comparator, FD, PPF, HRA, gratuity, and more.",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      browserRequirements: "Requires JavaScript",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      audience: {
        "@type": "Audience",
        audienceType: "Salaried Indians",
        geographicArea: { "@type": "Country", name: "India" },
      },
      featureList: [
        "EMI Calculator with amortization schedule",
        "Home Loan Prepayment & Foreclosure Simulator",
        "SIP & Step-Up SIP Wealth Growth Calculator",
        "New vs Old Tax Regime Comparator for FY 2025-26",
        "FD & RD Returns Calculator",
        "PPF Calculator",
        "HRA Exemption Calculator",
        "Gratuity Calculator",
        "Personal Loan vs Credit Card EMI Comparator",
      ],
    },
  ],
};

const homeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What calculators does MoneyMitra offer?",
      acceptedAnswer: { "@type": "Answer", text: "MoneyMitra offers 9 free financial calculators: EMI Calculator, Home Loan Prepayment Simulator, SIP & Step-Up SIP Calculator, New vs Old Tax Regime Comparator, FD & RD Calculator, PPF Calculator, HRA Exemption Calculator, Gratuity Calculator, and Personal Loan vs Credit Card EMI Comparator. All are free, instant, and require no signup." },
    },
    {
      "@type": "Question",
      name: "Is MoneyMitra free to use?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. All calculators on MoneyMitra are completely free — no signup, no subscription, no hidden charges. Every calculation happens on your device and no personal financial data is stored anywhere." },
    },
    {
      "@type": "Question",
      name: "How accurate are MoneyMitra's financial calculations?",
      acceptedAnswer: { "@type": "Answer", text: "MoneyMitra uses standard financial formulas used by banks and financial institutions in India — the EMI formula, compound interest formula, and current tax slabs from the Income Tax Act for FY 2025-26. Results match bank calculators to the rupee. All calculations are illustrative and should be verified with your lender or financial advisor before making decisions." },
    },
    {
      "@type": "Question",
      name: "Does MoneyMitra store my financial data?",
      acceptedAnswer: { "@type": "Answer", text: "No. All calculations happen entirely in your browser. No financial data — salary, loan amounts, investments — is sent to any server or stored anywhere. MoneyMitra is 100% private." },
    },
  ],
};

const homeFaqs = [
  { q: "What calculators does MoneyMitra offer?", a: "MoneyMitra offers 9 free financial calculators: EMI Calculator, Home Loan Prepayment Simulator, SIP & Step-Up SIP Calculator, New vs Old Tax Regime Comparator, FD & RD Calculator, PPF Calculator, HRA Exemption Calculator, Gratuity Calculator, and Personal Loan vs Credit Card EMI Comparator. All are free, instant, and require no signup." },
  { q: "Is MoneyMitra free to use?", a: "Yes. All calculators on MoneyMitra are completely free — no signup, no subscription, no hidden charges. Every calculation happens on your device and no personal financial data is stored anywhere." },
  { q: "How accurate are MoneyMitra's financial calculations?", a: "MoneyMitra uses standard financial formulas used by banks in India — the EMI formula, compound interest formula, and current tax slabs. Results match bank calculators to the rupee. All calculations are illustrative — verify with your lender or advisor before making decisions." },
  { q: "Does MoneyMitra store my financial data?", a: "No. All calculations happen entirely in your browser. No financial data is sent to any server or stored anywhere. MoneyMitra is 100% private." },
];

const calculators = [
  { emoji: "💰", title: "EMI Calculator", desc: "Know your exact monthly payment before you take any loan", href: "/emi", color: "bg-teal-50 dark:bg-teal-950/60 border-teal-100 dark:border-teal-800", iconBg: "bg-teal-100 dark:bg-teal-900/70" },
  { emoji: "🏠", title: "Prepayment Simulator", desc: "See exactly how much time and money you save by paying extra", href: "/prepay", color: "bg-amber-50 dark:bg-amber-950/60 border-amber-100 dark:border-amber-800", iconBg: "bg-amber-100 dark:bg-amber-900/70" },
  { emoji: "📈", title: "SIP Calculator", desc: "Watch your wealth grow with the power of compounding", href: "/sip", color: "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-100 dark:border-emerald-800", iconBg: "bg-emerald-100 dark:bg-emerald-900/70" },
  { emoji: "🧾", title: "Tax Comparator", desc: "Old regime vs new — find out which puts more money in your pocket", href: "/tax", color: "bg-purple-50 dark:bg-purple-950/60 border-purple-100 dark:border-purple-800", iconBg: "bg-purple-100 dark:bg-purple-900/70" },
  { emoji: "🏦", title: "FD & RD Calculator", desc: "Calculate fixed deposit maturity and recurring deposit returns", href: "/fd", color: "bg-blue-50 dark:bg-blue-950/60 border-blue-100 dark:border-blue-800", iconBg: "bg-blue-100 dark:bg-blue-900/70" },
  { emoji: "📊", title: "PPF Calculator", desc: "See how your PPF grows tax-free over 15 to 30 years", href: "/ppf", color: "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-100 dark:border-indigo-800", iconBg: "bg-indigo-100 dark:bg-indigo-900/70" },
  { emoji: "🏡", title: "HRA Calculator", desc: "Find your exact HRA tax exemption using the 3-condition formula", href: "/hra", color: "bg-rose-50 dark:bg-rose-950/60 border-rose-100 dark:border-rose-800", iconBg: "bg-rose-100 dark:bg-rose-900/70" },
  { emoji: "🎁", title: "Gratuity Calculator", desc: "Calculate your gratuity entitlement as per the Gratuity Act", href: "/gratuity", color: "bg-orange-50 dark:bg-orange-950/60 border-orange-100 dark:border-orange-800", iconBg: "bg-orange-100 dark:bg-orange-900/70" },
  { emoji: "💳", title: "Loan vs Card EMI", desc: "Find out whether a personal loan or credit card EMI costs less", href: "/loan-vs-card", color: "bg-cyan-50 dark:bg-cyan-950/60 border-cyan-100 dark:border-cyan-800", iconBg: "bg-cyan-100 dark:bg-cyan-900/70" },
];

const features = [
  { icon: "⚡", title: "Instant results", desc: "No submit buttons, calculations update live as you type" },
  { icon: "🔒", title: "100% private", desc: "No data stored anywhere — all calculations happen on your device" },
  { icon: "📱", title: "Works everywhere", desc: "Optimised for phone, tablet, and laptop" },
];

export default async function Home() {
  const ratesSnapshot = await getRatesSnapshot();

  return (
    <>
      <JsonLd data={webAppSchema} />
      <JsonLd data={homeFaqSchema} />

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
            Free · No signup · Instant
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 leading-tight">
            Stop Guessing.
            <br />
            Start Knowing.
          </h1>
          <p className="text-lg sm:text-xl text-teal-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            Free calculators that answer the money questions you&apos;re too afraid to ask your CA.
          </p>
          <a
            href="#calculators"
            className="inline-flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold px-8 py-4 rounded-full text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Start Calculating →
          </a>
        </div>
      </section>

      {/* Live Rates Section */}
      <section className="bg-slate-50 dark:bg-[#0a0f1a] py-8 -mx-4 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              📊 Live Market Rates
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </h2>
            <span className="text-xs text-[var(--text-tertiary)]">
              Updated {getRateUpdateFrequency()}{ratesSnapshot.lastUpdated ? ` · ${new Date(ratesSnapshot.lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}
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
                RBI LIVE
              </span>
              {ratesSnapshot.rbi ? (
                <>
                  <span className="text-white">Repo <span className="text-green-400 font-semibold">{(ratesSnapshot.rbi as {repo_rate: number}).repo_rate}%</span></span>
                  {(ratesSnapshot.rbi as {crr: number | null}).crr && <span className="text-white">CRR <span className="text-slate-300 font-semibold">{(ratesSnapshot.rbi as {crr: number | null}).crr}%</span></span>}
                  {(ratesSnapshot.rbi as {slr: number | null}).slr && <span className="text-white">SLR <span className="text-slate-300 font-semibold">{(ratesSnapshot.rbi as {slr: number | null}).slr}%</span></span>}
                  {(ratesSnapshot.rbi as {bank_rate?: number | null}).bank_rate && <span className="text-white">Bank Rate <span className="text-slate-300 font-semibold">{(ratesSnapshot.rbi as {bank_rate?: number | null}).bank_rate}%</span></span>}
                </>
              ) : (
                <span className="text-slate-400 text-sm">Loading RBI rates...</span>
              )}
            </div>
          </div>

          {/* Best Rate Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Home Loan */}
            <a href="/rates?tab=home-loan" className="bg-[var(--bg-card)] border-l-4 border-[#0D9488] rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow block">
              <p className="text-xs text-[var(--text-secondary)] font-medium mb-1">🏠 Best Home Loan</p>
              {ratesSnapshot.bestHomeLoan ? (
                <>
                  <p className="text-3xl font-bold text-[#0D9488]">From {(ratesSnapshot.bestHomeLoan as {min_rate: number}).min_rate}%</p>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{(ratesSnapshot.bestHomeLoan as {bank_name: string}).bank_name}</p>
                </>
              ) : (
                <div className="h-10 bg-[var(--bg-elevated)] rounded animate-pulse mt-1" />
              )}
              <p className="text-xs text-[#0D9488] mt-3 font-medium">See all rates →</p>
            </a>

            {/* FD */}
            <a href="/rates?tab=fd" className="bg-[var(--bg-card)] border-l-4 border-[#F59E0B] rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow block">
              <p className="text-xs text-[var(--text-secondary)] font-medium mb-1">💰 Best FD Rate</p>
              {ratesSnapshot.bestFD ? (
                <>
                  <p className="text-3xl font-bold text-[#F59E0B]">Up to {(ratesSnapshot.bestFD as {max_rate: number}).max_rate}%</p>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{(ratesSnapshot.bestFD as {bank_name: string}).bank_name}</p>
                </>
              ) : (
                <div className="h-10 bg-[var(--bg-elevated)] rounded animate-pulse mt-1" />
              )}
              <p className="text-xs text-[#F59E0B] mt-3 font-medium">See all rates →</p>
            </a>

            {/* Personal Loan */}
            <a href="/rates?tab=personal-loan" className="bg-[var(--bg-card)] border-l-4 border-blue-500 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow block">
              <p className="text-xs text-[var(--text-secondary)] font-medium mb-1">📋 Best Personal Loan</p>
              {ratesSnapshot.bestPersonalLoan ? (
                <>
                  <p className="text-3xl font-bold text-blue-500">From {(ratesSnapshot.bestPersonalLoan as {min_rate: number}).min_rate}%</p>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{(ratesSnapshot.bestPersonalLoan as {bank_name: string}).bank_name}</p>
                </>
              ) : (
                <div className="h-10 bg-[var(--bg-elevated)] rounded animate-pulse mt-1" />
              )}
              <p className="text-xs text-blue-500 mt-3 font-medium">See all rates →</p>
            </a>
          </div>
        </div>
      </section>

      {/* Calculator cards */}
      <section id="calculators" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-[var(--text-primary)] mb-2">Choose your calculator</h2>
        <p className="text-center text-[var(--text-secondary)] mb-6">Every tool you need for clarity about your money.</p>
        <FAQSearch />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {calculators.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className={`group flex flex-col p-6 rounded-2xl border ${c.color} hover:shadow-lg transition-all hover:-translate-y-1`}
            >
              <div className={`w-12 h-12 ${c.iconBg} rounded-xl flex items-center justify-center text-2xl mb-4`} aria-hidden="true">
                {c.emoji}
              </div>
              <h3 className="font-bold text-[var(--text-primary)] mb-1 text-lg">{c.title}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed flex-1">{c.desc}</p>
              <span className="mt-4 text-[#0D9488] dark:text-[#14B8A6] font-semibold text-sm">Calculate →</span>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/rates" className="inline-flex items-center gap-2 text-sm text-[#0D9488] dark:text-[#14B8A6] font-medium hover:underline">
            📊 Current bank interest rates in India →
          </Link>
        </div>
      </section>

      {/* Why MoneyMitra */}
      <section className="bg-[var(--bg-card)] border-t border-[var(--border-default)] py-16" aria-label="Why use MoneyMitra">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Why MoneyMitra?</h2>
          <p className="text-[var(--text-secondary)] mb-10">Built for real people making real money decisions</p>
          <div className="grid sm:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="flex flex-col items-center p-6 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-default)]">
                <span className="text-4xl mb-3" aria-hidden="true">{f.icon}</span>
                <h3 className="font-bold text-[var(--text-primary)] mb-1">{f.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Suggest a Tool */}
      <section className="bg-[var(--tip-bg)] border border-teal-200 dark:border-teal-800 rounded-2xl p-8 mx-auto max-w-2xl my-12">
        <div className="text-center mb-6">
          <span className="text-3xl">🛠️</span>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mt-2">What tool should we build next?</h2>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Tell us what financial calculation you wish existed. We read every suggestion.</p>
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
