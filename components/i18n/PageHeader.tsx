"use client";
import { SITE_NAME } from "@/lib/seo";
import Link from "next/link";
import { useTranslation } from "@/components/i18n/LanguageProvider";

interface Props {
  breadcrumbKey: string;
  titleKey: string;
  subtitleKey: string;
}

// Renders the breadcrumb + h1 + subtitle block shared by every calculator
// page. Client-side because it needs useTranslation(); the parent page.tsx
// stays a server component for metadata/data-fetching.
export default function PageHeader({ breadcrumbKey, titleKey, subtitleKey }: Props) {
  const { t } = useTranslation();
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-xs text-[var(--text-tertiary)] mb-4">
        <ol className="flex items-center gap-1">
          <li><Link href="/" className="hover:text-[#0D9488]">{SITE_NAME}</Link></li>
          <li aria-hidden="true">›</li>
          <li className="text-[var(--text-primary)]">{t(breadcrumbKey)}</li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">{t(titleKey)}</h1>
        <p className="text-[#64748B]">{t(subtitleKey)}</p>
      </div>
    </>
  );
}
