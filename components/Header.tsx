"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "@/components/i18n/LanguageProvider";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-10 h-10" />;
  const isDark = resolvedTheme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-10 h-10 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 dark:hover:bg-[#1E293B] transition-all"
      aria-label={isDark ? t("header.themeToggleLight") : t("header.themeToggleDark")}
    >
      <span className={`transition-transform duration-300 ${isDark ? "rotate-180" : "rotate-0"}`}>
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </span>
    </button>
  );
}

export default function Header() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = usePathname();
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [ratesData, setRatesData] = useState<{repo: number|null, bestFD: number|null, bestHL: number|null}>({repo: null, bestFD: null, bestHL: null});
  const tooltipRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const primaryLinks = [
    { href: "/emi", label: t("nav.emi") },
    { href: "/prepay", label: t("nav.prepay") },
    { href: "/sip", label: t("nav.sip") },
    { href: "/tax", label: t("nav.tax") },
    { href: "/rates", label: t("nav.rates") },
  ];

  const moreLinks = [
    { href: "/fd", label: t("nav.fdRd") },
    { href: "/ppf", label: t("nav.ppf") },
    { href: "/hra", label: t("nav.hra") },
    { href: "/gratuity", label: t("nav.gratuity") },
    { href: "/loan-vs-card", label: t("nav.loanVsCard") },
  ];

  const allLinks = [...primaryLinks, ...moreLinks];

  useEffect(() => {
    Promise.all([
      fetch('/api/rbi-rates').then(r => r.json()),
      fetch('/api/bank-rates?type=fd_1yr').then(r => r.json()),
      fetch('/api/bank-rates?type=home_loan').then(r => r.json()),
    ]).then(([rbi, fdRates, hlRates]) => {
      const repo = rbi?.repo_rate ?? null;
      const bestFD = Array.isArray(fdRates) && fdRates.length > 0
        ? Math.max(...fdRates.map((r: {max_rate: number}) => r.max_rate))
        : null;
      const bestHL = Array.isArray(hlRates) && hlRates.length > 0
        ? Math.min(...hlRates.map((r: {min_rate: number}) => r.min_rate))
        : null;
      setRatesData({ repo, bestFD: bestFD !== null && isFinite(bestFD) ? bestFD : null, bestHL: bestHL !== null && isFinite(bestHL) ? bestHL : null });
    }).catch(() => {});
  }, []);

  const linkClass = (href: string) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
      pathname === href
        ? "bg-[#0D9488]/10 text-[#0D9488] dark:text-[#14B8A6]"
        : "text-[var(--text-secondary)] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] hover:bg-[var(--bg-elevated)]"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-card)] border-b border-[var(--border-default)] shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0" onClick={() => setOpen(false)}>
          <span className="text-xl font-bold text-[#0D9488] tracking-tight group-hover:text-[#0F766E] transition-colors">
            MoneyMitra
          </span>
          <span className="hidden lg:block text-xs text-[#64748B] font-normal">{t("header.tagline")}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {primaryLinks.filter(l => l.href !== '/rates').map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>{l.label}</Link>
          ))}
          <div className="relative"
            onMouseEnter={() => { if (tooltipRef.current) clearTimeout(tooltipRef.current); setTooltipOpen(true); }}
            onMouseLeave={() => { tooltipRef.current = setTimeout(() => setTooltipOpen(false), 200); }}
          >
            <Link href="/rates" className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#0D9488] dark:bg-[#14B8A6] text-white dark:text-[#0a0f1a] text-sm font-semibold hover:bg-[#0F766E] dark:hover:bg-[#0d9488] transition-colors whitespace-nowrap dark:shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              <span className="relative flex h-2 w-2 mr-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              {t("header.liveRates")}
            </Link>
            {tooltipOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 w-52 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl shadow-xl p-3 text-sm"
                onMouseEnter={() => { if (tooltipRef.current) clearTimeout(tooltipRef.current); setTooltipOpen(true); }}
                onMouseLeave={() => { tooltipRef.current = setTimeout(() => setTooltipOpen(false), 200); }}
              >
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[var(--bg-card)] border-l border-t border-[var(--border-default)] rotate-45" />
                {ratesData.repo !== null ? (
                  <div className="space-y-1.5 text-[var(--text-primary)]">
                    <div className="flex justify-between"><span className="text-[var(--text-secondary)]">{t("header.repoRate")}</span><span className="font-semibold text-green-600 dark:text-green-400">{ratesData.repo}%</span></div>
                    {ratesData.bestFD !== null && <div className="flex justify-between"><span className="text-[var(--text-secondary)]">{t("header.bestFD")}</span><span className="font-semibold text-amber-600 dark:text-amber-400">Up to {ratesData.bestFD}%</span></div>}
                    {ratesData.bestHL !== null && <div className="flex justify-between"><span className="text-[var(--text-secondary)]">{t("header.bestHomeLoan")}</span><span className="font-semibold text-teal-600 dark:text-teal-400">From {ratesData.bestHL}%</span></div>}
                    <Link href="/rates" className="block text-center text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 pt-1 border-t border-[var(--border-default)] mt-2">{t("header.seeAllRates")}</Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {[1,2,3].map(i => <div key={i} className="h-4 bg-[var(--bg-elevated)] rounded animate-pulse" />)}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="relative" onMouseLeave={() => setMoreOpen(false)}>
            <button
              onClick={() => setMoreOpen((v) => !v)}
              onMouseEnter={() => setMoreOpen(true)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] flex items-center gap-1 transition-colors"
              aria-expanded={moreOpen}
            >
              {t("nav.more")} <ChevronDown size={14} />
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full mt-1 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl shadow-lg py-1 min-w-[160px]">
                {moreLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMoreOpen(false)}
                    className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                      pathname === l.href ? "bg-[#0D9488]/10 text-[#0D9488] dark:text-[#14B8A6]" : "text-[var(--text-secondary)] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] hover:bg-[var(--bg-elevated)]"
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Language switcher (desktop) */}
        <div className="hidden md:block">
          <LanguageSwitcher variant="desktop" />
        </div>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 dark:hover:bg-[#1E293B] transition-colors"
          onClick={() => setOpen(!open)}
          aria-label={t("header.toggleMenu")}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[var(--border-default)] bg-[var(--bg-card)] px-4 py-2 flex flex-col gap-1 max-h-[70vh] overflow-y-auto">
          {allLinks.filter(l => l.href !== '/rates').map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                pathname === l.href ? "bg-[#0D9488]/10 text-[#0D9488] dark:text-[#14B8A6]" : "text-[var(--text-secondary)] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] hover:bg-[var(--bg-elevated)]"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/rates"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#0D9488] dark:bg-[#14B8A6] text-white dark:text-[#0a0f1a] text-base font-semibold transition-colors"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            {t("header.liveRates")}
          </Link>
          <div className="mt-1 pt-1 border-t border-[var(--border-default)]">
            <LanguageSwitcher variant="mobile" />
          </div>
        </div>
      )}
    </header>
  );
}
