"use client";
import { useState, useEffect } from "react";

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  format?: (v: number) => string;
  hint?: string;
  rangeHint?: string; // e.g. "Min ₹1L · Max ₹5Cr"
}

function parseShorthand(raw: string): number | null {
  const s = raw.trim().toLowerCase().replace(/,/g, '');
  const crMatch = s.match(/^([\d.]+)\s*cr$/);
  if (crMatch) return parseFloat(crMatch[1]) * 1_00_00_000;
  const lMatch = s.match(/^([\d.]+)\s*l$/);
  if (lMatch) return parseFloat(lMatch[1]) * 1_00_000;
  const kMatch = s.match(/^([\d.]+)\s*k$/);
  if (kMatch) return parseFloat(kMatch[1]) * 1_000;
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

export default function SliderInput({
  label, value, min, max, step = 1, onChange,
  prefix, suffix, format, hint, rangeHint,
}: SliderInputProps) {
  const [inputStr, setInputStr] = useState(format ? format(value) : String(value));

  useEffect(() => {
    // Keep the editable text in sync when the value changes from outside
    // (slider drag, shared-link params, parent reset).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInputStr(format ? format(value) : String(value));
  }, [value, format]);

  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  const handleInputChange = (raw: string) => {
    setInputStr(raw);
    const n = parseShorthand(raw);
    if (n !== null) onChange(n); // update live, no clamping yet
  };

  const handleBlur = () => {
    const n = parseShorthand(inputStr);
    const clamped = n !== null ? Math.min(max, Math.max(min, n)) : value;
    onChange(clamped);
    setInputStr(format ? format(clamped) : String(clamped));
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
        <div>
          <label className="text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9] leading-tight">{label}</label>
          {hint && <p className="text-xs text-[#94A3B8] mt-0.5">{hint}</p>}
        </div>
        <div className="flex items-center gap-1 bg-[#F1F5F9] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] rounded-xl px-3 py-2 min-w-[130px] max-w-[160px]">
          {prefix && <span className="text-[#64748B] dark:text-[#94A3B8] text-sm flex-shrink-0">{prefix}</span>}
          <input
            type="text"
            value={inputStr}
            onChange={e => handleInputChange(e.target.value)}
            onBlur={handleBlur}
            className="bg-transparent text-right text-sm font-bold text-[#0F172A] dark:text-[#F1F5F9] w-full outline-none tabular-nums min-w-0"
            inputMode="numeric"
          />
          {suffix && <span className="text-[#64748B] dark:text-[#94A3B8] text-sm ml-1 flex-shrink-0">{suffix}</span>}
        </div>
      </div>
      <div className="relative py-1">
        <div
          className="absolute top-1/2 left-0 h-1.5 rounded-l-full bg-[#0D9488] pointer-events-none -translate-y-1/2"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={Math.min(max, Math.max(min, value))}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full relative z-10"
          style={{ background: "transparent" }}
        />
      </div>
      <div className="flex justify-between text-xs text-[#94A3B8] mt-0.5">
        {rangeHint ? (
          <span className="text-slate-400">{rangeHint}</span>
        ) : (
          <>
            <span>{prefix}{format ? format(min) : min}{suffix}</span>
            <span>{prefix}{format ? format(max) : max}{suffix}</span>
          </>
        )}
      </div>
    </div>
  );
}
