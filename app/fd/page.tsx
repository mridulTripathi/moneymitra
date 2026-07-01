import type { Metadata } from "next";
import FDCalculator from "./FDCalculator";
import FAQAccordion from "@/components/FAQAccordion";
import FAQSearch from "@/components/FAQSearch";
import JsonLd from "@/components/JsonLd";
import { DisclaimerBar } from "@/components/DisclaimerBar";
import { pages, SITE_URL, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: pages.fd.title,
  description: pages.fd.description,
  alternates: { canonical: pages.fd.url, languages: { "en-IN": pages.fd.url } },
  openGraph: { title: pages.fd.title, description: pages.fd.description, url: pages.fd.url },
  twitter: { title: pages.fd.title, description: pages.fd.description },
};

const faqs = [
  { q: "How is FD maturity calculated?", a: "Most banks compound FD interest quarterly: Maturity = P × (1 + r/4)^(4×t). A ₹1 lakh FD at 7% for 1 year with quarterly compounding matures to about ₹1,07,186. Monthly compounding gives slightly more: ₹1,07,229." },
  { q: "Do senior citizens get higher FD rates?", a: "Yes. Most banks offer senior citizens an extra 0.50% over the regular FD rate (some banks offer up to 0.75–0.80%). On a ₹10 lakh FD at 7% for 5 years, the senior citizen benefit adds approximately ₹25,000 in extra interest." },
  { q: "What is the difference between FD and RD?", a: "An FD invests a single lump sum for a fixed term. A recurring deposit (RD) invests a fixed amount every month. FDs suit existing savings; RDs suit building savings gradually. For the same total amount over the same period, FD earns more since the full amount earns interest from day one." },
  { q: "Is FD interest taxable in India?", a: "Yes. FD interest is fully taxable at your income tax slab rate. Banks deduct 10% TDS if your interest from one bank exceeds ₹40,000 per year (₹50,000 for senior citizens). Submit Form 15G (or 15H for seniors) if your total income is below the taxable limit to avoid TDS." },
  { q: "Which banks offer the highest FD rates in India 2025?", a: "Small finance banks typically offer the highest FD rates — Suryoday SFB at 8.60%, Jana SFB and Ujjivan SFB at 8.25% on 1-year deposits. Among large banks, Yes Bank and IDFC First are competitive at around 7.75%. DICGC insurance covers deposits up to ₹5 lakh per bank. Check our Rates page for current rates." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to calculate FD maturity amount in India",
  description: "Use MoneyMitra's FD calculator to find your fixed deposit maturity value with quarterly, monthly, or annual compounding.",
  url: pages.fd.url,
  step: [
    { "@type": "HowToStep", position: 1, name: "Enter principal amount", text: "Enter the amount you want to deposit — from ₹10,000 up to ₹1 crore." },
    { "@type": "HowToStep", position: 2, name: "Enter interest rate", text: "Enter the interest rate offered by your bank. Check our Rates page for current FD rates." },
    { "@type": "HowToStep", position: 3, name: "Set tenure", text: "Enter the FD tenure in months or years — from 1 month to 10 years." },
    { "@type": "HowToStep", position: 4, name: "Choose compounding frequency", text: "Select quarterly (most common), monthly, half-yearly, or annually. Higher compounding frequency gives slightly more returns." },
    { "@type": "HowToStep", position: 5, name: "View maturity amount", text: "The calculator instantly shows your maturity amount, total interest earned, and effective annual yield." },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "FD & RD Calculator", item: pages.fd.url },
  ],
};

export default function FDPage() {
  return (
    <>
    <DisclaimerBar />
    <div className="max-w-5xl mx-auto px-4 py-8">
      <JsonLd data={faqSchema} />
      <JsonLd data={howToSchema} />
      <JsonLd data={breadcrumbSchema} />

      <nav aria-label="Breadcrumb" className="text-xs text-[var(--text-tertiary)] mb-4">
        <ol className="flex items-center gap-1">
          <li><a href="/" className="hover:text-[#0D9488]">{SITE_NAME}</a></li>
          <li aria-hidden="true">›</li>
          <li className="text-[var(--text-primary)]">FD &amp; RD Calculator</li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">FD &amp; RD Calculator</h1>
        <p className="text-[#64748B]">See exactly what your fixed or recurring deposit will be worth at maturity.</p>
      </div>

      <FAQSearch />
      <FDCalculator />
      <FAQAccordion items={faqs} />
    </div>
    </>
  );
}
