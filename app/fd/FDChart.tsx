"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatINR } from "@/lib/utils";

interface DataPoint { year: number; value: number }
interface Props { data: DataPoint[] }

export default function FDChart({ data }: Props) {
  return (
    <div role="img" aria-label="Line chart showing deposit value growing over time">
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="year" tick={{ fontSize: 11 }} label={{ value: "Year", position: "insideBottom", offset: -2 }} />
          <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => formatINR(Math.round(Number(v)))} labelFormatter={(l) => `Year ${l}`} />
          <Line type="monotone" dataKey="value" stroke="#0D9488" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
