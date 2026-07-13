import type { Metadata } from "next";
import { Suspense } from "react";
import RatesPage from "./RatesPage";
import FAQAccordion from "@/components/FAQAccordion";
import RelatedTools from "@/components/RelatedTools";
import FAQSearch from "@/components/FAQSearch";
import JsonLd from "@/components/JsonLd";
import RatesPageIntro from "@/components/rates/RatesPageIntro";
import RatesDisclaimerBox from "@/components/rates/RatesDisclaimerBox";
import RatesAlertsCard from "@/components/rates/RatesAlertsCard";
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

      <RatesPageIntro lastUpdated={lastUpdated} />

      <FAQSearch />
      <RatesDisclaimerBox />
      <Suspense fallback={null}>
        <RatesPage rbi={rbi} bankRates={bankRates} lastUpdated={lastUpdated} />
      </Suspense>
      <RatesAlertsCard />
      <RelatedTools />
      <FAQAccordion items={ratesFaqs} />
    </div>
  );
}
