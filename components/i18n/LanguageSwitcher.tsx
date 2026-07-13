"use client";
import { useState, useEffect, useRef } from "react";
import { Globe } from "lucide-react";
import { useTranslation } from "./LanguageProvider";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export default function LanguageSwitcher({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const { locale, setLocale, languages } = useTranslation();
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [suggestedLocale, setSuggestedLocale] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const suggested = getCookie("mm_suggested_locale");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (suggested) setSuggestedLocale(suggested);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setShowAll(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);


  const english = languages.find((l) => l.code === "en")!;
  const defaultStateLocale = suggestedLocale && suggestedLocale !== "en" ? suggestedLocale : "hi";
  const stateLanguage = languages.find((l) => l.code === defaultStateLocale) ?? languages.find((l) => l.code === "hi") ?? languages[0];

  const targetLanguage = locale === "en" ? stateLanguage : english;

  const handleSelect = (code: string) => {
    setLocale(code);
    setOpen(false);
    setShowAll(false);
  };

  return (
    <div className={`relative ${variant === "mobile" ? "w-full" : ""}`} ref={containerRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={
          variant === "mobile"
            ? "w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl text-base font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors"
            : "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors"
        }
        aria-expanded={open}
        aria-label="Change language"
      >
        <span className="flex items-center gap-1.5">
          <Globe size={16} />
          {targetLanguage.nativeName}
        </span>
      </button>

      {open && (
        <div
          className={
            variant === "mobile"
              ? "mt-1 bg-[var(--bg-elevated)] rounded-xl py-1"
              : "absolute right-0 top-full mt-1 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl shadow-lg py-1 min-w-[200px] max-h-[60vh] overflow-y-auto z-50"
          }
        >
          <div className="px-4 py-2.5">
            <button
              onClick={() => handleSelect(targetLanguage.code)}
              className="block w-full text-left text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              {targetLanguage.nativeName}
            </button>
            {locale === "en" && suggestedLocale && suggestedLocale === targetLanguage.code && (
              <p className="text-xs text-[var(--text-tertiary)] mt-0.5">Suggested for your region</p>
            )}
          </div>

          {!showAll ? (
            <button
              onClick={() => setShowAll(true)}
              className="block w-full text-left px-4 py-2.5 text-sm font-medium text-[#0D9488] dark:text-[#14B8A6] hover:bg-[var(--bg-elevated)] transition-colors"
            >
              Show all languages ▾
            </button>
          ) : (
            <div className="max-h-[50vh] overflow-y-auto border-t border-[var(--border-default)] pt-1">
              {languages
                .filter((l) => l.code !== targetLanguage.code)
                .map((l) => (
                  <button
                    key={l.code}
                    onClick={() => handleSelect(l.code)}
                    className={`block w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                      locale === l.code
                        ? "bg-[#0D9488]/10 text-[#0D9488] dark:text-[#14B8A6]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                    }`}
                  >
                    {l.nativeName}
                  </button>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
