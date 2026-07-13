import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import HomeContent from "./HomeContent";
import { SITE_URL, SITE_NAME, pages } from "@/lib/seo";
import { createServiceClient } from "@/lib/supabase";

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
    const [rbiRes, bankRes] = await Promise.all([
      client.from('rbi_policy_rates').select('*').order('effective_date', { ascending: false }).limit(1).single(),
      client.from('bank_rates').select('bank_name,bank_short_name,rate_type,min_rate,max_rate').in('rate_type', ['home_loan', 'fd_1yr', 'personal_loan']),
    ]);
    const rbi = rbiRes.data;
    const banks = bankRes.data ?? [];
    const bestHomeLoan = banks.filter((b: {rate_type: string, min_rate: number}) => b.rate_type === 'home_loan').sort((a: {min_rate: number}, b: {min_rate: number}) => a.min_rate - b.min_rate)[0];
    const bestFD = banks.filter((b: {rate_type: string, max_rate: number}) => b.rate_type === 'fd_1yr').sort((a: {max_rate: number}, b: {max_rate: number}) => b.max_rate - a.max_rate)[0];
    const bestPersonalLoan = banks.filter((b: {rate_type: string, min_rate: number}) => b.rate_type === 'personal_loan').sort((a: {min_rate: number}, b: {min_rate: number}) => a.min_rate - b.min_rate)[0];
    return { rbi, bestHomeLoan, bestFD, bestPersonalLoan, lastUpdated: null };
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

export default async function Home() {
  const ratesSnapshot = await getRatesSnapshot();

  return (
    <>
      <JsonLd data={webAppSchema} />
      <JsonLd data={homeFaqSchema} />
      <HomeContent ratesSnapshot={ratesSnapshot} />
    </>
  );
}
