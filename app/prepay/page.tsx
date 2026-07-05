import type { Metadata } from "next";
import PrepayCalculator from "./PrepayCalculator";
import FAQAccordion from "@/components/FAQAccordion";
import RelatedTools from "@/components/RelatedTools";
import FAQSearch from "@/components/FAQSearch";
import JsonLd from "@/components/JsonLd";
import { DisclaimerBar } from "@/components/DisclaimerBar";
import { pages, SITE_URL, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: pages.prepay.title,
  description: pages.prepay.description,
  alternates: { canonical: pages.prepay.url, languages: { "en-IN": pages.prepay.url } },
  openGraph: { title: pages.prepay.title, description: pages.prepay.description, url: pages.prepay.url },
  twitter: { title: pages.prepay.title, description: pages.prepay.description },
};

const faqs = [
  { q: "Does prepaying a home loan reduce EMI or tenure in India?", a: "You can choose either option. Reducing tenure keeps your EMI the same but closes the loan sooner — saving more total interest. Reducing EMI gives monthly cash flow relief but saves less interest overall. Most financial advisors recommend reducing tenure if you can comfortably afford your current EMI." },
  { q: "How much can I prepay on my home loan without penalty?", a: "For floating-rate home loans, RBI guidelines prohibit banks from charging prepayment penalties. Most banks allow up to 25% of the outstanding principal as prepayment in a financial year without any charges. Fixed-rate loan prepayment terms vary by lender." },
  { q: "Is it better to prepay my home loan or invest in mutual funds?", a: "The break-even is roughly your loan interest rate. If your home loan rate is above 8.5%, the guaranteed interest saving from prepayment often beats uncertain market returns after tax. If your rate is below 8%, investing in a Nifty 50 index fund (historical 12% CAGR) may build more wealth. Your answer depends on your tax slab, risk appetite, and remaining tenure." },
  { q: "How much interest do I save by prepaying ₹5 lakh on my home loan?", a: "On a ₹50 lakh loan at 8.5% with 15 years remaining, a ₹5 lakh lump-sum prepayment saves approximately ₹8.2 lakh in total interest and closes the loan about 18 months early — if you choose to reduce tenure. Use the simulator above with your exact loan details for a precise number." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to calculate home loan prepayment savings",
  description: "Use MoneyMitra's prepayment simulator to find exactly how much interest and time you save with a lump-sum prepayment.",
  url: pages.prepay.url,
  step: [
    { "@type": "HowToStep", position: 1, name: "Enter your loan details", text: "Enter your original loan amount, interest rate, and tenure as per your loan agreement." },
    { "@type": "HowToStep", position: 2, name: "Enter EMIs already paid", text: "Enter how many monthly EMIs you have already paid so far." },
    { "@type": "HowToStep", position: 3, name: "Enter prepayment amount", text: "Enter the lump sum amount you plan to prepay and when (in months from today)." },
    { "@type": "HowToStep", position: 4, name: "Choose your goal", text: "Select whether you want to reduce tenure (close loan earlier) or reduce EMI (lower monthly outflow)." },
    { "@type": "HowToStep", position: 5, name: "See your savings", text: "The simulator instantly shows interest saved, time saved, and your new loan closure date." },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Prepayment Simulator", item: pages.prepay.url },
  ],
};

export default function PrepayPage() {
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
          <li className="text-[var(--text-primary)]">Prepayment Simulator</li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Prepayment &amp; Foreclosure Simulator</h1>
        <p className="text-[#64748B]">Find out how much you save by paying extra on your loan.</p>
      </div>

      <FAQSearch />
      <PrepayCalculator />
      <RelatedTools />
      <FAQAccordion items={faqs} />
    </div>
    </>
  );
}
