"use client";
import { useState, useEffect, useRef } from "react";
import Fuse from "fuse.js";
import { FAQ_DATA, FAQItem } from "@/lib/faq-data";
import { track } from "@/lib/analytics";

const fuse = new Fuse(FAQ_DATA, {
  keys: ["question", "keywords", "answer"],
  threshold: 0.4,
  includeScore: true,
});

export default function FAQSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FAQItem[]>([]);
  const [aiAnswer, setAiAnswer] = useState<{ answer: string; source: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    // Clearing results when the query is emptied is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!query.trim()) { setResults([]); setAiAnswer(null); return; }
    debounceRef.current = setTimeout(() => {
      const hits = fuse.search(query).slice(0, 3).map(r => r.item);
      setResults(hits);
      if (hits.length > 0) track('faq-searched', { result_type: 'faq' });
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  const handleSearch = async () => {
    if (!query.trim() || results.length > 0) return;
    setLoading(true);
    setAiAnswer(null);
    try {
      const res = await fetch("/api/faq-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.answer) { setAiAnswer(data); track('faq-searched', { result_type: 'ai' }); }
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
          placeholder="Ask anything — 'EMI for 50 lakh loan' or 'PPF vs FD'"
          className="flex-1 border border-[var(--border-default)] bg-[var(--bg-card)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-[#0D9488] hover:bg-[#0F766E] text-white text-sm font-semibold px-5 py-3 rounded-xl transition-colors whitespace-nowrap disabled:opacity-60"
        >
          {loading ? "..." : "Search"}
        </button>
      </div>

      {results.length > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          {results.map(r => (
            <div key={r.id} className="bg-[var(--tip-bg)] border border-[#0D9488]/20 dark:border-[#14B8A6]/20 rounded-xl p-4">
              <p className="font-semibold text-sm text-[var(--text-primary)] mb-1">{r.question}</p>
              <p className="text-sm text-[#374151] dark:text-[#CBD5E1]">{r.answer}</p>
              <p className="text-xs text-[var(--text-tertiary)] mt-2">📚 From our FAQ · General information only, not advice</p>
            </div>
          ))}
        </div>
      )}

      {aiAnswer && !results.length && (
        <div className="mt-3 bg-[var(--tip-bg)] border border-[#0D9488]/20 dark:border-[#14B8A6]/20 rounded-xl p-4">
          <p className="text-sm text-[#374151] dark:text-[#CBD5E1]">{aiAnswer.answer}</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-2">🤖 AI Answer · General information only, not advice</p>
        </div>
      )}
    </div>
  );
}
