import type { Metadata } from "next";
import { Suspense } from "react";
import RatesPage from "./RatesPage";
import FAQAccordion from "@/components/FAQAccordion";
import FAQSearch from "@/components/FAQSearch";
import JsonLd from "@/components/JsonLd";
import EmailCapture from "@/components/EmailCapture";
import { createServiceClient } from "@/lib/supabase";
import { pages, SITE_URL, SITE_NAME } from "@/lib/seo";

export const revalidate = 3600; // 1 hour

export const metadata: Metadata = {
  title: pages.rates.title,
  description: pages.rates.description,
  alternates: { canonical: pages.rates.url, languages: { "en-IN": pages.rates.url } },
  openGraph: { title: pages.rates.title, description: pages.rates.description, url: pages.rates.url },
  twitter: { title: pages.rates.title, description: pages.rates.description },
};

interface RBIRate {
  repo_rate: number; reverse_repo_rate: number | null; crr: number | null; slr: number | null; bank_rate?: number | null; effective_date?: string;
}
export interface BankRate {
  id: string; bank_name: string; bank_short_name: string; bank_type: string; rate_type: string;
  min_rate: number; max_rate: number; senior_citizen_extra: number; bank_url: string | null; effective_date: string;
}

const FALLBACK_RBI: RBIRate = { repo_rate: 6.5, reverse_repo_rate: 3.35, crr: 4.0, slr: 18.0, bank_rate: 6.75 };

async function getData(): Promise<{ rbi: RBIRate; bankRates: BankRate[]; lastUpdated: string | null }> {
  try {
    const client = createServiceClient();
    const [rbiRes, bankRes, updRes] = await Promise.all([
      client.from("rbi_policy_rates").select("*").order("effective_date", { ascending: false }).limit(1).single(),
      client.from("bank_rates").select("*").order("min_rate", { ascending: true }),
      client.from("rates_last_updated").select("updated_at").eq("id", 1).single(),
    ]);
    return {
      rbi: (rbiRes.data as RBIRate) ?? FALLBACK_RBI,
      bankRates: (bankRes.data as BankRate[]) ?? [],
      lastUpdated: updRes.data?.updated_at ?? null,
    };
  } catch {
    return { rbi: FALLBACK_RBI, bankRates: [], lastUpdated: null };
  }
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Interest Rates", item: pages.rates.url },
  ],
};

const datasetSchema = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "Indian Bank Interest Rates 2026",
  description: "Current home loan, FD, and personal loan interest rates from major Indian banks. Updated monthly.",
  url: pages.rates.url,
  temporalCoverage: "2026",
  spatialCoverage: "India",
  inLanguage: "en-IN",
  publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  license: "https://creativecommons.org/licenses/by/4.0/",
};

const ratesFaqs = [
  { q: "What is the current RBI repo rate in India?", a: "The RBI repo rate is currently 6.50% (as of February 2026). The repo rate is the interest rate at which the RBI lends money to commercial banks. Changes to the repo rate directly affect home loan and personal loan rates across all banks." },
  { q: "Which bank has the lowest home loan interest rate in India 2026?", a: "As of June 2026, Bank of Baroda, Punjab National Bank, and Canara Bank offer home loans starting from 8.40%, making them among the lowest. SBI starts at 8.50%. Private banks like HDFC and ICICI start at 8.75%. Rates vary based on your credit score, income, and loan amount." },
  { q: "Which bank gives the highest FD interest rate in India 2026?", a: "Small finance banks offer the highest FD rates. Suryoday Small Finance Bank offers up to 8.60%, Jana Small Finance Bank and Ujjivan SFB offer 8.25% on 1-year deposits. Among large banks, Yes Bank and IDFC First Bank offer around 7.75%. DICGC insurance covers deposits up to ₹5 lakh." },
  { q: "Which small finance bank gives the highest FD rate?", a: "Among small finance banks, Suryoday SFB leads with 8.60% on 1-year deposits. Jana SFB and Ujjivan SFB follow at 8.25%, and AU Small Finance Bank offers 7.75%. Senior citizens get an additional 0.50% at most banks. Deposits up to ₹5 lakh are DICGC-insured." },
  { q: "How often do bank interest rates change?", a: "Banks can change their lending and deposit rates at any time, but typically do so after RBI MPC (Monetary Policy Committee) meetings, held every 6 weeks. Home loan rates on floating rate loans adjust automatically. FD rates apply to new bookings — existing FDs are not affected until renewal." },
];

const ratesFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: ratesFaqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default async function Page() {
  const { rbi, bankRates, lastUpdated } = await getData();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={datasetSchema} />
      <JsonLd data={ratesFaqSchema} />

      <nav aria-label="Breadcrumb" className="text-xs text-[var(--text-tertiary)] mb-4">
        <ol className="flex items-center gap-1">
          <li><a href="/" className="hover:text-[#0D9488]">{SITE_NAME}</a></li>
          <li aria-hidden="true">›</li>
          <li className="text-[#0F172A]">Interest Rates</li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Current Bank Interest Rates</h1>
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-xs font-medium px-3 py-1 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            RBI Repo Rate: Live
          </div>
          <span className="text-slate-500 dark:text-slate-400 text-sm">
            Bank rates updated monthly{lastUpdated ? ` · Last updated: ${new Date(lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}
          </span>
        </div>
        <p className="text-xs text-[var(--text-tertiary)] mt-2">
          RBI policy rates (repo, CRR, SLR) update automatically. Bank product rates are verified and updated after each RBI MPC meeting.
        </p>
      </div>

      <FAQSearch />
      <div className="bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-400 dark:border-amber-600 rounded-r-xl p-4 my-6">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">⚠️ Important: Rates shown are indicative only</p>
        <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
          Bank interest rates change without notice. MoneyMitra updates rates monthly but cannot guarantee real-time accuracy. Always verify the current rate directly with your bank before making any deposit or loan decision. This is not financial advice.
        </p>
      </div>
      <Suspense fallback={null}>
        <RatesPage rbi={rbi} bankRates={bankRates} lastUpdated={lastUpdated} />
      </Suspense>
      <div className="bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-2xl p-6 mt-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📬</span>
          <div className="flex-1">
            <h3 className="font-semibold text-[var(--text-primary)]">Get rate change alerts</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">We&apos;ll email you when RBI changes the repo rate or when bank rates update. One email per change. No spam, ever.</p>
            <EmailCapture sourcePage="rates" />
          </div>
        </div>
      </div>
      <FAQAccordion items={ratesFaqs} />
    </div>
  );
}
