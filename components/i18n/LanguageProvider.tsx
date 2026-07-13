"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { LANGUAGES } from "@/lib/i18n/languages";
import { en, TranslationDict } from "@/lib/i18n/translations/en";
import { hi } from "@/lib/i18n/translations/hi";
import { bn } from "@/lib/i18n/translations/bn";
import { mr } from "@/lib/i18n/translations/mr";
import { te } from "@/lib/i18n/translations/te";
import { ta } from "@/lib/i18n/translations/ta";
import { gu } from "@/lib/i18n/translations/gu";
import { kn } from "@/lib/i18n/translations/kn";
import { ml } from "@/lib/i18n/translations/ml";
import { pa } from "@/lib/i18n/translations/pa";
import { or } from "@/lib/i18n/translations/or";
import { as } from "@/lib/i18n/translations/as";
import { ur } from "@/lib/i18n/translations/ur";
import { track } from "@/lib/analytics";

// Map of locale -> translation dictionary. Every locale falls back to `en`
// for any key it's missing (see resolvePath usage in t() below), so a
// partially-translated dictionary never breaks — it just shows English for
// the untranslated bits.
const translations: Record<string, TranslationDict> = {
  en, hi, bn, mr, te, ta, gu, kn, ml, pa, or, as, ur,
};

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function resolvePath(dict: unknown, path: string[]): unknown {
  let current: unknown = dict;
  for (const key of path) {
    if (current && typeof current === "object" && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return current;
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return Object.prototype.hasOwnProperty.call(params, key) ? String(params[key]) : match;
  });
}

interface LanguageContextValue {
  t: (key: string, params?: Record<string, string | number>) => string;
  locale: string;
  setLocale: (code: string) => void;
  languages: typeof LANGUAGES;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState("en");

  useEffect(() => {
    // SSR always renders English first; swap client-side after mount to
    // avoid hydration mismatches (same pattern as ThemeProvider/next-themes).
    const stored = localStorage.getItem("mm_locale");
    const fromCookie = getCookie("mm_locale");
    const initial = stored || fromCookie;
    if (initial) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocaleState(initial);
      document.documentElement.lang = initial;
      document.documentElement.dir = initial === "ur" ? "rtl" : "ltr";
    }
  }, []);

  const setLocale = useCallback((code: string) => {
    setLocaleState((previousLocale) => {
      localStorage.setItem("mm_locale", code);
      document.cookie = `mm_locale=${code}; path=/; max-age=31536000`;
      document.documentElement.lang = code;
      document.documentElement.dir = code === "ur" ? "rtl" : "ltr";
      track("language-changed", { from: previousLocale, to: code });
      return code;
    });
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const path = key.split(".");
      // Lookups always resolve to `en`'s value regardless of `locale` state —
      // intentional for now, since only the `en` dictionary exists.
      // Structured this way so adding more locales later is trivial.
      const dict = translations[locale] ?? translations.en;
      let value = resolvePath(dict, path);
      if (value === undefined) {
        value = resolvePath(translations.en, path);
      }
      if (typeof value !== "string") {
        if (process.env.NODE_ENV === "development") {
          console.warn(`[i18n] Missing translation key: "${key}"`);
        }
        return key;
      }
      return interpolate(value, params);
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ t, locale, setLocale, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return ctx;
}
