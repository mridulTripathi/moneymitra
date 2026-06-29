import { ReactNode } from "react";

export function TipCard({ icon = "💡", children }: { icon?: string; children: ReactNode }) {
  return (
    <div className="bg-[#F0FDFA] border border-[#0D9488]/20 rounded-xl p-4 text-sm text-[#374151]">
      <div className="flex gap-2">
        <span aria-hidden="true">{icon}</span>
        <div>{children}</div>
      </div>
    </div>
  );
}

export function TipsDisclaimer() {
  return (
    <p className="text-xs text-[var(--text-tertiary)] mt-1">
      These tips are general information based on your inputs, not personalised financial advice.
    </p>
  );
}
