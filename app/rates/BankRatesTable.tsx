"use client";
import { useState, useMemo } from "react";
import type { BankRate } from "./page";
import { track } from "@/lib/analytics";
import { useTranslation } from "@/components/i18n/LanguageProvider";

const RD_MIN_DEPOSIT: Record<string, string> = {
  SBI: '₹100',
  HDFC: '₹1,000',
  ICICI: '₹500',
  Axis: '₹500',
  Kotak: '₹500',
};

function getRDMinDeposit(bankShortName: string): string {
  return RD_MIN_DEPOSIT[bankShortName] ?? '₹500';
}

interface Props {
  rates: BankRate[];
  showSenior: boolean;
  isFD: boolean;
  isRD?: boolean;
}

type SortKey = "bank" | "min" | "max";

export default function BankRatesTable({ rates, showSenior, isFD, isRD }: Props) {
  const { t } = useTranslation();
  const [sortKey, setSortKey] = useState<SortKey>("min");
  const [asc, setAsc] = useState(true);

  const sorted = useMemo(() => {
    const copy = [...rates];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "bank") cmp = a.bank_name.localeCompare(b.bank_name);
      else if (sortKey === "min") cmp = a.min_rate - b.min_rate;
      else cmp = a.max_rate - b.max_rate;
      return asc ? cmp : -cmp;
    });
    return copy;
  }, [rates, sortKey, asc]);

  const toggle = (k: SortKey) => {
    if (sortKey === k) setAsc(!asc);
    else { setSortKey(k); setAsc(true); }
  };

  const arrow = (k: SortKey) => (sortKey === k ? (asc ? " ▲" : " ▼") : "");

  // Best-rate detection: for loans, lower is better; for FD/RD, higher is better.
  // Computed on the full `rates` set so it stays correct regardless of table sort order.
  const { overallBestId, bestByType } = useMemo(() => {
    if (rates.length === 0) return { overallBestId: null as string | null, bestByType: new Map<string, string>() };
    const better = (a: number, b: number) => (isFD ? a > b : a < b);

    let overall = rates[0];
    for (const r of rates) if (better(Number(r.min_rate), Number(overall.min_rate))) overall = r;

    const byType = new Map<string, BankRate>();
    for (const r of rates) {
      const current = byType.get(r.bank_type);
      if (!current || better(Number(r.min_rate), Number(current.min_rate))) byType.set(r.bank_type, r);
    }
    const bestByType = new Map<string, string>();
    byType.forEach((r, type) => bestByType.set(type, r.id));

    return { overallBestId: overall.id, bestByType };
  }, [rates, isFD]);

  const typeLabels: Record<string, string> = {
    public: t("rates.typePublic"), private: t("rates.typePrivate"), small_finance: t("rates.typeSmallFinance"), nbfc: t("rates.typeNbfc"),
  };

  if (rates.length === 0) {
    return <p className="text-sm text-[var(--text-tertiary)] py-8 text-center">{t("rates.emptyState")}</p>;
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-sm min-w-[480px]">
        <thead>
          <tr className="border-b-2 border-[var(--border-default)]">
            <th className="text-left py-2.5 pr-4 text-[var(--text-secondary)] font-semibold cursor-pointer" onClick={() => toggle("bank")} scope="col">{t("rates.tableBank")}{arrow("bank")}</th>
            <th className="text-left py-2.5 pr-4 text-[var(--text-secondary)] font-semibold" scope="col">{t("rates.tableType")}</th>
            <th className="text-right py-2.5 pr-4 text-[var(--text-secondary)] font-semibold cursor-pointer" onClick={() => toggle("min")} scope="col">{isFD ? (isRD ? t("rates.tableRdRate") : t("rates.tableRate")) : t("rates.tableMin")}{arrow("min")}</th>
            {!isFD && <th className="text-right py-2.5 pr-4 text-[var(--text-secondary)] font-semibold cursor-pointer" onClick={() => toggle("max")} scope="col">{t("rates.tableMax")}{arrow("max")}</th>}
            {isFD && showSenior && <th className="text-right py-2.5 pr-4 text-[var(--text-secondary)] font-semibold" scope="col">{t("rates.tableSeniorRate")}</th>}
            {isRD && <th className="text-right py-2.5 text-[var(--text-secondary)] font-semibold" scope="col">{t("rates.tableMinMonthlyDeposit")}</th>}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => {
            const isOverallBest = r.id === overallBestId;
            const isTypeBest = bestByType.get(r.bank_type) === r.id && !isOverallBest;
            return (
            <tr key={r.id} className={`border-b border-[var(--border-subtle)] hover:bg-[var(--bg-base)] transition-colors ${isOverallBest ? "bg-[#0D9488]/5 dark:bg-[#14B8A6]/10" : ""}`}>
              <td className="py-2.5 pr-4 font-medium text-[var(--text-primary)]">
                <div className="flex items-center gap-2 flex-wrap">
                  {r.bank_url ? (
                    <a href={r.bank_url} target="_blank" rel="noopener noreferrer nofollow" className="hover:text-[#0D9488] dark:text-[#14B8A6]" onClick={() => track('bank-link-clicked', { bank: r.bank_short_name, rate_type: r.rate_type })}>{r.bank_name}</a>
                  ) : r.bank_name}
                  {isOverallBest && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#0D9488] text-white whitespace-nowrap">
                      {t("rates.bestRateBadge")}
                    </span>
                  )}
                  {isTypeBest && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 whitespace-nowrap">
                      {t("rates.bestInTypeBadge", { type: typeLabels[r.bank_type] ?? r.bank_type })}
                    </span>
                  )}
                </div>
              </td>
              <td className="py-2.5 pr-4 text-[var(--text-secondary)] capitalize">{r.bank_type.replace("_", " ")}</td>
              <td className="py-2.5 pr-4 text-right text-[#0D9488] dark:text-[#14B8A6] tabular-nums font-semibold">{Number(r.min_rate).toFixed(2)}%</td>
              {!isFD && <td className="py-2.5 pr-4 text-right text-[var(--text-primary)] tabular-nums">{Number(r.max_rate).toFixed(2)}%</td>}
              {isFD && showSenior && (
                <td className="py-2.5 pr-4 text-right text-[#F59E0B] tabular-nums font-semibold">
                  {(Number(r.min_rate) + Number(r.senior_citizen_extra)).toFixed(2)}%
                </td>
              )}
              {isRD && (
                <td className="py-2.5 text-right text-[var(--text-secondary)] tabular-nums">
                  {getRDMinDeposit(r.bank_short_name)}
                </td>
              )}
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
