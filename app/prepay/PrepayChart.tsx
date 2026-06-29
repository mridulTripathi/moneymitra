"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatINR } from "@/lib/utils";

interface DataPoint { month: number; without: number; with: number }
interface Props { data: DataPoint[] }

export default function PrepayChart({ data }: Props) {
  return (
    <div
      role="img"
      aria-label="Line chart comparing outstanding loan balance with and without prepayment over time"
    >
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="month" label={{ value: "Months", position: "insideBottom", offset: -2 }} tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => formatINR(Math.round(Number(v)))} labelFormatter={(l) => `Month ${l}`} />
          <Legend />
          <Line type="monotone" dataKey="without" stroke="#F59E0B" name="Without Prepayment" dot={false} strokeWidth={2} animationBegin={0} animationDuration={500} isAnimationActive={true} />
          <Line type="monotone" dataKey="with" stroke="#0D9488" name="With Prepayment" dot={false} strokeWidth={2} animationBegin={0} animationDuration={500} isAnimationActive={true} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
