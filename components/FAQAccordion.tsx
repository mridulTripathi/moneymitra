export interface FAQItem {
  q: string;
  a: string;
}

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  return (
    <section className="mt-10" aria-label="Frequently asked questions">
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">Common Questions</h2>
      <p className="text-sm text-[var(--text-secondary)] mb-5">
        Answers to what people ask Google and financial advisors — with real numbers.
      </p>
      <div className="flex flex-col divide-y divide-[var(--border-default)] border border-[var(--border-default)] rounded-2xl overflow-hidden bg-[var(--bg-card)] shadow-sm">
        {items.map((item, i) => (
          <details key={i} className="group">
            <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none hover:bg-[var(--bg-hover)] transition-colors">
              <span className="font-semibold text-[var(--text-primary)] text-sm sm:text-base leading-snug pr-2">
                {item.q}
              </span>
              <span className="flex-shrink-0 text-[#0D9488] dark:text-[#14B8A6] text-lg transition-transform group-open:rotate-45 select-none">
                +
              </span>
            </summary>
            <div className="px-5 pb-5 pt-1">
              <p className="text-sm sm:text-base text-[#374151] dark:text-[#CBD5E1] leading-relaxed">{item.a}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
