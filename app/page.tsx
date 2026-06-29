import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import FAQSearch from "@/components/FAQSearch";
import FAQAccordion from "@/components/FAQAccordion";
import { SITE_URL, SITE_NAME, pages } from "@/lib/seo";

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
  { emoji: "💰", title: "EMI Calculator", desc: "Know your exact monthly payment before you take any loan", href: "/emi", color: "bg-teal-50 border-teal-100", iconBg: "bg-teal-100" },
  { emoji: "🏠", title: "Prepayment Simulator", desc: "See exactly how much time and money you save by paying extra", href: "/prepay", color: "bg-amber-50 border-amber-100", iconBg: "bg-amber-100" },
  { emoji: "📈", title: "SIP Calculator", desc: "Watch your wealth grow with the power of compounding", href: "/sip", color: "bg-emerald-50 border-emerald-100", iconBg: "bg-emerald-100" },
  { emoji: "🧾", title: "Tax Comparator", desc: "Old regime vs new — find out which puts more money in your pocket", href: "/tax", color: "bg-purple-50 border-purple-100", iconBg: "bg-purple-100" },
  { emoji: "🏦", title: "FD & RD Calculator", desc: "Calculate fixed deposit maturity and recurring deposit returns", href: "/fd", color: "bg-blue-50 border-blue-100", iconBg: "bg-blue-100" },
  { emoji: "📊", title: "PPF Calculator", desc: "See how your PPF grows tax-free over 15 to 30 years", href: "/ppf", color: "bg-indigo-50 border-indigo-100", iconBg: "bg-indigo-100" },
  { emoji: "🏡", title: "HRA Calculator", desc: "Find your exact HRA tax exemption using the 3-condition formula", href: "/hra", color: "bg-rose-50 border-rose-100", iconBg: "bg-rose-100" },
  { emoji: "🎁", title: "Gratuity Calculator", desc: "Calculate your gratuity entitlement as per the Gratuity Act", href: "/gratuity", color: "bg-orange-50 border-orange-100", iconBg: "bg-orange-100" },
  { emoji: "💳", title: "Loan vs Card EMI", desc: "Find out whether a personal loan or credit card EMI costs less", href: "/loan-vs-card", color: "bg-cyan-50 border-cyan-100", iconBg: "bg-cyan-100" },
];

const features = [
  { icon: "⚡", title: "Instant results", desc: "No submit buttons, calculations update live as you type" },
  { icon: "🔒", title: "100% private", desc: "No data stored anywhere — all calculations happen on your device" },
  { icon: "📱", title: "Works everywhere", desc: "Optimised for phone, tablet, and laptop" },
];

export default function Home() {
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

      {/* Home FAQ */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <FAQAccordion items={homeFaqs} />
      </section>
    </>
  );
}
