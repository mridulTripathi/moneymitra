"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-10 h-10" />;
  const isDark = resolvedTheme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-10 h-10 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 dark:hover:bg-[#1E293B] transition-all"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className={`transition-transform duration-300 ${isDark ? "rotate-180" : "rotate-0"}`}>
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </span>
    </button>
  );
}

const primaryLinks = [
  { href: "/emi", label: "EMI" },
  { href: "/prepay", label: "Prepay" },
  { href: "/sip", label: "SIP" },
  { href: "/tax", label: "Tax" },
  { href: "/rates", label: "Rates" },
];

const moreLinks = [
  { href: "/fd", label: "FD & RD" },
  { href: "/ppf", label: "PPF" },
  { href: "/hra", label: "HRA" },
  { href: "/gratuity", label: "Gratuity" },
  { href: "/loan-vs-card", label: "Loan vs Card" },
];

const allLinks = [...primaryLinks, ...moreLinks];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = usePathname();
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [ratesData, setRatesData] = useState<{repo: number|null, bestFD: number|null, bestHL: number|null}>({repo: null, bestFD: null, bestHL: null});
  const tooltipRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
          <span className="hidden lg:block text-xs text-[#64748B] font-normal">Your Money Friend</span>
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
              Live Rates
            </Link>
            {tooltipOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 w-52 bg-slate-900 dark:bg-[#131f2e] border border-slate-700 dark:border-[#1e2d40] rounded-xl shadow-xl p-3 text-sm"
                onMouseEnter={() => { if (tooltipRef.current) clearTimeout(tooltipRef.current); setTooltipOpen(true); }}
                onMouseLeave={() => { tooltipRef.current = setTimeout(() => setTooltipOpen(false), 200); }}
              >
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 dark:bg-[#131f2e] border-l border-t border-slate-700 dark:border-[#1e2d40] rotate-45" />
                {ratesData.repo !== null ? (
                  <div className="space-y-1.5 text-slate-200">
                    <div className="flex justify-between"><span className="text-slate-400">Repo Rate</span><span className="font-semibold text-green-400">{ratesData.repo}%</span></div>
                    {ratesData.bestFD !== null && <div className="flex justify-between"><span className="text-slate-400">Best FD</span><span className="font-semibold text-amber-400">Up to {ratesData.bestFD}%</span></div>}
                    {ratesData.bestHL !== null && <div className="flex justify-between"><span className="text-slate-400">Best Home Loan</span><span className="font-semibold text-teal-400">From {ratesData.bestHL}%</span></div>}
                    <Link href="/rates" className="block text-center text-xs text-teal-400 hover:text-teal-300 pt-1 border-t border-slate-700 mt-2">See all rates →</Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {[1,2,3].map(i => <div key={i} className="h-4 bg-slate-700 rounded animate-pulse" />)}
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
              More <ChevronDown size={14} />
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

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:bg-gray-100 dark:hover:bg-[#1E293B] transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
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
            Live Rates
          </Link>
        </div>
      )}
    </header>
  );
}
