import type { Metadata } from "next";
import HRACalculator from "./HRACalculator";
import FAQAccordion from "@/components/FAQAccordion";
import FAQSearch from "@/components/FAQSearch";
import JsonLd from "@/components/JsonLd";
import { DisclaimerBar } from "@/components/DisclaimerBar";
import { pages, SITE_URL, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: pages.hra.title,
  description: pages.hra.description,
  alternates: { canonical: pages.hra.url, languages: { "en-IN": pages.hra.url } },
  openGraph: { title: pages.hra.title, description: pages.hra.description, url: pages.hra.url },
  twitter: { title: pages.hra.title, description: pages.hra.description },
};

const faqs = [
  { q: "How is HRA exemption calculated?", a: "HRA exemption is the least of three values: (1) actual HRA received from employer, (2) 50% of basic+DA for metro cities or 40% for non-metro, and (3) actual rent paid minus 10% of basic+DA. Only the lowest of these three is tax-exempt." },
  { q: "Which cities count as metro for HRA calculation?", a: "Only Delhi, Mumbai, Kolkata, and Chennai are treated as metro cities (50% limit applies). All other cities — including Bengaluru, Hyderabad, Pune, and Ahmedabad — use the 40% non-metro limit." },
  { q: "Can I claim HRA if I live with my parents?", a: "Yes, if you actually pay rent to your parents who own the home. You need a rent agreement and proof of payment (bank transfer). Your parents must declare the rent as income in their tax return." },
  { q: "Do I need rent receipts to claim HRA?", a: "Yes. You need rent receipts for any HRA claim. If annual rent exceeds ₹1 lakh (₹8,333/month), you must also provide your landlord's PAN. Keep a rent agreement and bank payment records." },
  { q: "Is HRA exemption available in the new tax regime?", a: "No. HRA exemption is only available under the old tax regime. If you pay significant rent, this can make the old regime more advantageous. Use the Tax Comparator to check your specific situation." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to calculate HRA exemption in India",
  description: "Use MoneyMitra's HRA calculator to find your exact House Rent Allowance tax exemption using the 3-condition formula.",
  url: pages.hra.url,
  step: [
    { "@type": "HowToStep", position: 1, name: "Enter your basic salary", text: "Enter your monthly basic salary and dearness allowance (DA) as per your payslip." },
    { "@type": "HowToStep", position: 2, name: "Enter HRA received", text: "Enter the HRA component from your salary — found in your offer letter or payslip." },
    { "@type": "HowToStep", position: 3, name: "Enter rent paid", text: "Enter the monthly rent you actually pay to your landlord." },
    { "@type": "HowToStep", position: 4, name: "Select city type", text: "Choose Metro (Delhi, Mumbai, Kolkata, Chennai) for 50% limit, or Non-metro for 40% limit." },
    { "@type": "HowToStep", position: 5, name: "See your exemption", text: "The calculator shows all three formula values and highlights the minimum — your actual HRA tax exemption." },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "HRA Calculator", item: pages.hra.url },
  ],
};

export default function HRAPage() {
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
          <li className="text-[#0F172A]">HRA Calculator</li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">HRA Exemption Calculator</h1>
        <p className="text-[#64748B]">Find out exactly how much of your House Rent Allowance is tax-free.</p>
      </div>

      <FAQSearch />
      <HRACalculator />
      <FAQAccordion items={faqs} />
    </div>
    </>
  );
}
