"use client";
import { useState } from "react";

const RATE_TYPES = ["home_loan", "fd_1yr", "personal_loan"];
const BANK_TYPES = ["public", "private", "nbfc", "small_finance"];

export default function AdminRatesPage() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  // RBI form
  const [rbi, setRbi] = useState({ repo_rate: "6.50", reverse_repo_rate: "3.35", crr: "4.00", slr: "18.00", bank_rate: "6.75", effective_date: "" });

  // Bank rate form
  const [bank, setBank] = useState({
    bank_name: "", bank_short_name: "", bank_type: "public", rate_type: "home_loan",
    min_rate: "", max_rate: "", senior_citizen_extra: "0.50", bank_url: "", effective_date: "",
  });

  async function post(action: string, data: unknown) {
    setBusy(true);
    setStatus("");
    try {
      const res = await fetch("/api/admin/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify({ action, data }),
      });
      const json = await res.json();
      if (res.ok && json.success) setStatus("✅ Saved successfully");
      else setStatus(`❌ ${json.error ?? "Failed"}`);
    } catch {
      setStatus("❌ Network error");
    } finally {
      setBusy(false);
    }
  }

  const input = "w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0D9488]";
  const label = "text-xs font-medium text-[#64748B] mb-1 block";

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E2E8F0]">
        <label className={label}>Admin Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={input} placeholder="Enter admin password" />
      </div>

      {/* RBI rates */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E2E8F0]">
        <h2 className="font-bold text-[#0F172A] mb-3">RBI Policy Rates</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {(["repo_rate", "reverse_repo_rate", "crr", "slr", "bank_rate"] as const).map((k) => (
            <div key={k}>
              <label className={label}>{k.replace(/_/g, " ")}</label>
              <input value={rbi[k]} onChange={(e) => setRbi({ ...rbi, [k]: e.target.value })} className={input} inputMode="decimal" />
            </div>
          ))}
          <div>
            <label className={label}>effective date</label>
            <input type="date" value={rbi.effective_date} onChange={(e) => setRbi({ ...rbi, effective_date: e.target.value })} className={input} />
          </div>
        </div>
        <button
          disabled={busy}
          onClick={() => post("upsert_rbi", {
            repo_rate: parseFloat(rbi.repo_rate), reverse_repo_rate: parseFloat(rbi.reverse_repo_rate),
            crr: parseFloat(rbi.crr), slr: parseFloat(rbi.slr), bank_rate: parseFloat(rbi.bank_rate),
            effective_date: rbi.effective_date || new Date().toISOString().slice(0, 10),
          })}
          className="mt-4 bg-[#0D9488] hover:bg-[#0F766E] disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
        >
          Save RBI Rates
        </button>
      </div>

      {/* Bank rate */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E2E8F0]">
        <h2 className="font-bold text-[#0F172A] mb-3">Add / Update Bank Rate</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={label}>Bank name</label><input value={bank.bank_name} onChange={(e) => setBank({ ...bank, bank_name: e.target.value })} className={input} /></div>
          <div><label className={label}>Short name</label><input value={bank.bank_short_name} onChange={(e) => setBank({ ...bank, bank_short_name: e.target.value })} className={input} /></div>
          <div>
            <label className={label}>Bank type</label>
            <select value={bank.bank_type} onChange={(e) => setBank({ ...bank, bank_type: e.target.value })} className={input}>
              {BANK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Rate type</label>
            <select value={bank.rate_type} onChange={(e) => setBank({ ...bank, rate_type: e.target.value })} className={input}>
              {RATE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div><label className={label}>Min rate</label><input value={bank.min_rate} onChange={(e) => setBank({ ...bank, min_rate: e.target.value })} className={input} inputMode="decimal" /></div>
          <div><label className={label}>Max rate</label><input value={bank.max_rate} onChange={(e) => setBank({ ...bank, max_rate: e.target.value })} className={input} inputMode="decimal" /></div>
          <div><label className={label}>Senior extra</label><input value={bank.senior_citizen_extra} onChange={(e) => setBank({ ...bank, senior_citizen_extra: e.target.value })} className={input} inputMode="decimal" /></div>
          <div><label className={label}>Bank URL</label><input value={bank.bank_url} onChange={(e) => setBank({ ...bank, bank_url: e.target.value })} className={input} /></div>
          <div><label className={label}>Effective date</label><input type="date" value={bank.effective_date} onChange={(e) => setBank({ ...bank, effective_date: e.target.value })} className={input} /></div>
        </div>
        <button
          disabled={busy}
          onClick={() => post("upsert_bank_rate", {
            bank_name: bank.bank_name, bank_short_name: bank.bank_short_name, bank_type: bank.bank_type,
            rate_type: bank.rate_type, min_rate: parseFloat(bank.min_rate), max_rate: parseFloat(bank.max_rate),
            senior_citizen_extra: parseFloat(bank.senior_citizen_extra), bank_url: bank.bank_url || null,
            effective_date: bank.effective_date || new Date().toISOString().slice(0, 10),
          })}
          className="mt-4 bg-[#0D9488] hover:bg-[#0F766E] disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
        >
          Save Bank Rate
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          disabled={busy}
          onClick={() => post("mark_updated", { notes: "Manual admin update" })}
          className="bg-[#F1F5F9] hover:bg-[var(--bg-hover)] text-[#0F172A] text-sm font-semibold px-5 py-2.5 rounded-xl"
        >
          Mark rates as updated now
        </button>
        {status && <span className="text-sm">{status}</span>}
      </div>
    </div>
  );
}
