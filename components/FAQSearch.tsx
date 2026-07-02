"use client";
import { useState, useEffect, useRef, Fragment } from "react";
import Fuse from "fuse.js";
import { FAQ_DATA, FAQItem } from "@/lib/faq-data";
import { track } from "@/lib/analytics";

// Lightly formats an AI answer into paragraphs / bullet / numbered lists
// and bolds **text** — purely presentational, doesn't touch the source text.
function FormattedAnswer({ text }: { text: string }) {
  const blocks = text.trim().split(/\n+/).filter(Boolean);
  const renderInline = (s: string) =>
    s.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={i} className="font-semibold text-[var(--text-primary)]">{part.slice(2, -2)}</strong>
        : <Fragment key={i}>{part}</Fragment>
    );

  const bulletRe = /^\s*[-•]\s+(.*)/;
  const numberedRe = /^\s*\d+[.)]\s+(.*)/;
  const headingRe = /^\s*#{1,3}\s+(.*)/;

  const elements: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const flushList = (key: string) => {
    if (listBuffer.length === 0) return;
    const Tag = listType === "ol" ? "ol" : "ul";
    elements.push(
      <Tag key={key} className={`${listType === "ol" ? "list-decimal" : "list-disc"} pl-5 space-y-1 my-2`}>
        {listBuffer.map((item, i) => <li key={i}>{renderInline(item)}</li>)}
      </Tag>
    );
    listBuffer = [];
    listType = null;
  };

  blocks.forEach((line, idx) => {
    const headingMatch = line.match(headingRe);
    const bulletMatch = line.match(bulletRe);
    const numberedMatch = line.match(numberedRe);
    if (headingMatch) {
      flushList(`list-${idx}`);
      elements.push(<p key={idx} className="font-semibold text-[var(--text-primary)]">{renderInline(headingMatch[1])}</p>);
    } else if (bulletMatch) {
      if (listType !== "ul") flushList(`list-${idx}`);
      listType = "ul";
      listBuffer.push(bulletMatch[1]);
    } else if (numberedMatch) {
      if (listType !== "ol") flushList(`list-${idx}`);
      listType = "ol";
      listBuffer.push(numberedMatch[1]);
    } else {
      flushList(`list-${idx}`);
      elements.push(<p key={idx} className="leading-relaxed">{renderInline(line)}</p>);
    }
  });
  flushList("list-end");

  return <div className="space-y-2 text-sm text-[#374151] dark:text-[#CBD5E1]">{elements}</div>;
}

const fuse = new Fuse(FAQ_DATA, {
  keys: [
    { name: 'question', weight: 0.6 },
    { name: 'keywords', weight: 0.3 },
    { name: 'answer', weight: 0.1 }
  ],
  threshold: 0.25,
  minMatchCharLength: 3,
  includeScore: true,
  ignoreLocation: true,
  useExtendedSearch: false,
});

function getBestMatches(query: string): FAQItem[] {
  const results = fuse.search(query);
  return results.filter(r => (r.score ?? 1) < 0.25).slice(0, 4).map(r => r.item);
}

export default function FAQSearch() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<FAQItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedResult, setSelectedResult] = useState<FAQItem | null>(null);
  const [aiAnswer, setAiAnswer] = useState<{ answer: string; source: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced Fuse search for dropdown
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSelectedResult(null);
    setAiAnswer(null);
    if (!query.trim() || query.trim().length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      const hits = getBestMatches(query);
      setSuggestions(hits);
      setShowDropdown(hits.length > 0 && focused);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSuggestionClick = (item: FAQItem) => {
    setQuery(item.question);
    setShowDropdown(false);
    setSelectedResult(item);
    setAiAnswer(null);
    track('faq-searched', { result_type: 'faq' });
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setShowDropdown(false);
    const hits = getBestMatches(query);
    if (hits.length > 0) {
      setSelectedResult(hits[0]);
      setAiAnswer(null);
      track('faq-searched', { result_type: 'faq' });
      return;
    }
    // No good match — call AI
    setSelectedResult(null);
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
      <div className="relative" ref={containerRef}>
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); }}
            onFocus={() => { setFocused(true); if (suggestions.length > 0) setShowDropdown(true); }}
            onBlur={() => setFocused(false)}
            onKeyDown={e => {
              if (e.key === "Enter") { handleSearch(); }
              if (e.key === "Escape") { setShowDropdown(false); }
            }}
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

        {showDropdown && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl shadow-lg mt-1 overflow-hidden">
            {suggestions.map(s => (
              <div
                key={s.id}
                onMouseDown={() => handleSuggestionClick(s)}
                className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-sm text-[var(--text-primary)]"
              >
                {s.question}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedResult && (
        <div className="mt-3 bg-[var(--tip-bg)] border border-[#0D9488]/20 dark:border-[#14B8A6]/20 rounded-xl p-4">
          <p className="font-semibold text-sm text-[var(--text-primary)] mb-1">{selectedResult.question}</p>
          <p className="text-sm text-[#374151] dark:text-[#CBD5E1]">{selectedResult.answer}</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-2">📚 From our FAQ · General information only, not advice</p>
        </div>
      )}

      {loading && (
        <div className="mt-3 bg-[var(--tip-bg)] border border-[#0D9488]/20 dark:border-[#14B8A6]/20 rounded-xl p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
            <span className="flex gap-1" aria-hidden="true">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] dark:bg-[#14B8A6] animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] dark:bg-[#14B8A6] animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] dark:bg-[#14B8A6] animate-bounce" />
            </span>
            🤖 Thinking through your question…
          </div>
          <div className="mt-3 space-y-2 animate-pulse">
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
          </div>
        </div>
      )}

      {aiAnswer && !selectedResult && (
        <div className="mt-3 bg-[var(--tip-bg)] border border-[#0D9488]/20 dark:border-[#14B8A6]/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#0D9488] dark:bg-[#14B8A6] text-white dark:text-[#0a0f1a]">
              ✨ AI-generated answer
            </span>
          </div>
          <FormattedAnswer text={aiAnswer.answer} />
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-3 pt-2 border-t border-[#0D9488]/10 dark:border-[#14B8A6]/10 flex items-center gap-1">
            ⚠️ For general awareness only — not financial advice. Please verify important numbers.
          </p>
        </div>
      )}
    </div>
  );
}
