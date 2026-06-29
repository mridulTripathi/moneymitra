import type { Metadata } from "next";
import PPFCalculator from "./PPFCalculator";
import FAQAccordion from "@/components/FAQAccordion";
import FAQSearch from "@/components/FAQSearch";
import JsonLd from "@/components/JsonLd";
import { pages, SITE_URL, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: pages.ppf.title,
  description: pages.ppf.description,
  alternates: { canonical: pages.ppf.url, languages: { "en-IN": pages.ppf.url } },
  openGraph: { title: pages.ppf.title, description: pages.ppf.description, url: pages.ppf.url },
  twitter: { title: pages.ppf.title, description: pages.ppf.description },
};

const faqs = [
  { q: "What is the current PPF interest rate?", a: "PPF currently earns 7.1% per year, compounded annually and reviewed quarterly by the government. Interest is calculated on the lowest balance between the 5th and last day of each month." },
  { q: "How much does ₹1.5 lakh a year in PPF grow in 15 years?", a: "Investing the maximum ₹1.5 lakh/year for 15 years at 7.1% grows to about ₹40.68 lakh, on ₹22.5 lakh invested — roughly ₹18 lakh of tax-free interest." },
  { q: "Is PPF tax-free?", a: "Yes, PPF is EEE: contributions qualify for 80C deduction (old regime only), the interest earned is tax-free every year, and the maturity amount is completely tax-free." },
  { q: "What is the PPF lock-in period?", a: "PPF has a 15-year maturity. Partial withdrawals are allowed from year 7 and loans against the balance are allowed from year 3. You can extend in 5-year blocks after maturity." },
  { q: "Should I invest at the start or end of the year in PPF?", a: "Invest before the 5th of April. Interest is computed on the minimum balance after the 5th, so depositing early earns a full year of interest on that contribution — over 15 years this timing difference adds thousands of rupees." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to calculate PPF maturity amount in India",
  description: "Use MoneyMitra's PPF calculator to project your Public Provident Fund corpus with year-by-year breakdown.",
  url: pages.ppf.url,
  step: [
    { "@type": "HowToStep", position: 1, name: "Enter yearly investment", text: "Enter how much you invest in PPF each year. The maximum allowed is ₹1.5 lakh per year." },
    { "@type": "HowToStep", position: 2, name: "Set tenure", text: "PPF has a 15-year lock-in. You can extend in 5-year blocks. Choose 15, 20, 25, or 30 years." },
    { "@type": "HowToStep", position: 3, name: "Set investment timing", text: "Select 'Start of year' (invest before 5th April) or 'End of year'. Start-of-year earns more interest." },
    { "@type": "HowToStep", position: 4, name: "View corpus and breakdown", text: "The calculator shows your total invested, total tax-free interest, maturity value, and a year-by-year table." },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "PPF Calculator", item: pages.ppf.url },
  ],
};

export default function PPFPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <JsonLd data={faqSchema} />
      <JsonLd data={howToSchema} />
      <JsonLd data={breadcrumbSchema} />

      <nav aria-label="Breadcrumb" className="text-xs text-[#94A3B8] mb-4">
        <ol className="flex items-center gap-1">
          <li><a href="/" className="hover:text-[#0D9488]">{SITE_NAME}</a></li>
          <li aria-hidden="true">›</li>
          <li className="text-[#0F172A]">PPF Calculator</li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">PPF Calculator</h1>
        <p className="text-[#64748B]">Project your tax-free Public Provident Fund corpus, year by year.</p>
      </div>

      <FAQSearch />
      <PPFCalculator />
      <FAQAccordion items={faqs} />
    </div>
  );
}
