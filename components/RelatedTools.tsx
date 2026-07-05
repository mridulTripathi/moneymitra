"use client";
import { usePathname } from "next/navigation";
import { pageRecommendations } from "@/lib/page-recommendations";
import { track } from "@/lib/analytics";

export default function RelatedTools() {
  const pathname = usePathname();
  const recommendations = pageRecommendations[pathname];

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <section className="my-8">
      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
        You might also find useful
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {recommendations.map((rec) => (
          <a
            key={rec.path}
            href={rec.path}
            onClick={() => track('related-tool-clicked', { from: pathname, to: rec.path })}
            className="block bg-white dark:bg-[#131f2e] border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-teal-400 dark:hover:border-teal-600 hover:shadow-md transition-all group"
          >
            <p className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 flex items-center justify-between">
              {rec.label}
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {rec.reason}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
