"use client";
import { useState, useEffect } from "react";
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
      className="w-10 h-10 flex items-center justify-center rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:bg-gray-100 dark:hover:bg-[#1E293B] transition-all"
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

  const linkClass = (href: string) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
      pathname === href
        ? "bg-[#0D9488]/10 text-[#0D9488] dark:text-[#14B8A6]"
        : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] hover:bg-gray-100 dark:hover:bg-[#334155]"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#1E293B] border-b border-[#E2E8F0] dark:border-[#334155] shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0" onClick={() => setOpen(false)}>
          <span className="text-xl font-bold text-[#0D9488] tracking-tight group-hover:text-[#0F766E] transition-colors">
            MoneyMitra
          </span>
          <span className="hidden lg:block text-xs text-[#64748B] font-normal">Your Money Friend</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {primaryLinks.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>{l.label}</Link>
          ))}
          <div className="relative" onMouseLeave={() => setMoreOpen(false)}>
            <button
              onClick={() => setMoreOpen((v) => !v)}
              onMouseEnter={() => setMoreOpen(true)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-gray-100 flex items-center gap-1 transition-colors"
              aria-expanded={moreOpen}
            >
              More <ChevronDown size={14} />
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl shadow-lg py-1 min-w-[160px]">
                {moreLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMoreOpen(false)}
                    className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                      pathname === l.href ? "bg-[#0D9488]/10 text-[#0D9488] dark:text-[#14B8A6]" : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] hover:bg-gray-50 dark:hover:bg-[#334155]"
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
          className="md:hidden p-2 rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:bg-gray-100 dark:hover:bg-[#1E293B] transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] px-4 py-2 flex flex-col gap-1 max-h-[70vh] overflow-y-auto">
          {allLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                pathname === l.href ? "bg-[#0D9488]/10 text-[#0D9488] dark:text-[#14B8A6]" : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] hover:bg-gray-50 dark:hover:bg-[#334155]"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
