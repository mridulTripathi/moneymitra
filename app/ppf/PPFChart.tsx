"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatINR } from "@/lib/utils";

interface DataPoint { year: number; invested: number; interest: number }
interface Props { data: DataPoint[] }

export default function PPFChart({ data }: Props) {
  return (
    <div role="img" aria-label="Stacked bar chart showing cumulative PPF investment and interest by year">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barSize={Math.max(6, 28 - data.length)}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="year" tick={{ fontSize: 11 }} label={{ value: "Year", position: "insideBottom", offset: -2 }} />
          <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v, n) => [formatINR(Math.round(Number(v))), n === "invested" ? "Invested" : "Interest"]} labelFormatter={(l) => `Year ${l}`} />
          <Legend formatter={(v) => (v === "invested" ? "Cumulative Invested" : "Cumulative Interest")} />
          <Bar dataKey="invested" stackId="a" fill="#0D9488" />
          <Bar dataKey="interest" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
