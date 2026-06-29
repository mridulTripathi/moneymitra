"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { formatINR } from "@/lib/utils";

interface Props {
  oldTax: number;
  newTax: number;
}

export default function TaxChart({ oldTax, newTax }: Props) {
  const data = [
    { name: "Old Regime", tax: Math.round(oldTax) },
    { name: "New Regime", tax: Math.round(newTax) },
  ];

  return (
    <div
      role="img"
      aria-label={`Bar chart comparing old regime tax ₹${Math.round(oldTax)} vs new regime tax ₹${Math.round(newTax)}`}
    >
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical" barSize={40}>
          <XAxis type="number" tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 13, fontWeight: 600 }} width={90} />
          <Tooltip formatter={(v) => formatINR(Math.round(Number(v)))} />
          <Bar dataKey="tax" radius={[0, 6, 6, 0]} animationBegin={0} animationDuration={500} isAnimationActive={true}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.name === "New Regime" ? "#0D9488" : "#7C3AED"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
