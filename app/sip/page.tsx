import type { Metadata } from "next";
import SIPCalculator from "./SIPCalculator";
import FAQAccordion from "@/components/FAQAccordion";
import FAQSearch from "@/components/FAQSearch";
import JsonLd from "@/components/JsonLd";
import { pages, SITE_URL, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: pages.sip.title,
  description: pages.sip.description,
  alternates: { canonical: pages.sip.url, languages: { "en-IN": pages.sip.url } },
  openGraph: { title: pages.sip.title, description: pages.sip.description, url: pages.sip.url },
  twitter: { title: pages.sip.title, description: pages.sip.description },
};

const faqs = [
  { q: "How much will I get if I invest ₹10,000 per month in SIP for 20 years?", a: "At 12% expected annual returns (the historical average for Nifty 50 index funds), a ₹10,000 per month SIP for 20 years grows to approximately ₹99.9 lakh — nearly ₹1 crore. Your total investment is ₹24 lakh; the remaining ₹75.9 lakh comes from compounding returns." },
  { q: "What is step-up SIP and is it better than regular SIP?", a: "A step-up SIP increases your monthly investment by a fixed percentage each year — typically 10%. Starting at ₹10,000 and increasing by 10% annually, at 12% returns over 20 years you reach approximately ₹1.89 crore — nearly double the ₹99.9 lakh from a regular SIP. It works because your investments grow alongside your income." },
  { q: "How much SIP do I need to become a crorepati in 15 years?", a: "At 12% expected annual returns, you need approximately ₹20,000 per month SIP for 15 years to reach ₹1 crore. With a 10% annual step-up, you can start with around ₹12,000 per month and still cross ₹1 crore in 15 years." },
  { q: "Which mutual fund gives the best SIP returns in India?", a: "Historically, Nifty 50 index funds have delivered 12–14% CAGR over 15+ year periods with low fees (0.1–0.2% expense ratio). For long-term SIP, low-cost index funds are often recommended. Past returns do not guarantee future performance." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to calculate SIP returns in India",
  description: "Use MoneyMitra's SIP calculator to project your mutual fund wealth growth with basic or step-up SIP.",
  url: pages.sip.url,
  step: [
    { "@type": "HowToStep", position: 1, name: "Choose SIP type", text: "Select Basic SIP for a fixed monthly amount or Step-Up SIP to increase your investment by a percentage each year." },
    { "@type": "HowToStep", position: 2, name: "Enter monthly investment", text: "Enter how much you plan to invest each month — even ₹500 is a valid starting point." },
    { "@type": "HowToStep", position: 3, name: "Set expected return rate", text: "Enter the expected annual return rate. Nifty 50 index funds have historically returned 12–13% CAGR over 15+ years." },
    { "@type": "HowToStep", position: 4, name: "Set investment period", text: "Enter how many years you plan to stay invested. Longer tenure = dramatically more compounding." },
    { "@type": "HowToStep", position: 5, name: "See your projected corpus", text: "The calculator instantly shows your total corpus, total invested, estimated returns, and a year-by-year growth chart." },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "SIP Calculator", item: pages.sip.url },
  ],
};

export default function SIPPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <JsonLd data={faqSchema} />
      <JsonLd data={howToSchema} />
      <JsonLd data={breadcrumbSchema} />

      <nav aria-label="Breadcrumb" className="text-xs text-[var(--text-tertiary)] mb-4">
        <ol className="flex items-center gap-1">
          <li><a href="/" className="hover:text-[#0D9488]">{SITE_NAME}</a></li>
          <li aria-hidden="true">›</li>
          <li className="text-[#0F172A]">SIP Calculator</li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">SIP &amp; Wealth Growth Calculator</h1>
        <p className="text-[#64748B]">See how your money multiplies when you stay invested consistently.</p>
      </div>

      <FAQSearch />
      <SIPCalculator />
      <FAQAccordion items={faqs} />
    </div>
  );
}
