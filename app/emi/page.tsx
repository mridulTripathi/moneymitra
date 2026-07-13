import type { Metadata } from "next";
import EMICalculator from "./EMICalculator";
import FAQAccordion from "@/components/FAQAccordion";
import FAQSearch from "@/components/FAQSearch";
import JsonLd from "@/components/JsonLd";
import { DisclaimerBar } from "@/components/DisclaimerBar";
import PageHeader from "@/components/i18n/PageHeader";
import { pages, SITE_URL, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: pages.emi.title,
  description: pages.emi.description,
  alternates: { canonical: pages.emi.url, languages: { "en-IN": pages.emi.url } },
  openGraph: { title: pages.emi.title, description: pages.emi.description, url: pages.emi.url },
  twitter: { title: pages.emi.title, description: pages.emi.description },
};

const faqs = [
  { q: "How is EMI calculated in India?", a: `EMI = P × r × (1+r)^n ÷ ((1+r)^n − 1), where P is the principal, r is the monthly interest rate (annual rate ÷ 12 ÷ 100), and n is tenure in months. For example, a ₹30 lakh home loan at 8.5% for 20 years gives a monthly EMI of ₹26,035.` },
  { q: "What is the EMI for a ₹20 lakh home loan for 20 years?", a: "At 8.5% annual interest, the monthly EMI for a ₹20 lakh home loan over 20 years is approximately ₹17,356. Total interest paid over 20 years is about ₹21.7 lakh — making total repayment roughly ₹41.7 lakh." },
  { q: "What is the EMI for a ₹50 lakh home loan?", a: "At 8.5% annual interest for 20 years, the monthly EMI for a ₹50 lakh home loan is approximately ₹43,391. Total interest paid over 20 years is around ₹54.1 lakh." },
  { q: "What happens if I increase my EMI by ₹1,000 every month?", a: "On a ₹30 lakh loan at 8.5% for 20 years, increasing your EMI by ₹1,000 per month saves approximately ₹3.2 lakh in total interest and closes your loan about 14 months early." },
  { q: "Which bank has the lowest home loan interest rate in India?", a: "Home loan interest rates in India typically range from 8.35% to 9.5% as of 2025. SBI, HDFC, and LIC Housing Finance are usually competitive. Check our Rates page for current rates and use the EMI calculator above to compare monthly payments." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to calculate home loan EMI in India",
  description: "Use the MoneyMitra EMI calculator to instantly compute your monthly instalment, total interest, and full amortization schedule.",
  url: pages.emi.url,
  step: [
    { "@type": "HowToStep", position: 1, name: "Enter loan amount", text: "Enter your loan amount in rupees — for example ₹30,00,000 for a ₹30 lakh home loan." },
    { "@type": "HowToStep", position: 2, name: "Enter interest rate", text: "Enter the annual interest rate offered by your bank — typically between 8.35% and 9.5% in 2025." },
    { "@type": "HowToStep", position: 3, name: "Select loan tenure", text: "Select your loan tenure in years — home loans are typically 10 to 30 years." },
    { "@type": "HowToStep", position: 4, name: "View results", text: "Your monthly EMI appears instantly along with total interest payable and a full year-by-year amortization schedule with CSV export." },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "EMI Calculator", item: pages.emi.url },
  ],
};

export default function EMIPage() {
  return (
    <>
    <DisclaimerBar />
    <div className="max-w-5xl mx-auto px-4 py-8">
      <JsonLd data={faqSchema} />
      <JsonLd data={howToSchema} />
      <JsonLd data={breadcrumbSchema} />

      <PageHeader breadcrumbKey="emi.page.breadcrumb" titleKey="emi.page.title" subtitleKey="emi.page.subtitle" />

      <FAQSearch />
      <EMICalculator />
      <FAQAccordion items={faqs} />
    </div>
    </>
  );
}
