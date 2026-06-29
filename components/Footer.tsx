import Link from "next/link";

const footerLinks = [
  { href: "/emi", label: "EMI" },
  { href: "/prepay", label: "Prepayment" },
  { href: "/sip", label: "SIP" },
  { href: "/tax", label: "Tax" },
  { href: "/fd", label: "FD & RD" },
  { href: "/ppf", label: "PPF" },
  { href: "/hra", label: "HRA" },
  { href: "/gratuity", label: "Gratuity" },
  { href: "/loan-vs-card", label: "Loan vs Card" },
  { href: "/rates", label: "Bank Rates" },
];

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#1E293B] border-t border-[#E2E8F0] dark:border-[#334155] py-6 mt-12">
      <div className="max-w-6xl mx-auto px-4 text-center text-sm text-[#64748B] dark:text-[#94A3B8]">
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1 mb-4" aria-label="Footer">
          {footerLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-xs text-[#64748B] dark:text-[#94A3B8] hover:text-[#0D9488] dark:hover:text-[#14B8A6] transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
        <p>Made with ❤️ for India &nbsp;|&nbsp; Not financial advice</p>
        <p className="mt-1 text-xs">
          All calculations are indicative. Please consult a financial advisor for
          personalised advice.
        </p>
      </div>
    </footer>
  );
}
