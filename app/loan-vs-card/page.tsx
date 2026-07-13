import type { Metadata } from "next";
import LoanVsCardCalculator from "./LoanVsCardCalculator";
import FAQAccordion from "@/components/FAQAccordion";
import RelatedTools from "@/components/RelatedTools";
import FAQSearch from "@/components/FAQSearch";
import JsonLd from "@/components/JsonLd";
import { DisclaimerBar } from "@/components/DisclaimerBar";
import PageHeader from "@/components/i18n/PageHeader";
import { pages, SITE_URL, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: pages.loanVsCard.title,
  description: pages.loanVsCard.description,
  alternates: { canonical: pages.loanVsCard.url, languages: { "en-IN": pages.loanVsCard.url } },
  openGraph: { title: pages.loanVsCard.title, description: pages.loanVsCard.description, url: pages.loanVsCard.url },
  twitter: { title: pages.loanVsCard.title, description: pages.loanVsCard.description },
};

const faqs = [
  { q: "Is a personal loan cheaper than credit card EMI?", a: "Usually yes. Personal loans charge about 10.5–24% per year, while credit card EMI conversions typically cost 13–18% per year plus fees and GST. For larger amounts over longer tenures, a personal loan saves significant interest. Use the calculator above to compare your specific figures." },
  { q: "What is the interest rate on credit card EMI in India?", a: "Card EMI conversion typically charges 13–18% per year plus processing fees and GST. Carrying an unpaid balance on a credit card can cost 30–45% per year (2.5–3.75% per month). Always check the effective annual rate before choosing." },
  { q: "When should I use credit card EMI instead of a personal loan?", a: "A no-cost or low-cost card EMI can beat a personal loan for short tenures (3–6 months) and smaller amounts where processing fees would dominate the personal loan cost. For amounts above ₹1 lakh over more than 6 months, a personal loan is usually cheaper." },
  { q: "What is a no-cost EMI?", a: "No-cost EMI typically means the interest is either built into the product price or offset by forgoing a cash discount. You may still pay GST on the implicit interest component. It is rarely completely free — always compare the effective price with and without no-cost EMI." },
  { q: "Are there processing fees on personal loans?", a: "Yes. Personal loans usually carry a processing fee of 1–3% of the loan amount plus 18% GST. For a ₹1 lakh loan, this adds ₹1,180–3,540 upfront. Factor this into your comparison, especially for short tenures where the fee is a large proportion of total cost." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to compare personal loan vs credit card EMI cost in India",
  description: "Use MoneyMitra's Loan vs Card EMI calculator to find which financing option costs less for your purchase.",
  url: pages.loanVsCard.url,
  step: [
    { "@type": "HowToStep", position: 1, name: "Enter purchase amount", text: "Enter the total amount you need to finance." },
    { "@type": "HowToStep", position: 2, name: "Enter personal loan rate", text: "Enter the interest rate offered by your bank for a personal loan — typically 10.5–24%." },
    { "@type": "HowToStep", position: 3, name: "Enter credit card EMI rate", text: "Enter the interest rate for credit card EMI conversion — check your card's terms, typically 13–18%." },
    { "@type": "HowToStep", position: 4, name: "Select tenure", text: "Choose the repayment tenure in months — 3, 6, 9, 12, 18, or 24 months." },
    { "@type": "HowToStep", position: 5, name: "Add fees", text: "Optionally add processing fees to get the true total cost comparison." },
    { "@type": "HowToStep", position: 6, name: "See the winner", text: "The calculator shows monthly EMI, total interest, and total cost for both options, with a clear winner banner." },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Loan vs Card EMI", item: pages.loanVsCard.url },
  ],
};

export default function LoanVsCardPage() {
  return (
    <>
    <DisclaimerBar />
    <div className="max-w-5xl mx-auto px-4 py-8">
      <JsonLd data={faqSchema} />
      <JsonLd data={howToSchema} />
      <JsonLd data={breadcrumbSchema} />

      <PageHeader breadcrumbKey="loanVsCard.page.breadcrumb" titleKey="loanVsCard.page.title" subtitleKey="loanVsCard.page.subtitle" />

      <FAQSearch />
      <LoanVsCardCalculator />
      <RelatedTools />
      <FAQAccordion items={faqs} />
    </div>
    </>
  );
}
