"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatINR } from "@/lib/utils";

interface DataPoint { year: number; invested: number; gains: number }
interface Props { data: DataPoint[]; years: number }

export default function SIPChart({ data, years }: Props) {
  return (
    <div
      role="img"
      aria-label="Bar chart showing invested amount and returns growing over the investment period"
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barSize={Math.max(4, 28 - years)}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="year" label={{ value: "Year", position: "insideBottom", offset: -2 }} tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(v, name) => [formatINR(Math.round(Number(v))), String(name) === "invested" ? "Invested" : "Returns"]}
            labelFormatter={(l) => `Year ${l}`}
          />
          <Legend formatter={(v) => v === "invested" ? "Amount Invested" : "Returns"} />
          <Bar dataKey="invested" stackId="a" fill="#0D9488" />
          <Bar dataKey="gains" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
