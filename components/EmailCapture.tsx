"use client";
import { useState, useEffect } from "react";
import { track } from "@/lib/analytics";
import { useTranslation } from "@/components/i18n/LanguageProvider";

interface EmailCaptureProps {
  sourcePage?: string;
}

export default function EmailCapture({ sourcePage = 'unknown' }: EmailCaptureProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Hydration-safe: read localStorage only after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (localStorage.getItem("mm_email_captured")) setDone(true);
  }, []);

  if (!mounted) return null;
  if (done) return (
    <div className="flex items-center gap-2 text-sm text-[#10B981] py-2">
      <span>✅</span>
      <span>{t("emailCapture.success")}</span>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source_page: sourcePage }),
      });
      if (res.ok || res.status === 409) {
        localStorage.setItem("mm_email_captured", email);
        track('email-subscribed', { source_page: sourcePage });
        setDone(true);
      } else {
        setError(t("emailCapture.error"));
      }
    } catch {
      setError(t("emailCapture.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-[var(--border-default)]">
      <p className="text-sm text-[var(--text-secondary)] mb-2">{t("emailCapture.subtitle")}</p>
      <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("emailCapture.placeholder")}
          required
          className="flex-1 min-w-0 border border-[var(--border-default)] bg-[var(--bg-base)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#0D9488] hover:bg-[#0F766E] disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap"
        >
          {loading ? t("emailCapture.buttonLoading") : t("emailCapture.button")}
        </button>
      </form>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
