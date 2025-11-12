// ...existing code...
import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF"];

// aggregate by payment mode instead of category
function aggregateByPaymentMode(expenses = []) {
  const map = {};
  expenses.forEach((exp) => {
    const mode = exp.paymentMethod || exp.payment || exp.mode || "Unknown";
    const amt = Number(exp.amount) || 0;
    map[mode] = (map[mode] || 0) + amt;
  });
  return Object.keys(map).map((k) => ({ name: k, value: map[k] }));
}

export default function ExpensesChart({ expenses = [] }) {
  const data = useMemo(() => aggregateByPaymentMode(expenses), [expenses]);

  if (!data || data.length === 0) {
    return <p>No expenses to show</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={60}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => (typeof v === "number" ? v.toFixed(2) : v)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
// ...existing code...