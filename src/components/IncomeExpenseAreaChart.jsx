
import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

function mergeIncomeExpense(incomes, expenses) {
  // Create a map for quick lookup
  const incomeMap = {};
  incomes.forEach(i => {
    incomeMap[i.date] = (incomeMap[i.date] || 0) + (i.amount || 0);
  });

  const expenseMap = {};
  expenses.forEach(e => {
    expenseMap[e.date] = (expenseMap[e.date] || 0) + (e.amount || 0);
  });

  // Collect all unique dates
  const allDates = Array.from(new Set([
    ...incomes.map(i => i.date),
    ...expenses.map(e => e.date),
  ])).sort();

  // Build chart data
  return allDates.map(date => ({
    date,
    income: incomeMap[date] || 0,
    expense: expenseMap[date] || 0,
  }));
}

const IncomeExpenseAreaChart = ({ incomes=[], expenses=[] }) => {
  const data = mergeIncomeExpense(incomes, expenses);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="date" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="income" stroke="#82ca9d" fillOpacity={1} fill="url(#incomeGradient)" />
        <Area type="monotone" dataKey="expense" stroke="#8884d8" fillOpacity={1} fill="url(#expenseGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default IncomeExpenseAreaChart;