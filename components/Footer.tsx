"use client";
import Link from "next/link";
import { useTranslation } from "@/components/i18n/LanguageProvider";

export default function Footer() {
  const { t } = useTranslation();
  const footerLinks = [
    { href: "/emi", label: t("footer.emi") },
    { href: "/prepay", label: t("footer.prepayment") },
    { href: "/sip", label: t("footer.sip") },
    { href: "/tax", label: t("footer.tax") },
    { href: "/fd", label: t("footer.fdRd") },
    { href: "/ppf", label: t("footer.ppf") },
    { href: "/hra", label: t("footer.hra") },
    { href: "/gratuity", label: t("footer.gratuity") },
    { href: "/loan-vs-card", label: t("footer.loanVsCard") },
    { href: "/rates", label: t("footer.bankRates") },
  ];

  return (
    <footer className="bg-[var(--bg-card)] border-t border-[var(--border-default)] py-6 mt-12">
      <div className="max-w-6xl mx-auto px-4 text-center text-sm text-[var(--text-secondary)]">
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1 mb-4" aria-label="Footer">
          {footerLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-xs text-[var(--text-secondary)] hover:text-[#0D9488] dark:hover:text-[#14B8A6] transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
        <p>{t("footer.madeWithLove")}</p>
        <p className="mt-1 text-xs">
          {t("footer.disclaimer")}
        </p>
      </div>
    </footer>
  );
}
