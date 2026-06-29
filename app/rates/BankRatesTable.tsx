"use client";
import { useState, useMemo } from "react";
import type { BankRate } from "./page";
import { track } from "@/lib/analytics";

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

  if (rates.length === 0) {
    return <p className="text-sm text-[var(--text-tertiary)] py-8 text-center">Rates are being updated. Please check back soon.</p>;
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-sm min-w-[480px]">
        <thead>
          <tr className="border-b-2 border-[var(--border-default)]">
            <th className="text-left py-2.5 pr-4 text-[var(--text-secondary)] font-semibold cursor-pointer" onClick={() => toggle("bank")} scope="col">Bank{arrow("bank")}</th>
            <th className="text-left py-2.5 pr-4 text-[var(--text-secondary)] font-semibold" scope="col">Type</th>
            <th className="text-right py-2.5 pr-4 text-[var(--text-secondary)] font-semibold cursor-pointer" onClick={() => toggle("min")} scope="col">{isFD ? (isRD ? "1yr RD Rate" : "Rate") : "Min"}{arrow("min")}</th>
            {!isFD && <th className="text-right py-2.5 pr-4 text-[var(--text-secondary)] font-semibold cursor-pointer" onClick={() => toggle("max")} scope="col">Max{arrow("max")}</th>}
            {isFD && showSenior && <th className="text-right py-2.5 pr-4 text-[var(--text-secondary)] font-semibold" scope="col">Senior Rate</th>}
            {isRD && <th className="text-right py-2.5 text-[var(--text-secondary)] font-semibold" scope="col">Min Monthly Deposit</th>}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.id} className="border-b border-[#F1F5F9] hover:bg-[var(--bg-base)] transition-colors">
              <td className="py-2.5 pr-4 font-medium text-[var(--text-primary)]">
                {r.bank_url ? (
                  <a href={r.bank_url} target="_blank" rel="noopener noreferrer nofollow" className="hover:text-[#0D9488] dark:text-[#14B8A6]" onClick={() => track('bank-link-clicked', { bank: r.bank_short_name, rate_type: r.rate_type })}>{r.bank_name}</a>
                ) : r.bank_name}
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
