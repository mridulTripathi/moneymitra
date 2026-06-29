import type { Metadata } from "next";
import GratuityCalculator from "./GratuityCalculator";
import FAQAccordion from "@/components/FAQAccordion";
import FAQSearch from "@/components/FAQSearch";
import JsonLd from "@/components/JsonLd";
import { pages, SITE_URL, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: pages.gratuity.title,
  description: pages.gratuity.description,
  alternates: { canonical: pages.gratuity.url, languages: { "en-IN": pages.gratuity.url } },
  openGraph: { title: pages.gratuity.title, description: pages.gratuity.description, url: pages.gratuity.url },
  twitter: { title: pages.gratuity.title, description: pages.gratuity.description },
};

const faqs = [
  { q: "How is gratuity calculated in India?", a: "For employees covered by the Gratuity Act: Gratuity = (last drawn basic+DA × 15 × completed years of service) ÷ 26. For example, ₹50,000 basic+DA and 10 years gives ₹2,88,461. The '15' represents 15 days' salary and '26' represents working days in a month." },
  { q: "What is the minimum service period for gratuity?", a: "You need at least 5 continuous years of service to be eligible for gratuity. The 5-year requirement is waived if service ends due to death or disablement." },
  { q: "Is gratuity tax-free in India?", a: "Gratuity is tax-free up to ₹20 lakh (lifetime limit) for non-government employees covered under the Gratuity Act. Amounts above ₹20 lakh are taxable as salary income." },
  { q: "What is the gratuity formula for employees not covered by the Act?", a: "For employees not covered under the Payment of Gratuity Act: Gratuity = (last drawn basic+DA × 15 × years of service) ÷ 30. This formula uses 30 instead of 26, resulting in a lower payout." },
  { q: "How are partial years counted for gratuity?", a: "Under the Gratuity Act, service beyond 6 months in the final year rounds up to a full year. So 10 years and 7 months counts as 11 years; 10 years and 5 months counts as 10 years." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to calculate gratuity in India",
  description: "Use MoneyMitra's gratuity calculator to find your gratuity entitlement under the Payment of Gratuity Act.",
  url: pages.gratuity.url,
  step: [
    { "@type": "HowToStep", position: 1, name: "Choose coverage status", text: "Select whether your employer is covered under the Payment of Gratuity Act (most organizations with 10+ employees are)." },
    { "@type": "HowToStep", position: 2, name: "Enter last drawn salary", text: "Enter your last drawn basic salary plus dearness allowance (DA) per month." },
    { "@type": "HowToStep", position: 3, name: "Enter years of service", text: "Enter your completed years of continuous service. Minimum 5 years is required for eligibility." },
    { "@type": "HowToStep", position: 4, name: "View gratuity amount", text: "The calculator shows your total gratuity, the tax-free portion (up to ₹20 lakh), and the taxable portion if any." },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Gratuity Calculator", item: pages.gratuity.url },
  ],
};

export default function GratuityPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <JsonLd data={faqSchema} />
      <JsonLd data={howToSchema} />
      <JsonLd data={breadcrumbSchema} />

      <nav aria-label="Breadcrumb" className="text-xs text-[var(--text-tertiary)] mb-4">
        <ol className="flex items-center gap-1">
          <li><a href="/" className="hover:text-[#0D9488]">{SITE_NAME}</a></li>
          <li aria-hidden="true">›</li>
          <li className="text-[#0F172A]">Gratuity Calculator</li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Gratuity Calculator</h1>
        <p className="text-[#64748B]">Estimate your gratuity payout under the Payment of Gratuity Act.</p>
      </div>

      <FAQSearch />
      <GratuityCalculator />
      <FAQAccordion items={faqs} />
    </div>
  );
}
