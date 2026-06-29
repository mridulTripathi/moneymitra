"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatINR } from "@/lib/utils";

const TEAL = "#0D9488";
const AMBER = "#F59E0B";

interface Props {
  principal: number;
  totalInterest: number;
  totalPayable: number;
}

export default function EMIChart({ principal, totalInterest, totalPayable }: Props) {
  const pieData = [
    { name: "Principal", value: Math.round(principal) },
    { name: "Interest", value: Math.round(totalInterest) },
  ];

  return (
    <div
      role="img"
      aria-label={`Pie chart showing principal ₹${Math.round(principal / 100000)}L vs interest ₹${Math.round(totalInterest / 100000)}L`}
    >
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value" animationBegin={0} animationDuration={500}>
            <Cell fill={TEAL} />
            <Cell fill={AMBER} />
          </Pie>
          <Tooltip formatter={(v) => formatINR(Math.round(Number(v)))} />
          <Legend
            formatter={(value, entry) => {
              const pct = (((entry.payload as { value: number }).value / totalPayable) * 100).toFixed(1);
              return `${value} (${pct}%)`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
