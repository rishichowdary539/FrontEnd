import React from "react";

const StatCards = ({ summary }) => {
  const cards = [
    {
      label: "Monthly Total",
      value: summary?.monthly_total ? `€${summary.monthly_total.toFixed(2)}` : "€0.00",
    },
    {
      label: "Categories Tracked",
      value: summary?.insights?.length ?? 0,
    },
    {
      label: "Overspending Categories",
      value: Object.keys(summary?.overspending_categories || {}).length,
      highlight: "danger",
    },
    {
      label: "Suggested Budgets",
      value: Object.keys(summary?.suggested_budgets || {}).length,
    },
  ];

  return (
    <section style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
      {cards.map((card) => (
        <div key={card.label} className="card">
          <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--muted)" }}>{card.label}</p>
          <h3 style={{ margin: "0.5rem 0 0", color: card.highlight === "danger" ? "var(--danger)" : "var(--text)" }}>
            {card.value}
          </h3>
        </div>
      ))}
    </section>
  );
};

export default StatCards;

