import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#2563eb", "#f97316", "#10b981", "#9333ea", "#f43f5e", "#14b8a6", "#fbbf24"];

const ExpenseChart = ({ summary }) => {
  const data = Object.entries(summary?.category_totals || {}).map(([name, value]) => ({
    name,
    value,
  }));

  if (!data.length) {
    return (
      <div className="card">
        <p>No expenses yet. Start by adding your first transaction.</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ height: 360 }}>
      <h3 style={{ marginTop: 0 }}>Category Distribution</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={120} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `€${value.toFixed(2)}`} />
          <Legend layout="vertical" align="right" verticalAlign="middle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;

