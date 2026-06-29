import type { Metadata } from "next";
import TaxCalculator from "./TaxCalculator";
import FAQAccordion from "@/components/FAQAccordion";
import FAQSearch from "@/components/FAQSearch";
import JsonLd from "@/components/JsonLd";
import { pages, SITE_URL, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: pages.tax.title,
  description: pages.tax.description,
  alternates: { canonical: pages.tax.url, languages: { "en-IN": pages.tax.url } },
  openGraph: { title: pages.tax.title, description: pages.tax.description, url: pages.tax.url },
  twitter: { title: pages.tax.title, description: pages.tax.description },
};

const faqs = [
  { q: "Which is better — new tax regime or old tax regime in India 2025?", a: "For most salaried individuals with annual income below ₹12 lakh, the new tax regime is better because of the full Section 87A rebate that makes tax effectively zero. For those earning above ₹15 lakh with significant deductions — 80C (₹1.5L), HRA exemption, and home loan interest (₹2L) — the old regime may save more. Use the calculator above to compare your exact situation." },
  { q: "Is income up to ₹12 lakh tax free in 2025?", a: "Yes. Under the new tax regime for FY 2025-26, individuals with taxable income up to ₹12 lakh receive a full rebate under Section 87A, making their effective income tax zero. Taxable income is gross salary minus the ₹75,000 standard deduction — so you can earn up to ₹12.75 lakh gross and still pay zero tax under the new regime." },
  { q: "What is the standard deduction for salaried employees in FY 2025-26?", a: "The standard deduction is ₹75,000 under the new tax regime and ₹50,000 under the old tax regime for FY 2025-26. This is automatically applied to all salaried individuals — no proof or claim needed." },
  { q: "Should I opt for the new tax regime if I have a home loan?", a: "If your total old-regime deductions — 80C (max ₹1.5L), home loan interest 24(b) (max ₹2L), HRA, and NPS 80CCD(1B) — sum to more than ₹2.75 lakh above the new regime standard deduction difference, the old regime saves more. Enter your exact salary and deductions in the calculator above to find the precise difference." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to compare new vs old tax regime in India for FY 2025-26",
  description: "Use MoneyMitra's tax comparator to find which income tax regime saves you more money based on your salary and deductions.",
  url: pages.tax.url,
  step: [
    { "@type": "HowToStep", position: 1, name: "Enter your gross salary", text: "Enter your annual gross salary (CTC before any deductions) for FY 2025-26." },
    { "@type": "HowToStep", position: 2, name: "Toggle your deductions", text: "Enable the deductions that apply to you — 80C investments, health insurance (80D), HRA, home loan interest, and NPS contributions." },
    { "@type": "HowToStep", position: 3, name: "Enter deduction amounts", text: "For each enabled deduction, enter the exact amount you invest or pay." },
    { "@type": "HowToStep", position: 4, name: "See the comparison", text: "The calculator instantly shows tax payable and monthly take-home under both regimes, and highlights which one saves you more." },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Tax Regime Comparator", item: pages.tax.url },
  ],
};

export default function TaxPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <JsonLd data={faqSchema} />
      <JsonLd data={howToSchema} />
      <JsonLd data={breadcrumbSchema} />

      <nav aria-label="Breadcrumb" className="text-xs text-[#94A3B8] mb-4">
        <ol className="flex items-center gap-1">
          <li><a href="/" className="hover:text-[#0D9488]">{SITE_NAME}</a></li>
          <li aria-hidden="true">›</li>
          <li className="text-[#0F172A]">Tax Regime Comparator</li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">New vs Old Tax Regime Comparator</h1>
        <p className="text-[#64748B]">FY 2025-26 · Find out which regime keeps more money in your pocket.</p>
      </div>

      <FAQSearch />
      <TaxCalculator />
      <FAQAccordion items={faqs} />
    </div>
  );
}
