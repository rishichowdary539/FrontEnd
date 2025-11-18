import React, { useEffect, useState } from "react";
import { format, subMonths } from "date-fns";
import NavBar from "../components/NavBar";
import StatCards from "../components/StatCards";
import ExpenseChart from "../components/ExpenseChart";
import { expenseAPI } from "../services/api";

const Dashboard = () => {
  const [month, setMonth] = useState(format(new Date(), "yyyy-MM"));
  const [data, setData] = useState({ expenses: [], summary: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      // Check if token exists
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not authenticated. Redirecting to login...");
        setTimeout(() => window.location.href = "/login", 2000);
        return;
      }
      
      setLoading(true);
      setError("");
      try {
        const { data } = await expenseAPI.listByMonth(month);
        setData(data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Authentication failed. Redirecting to login...");
          localStorage.removeItem("token");
          setTimeout(() => window.location.href = "/login", 2000);
        } else {
          setError(err.response?.data?.detail || "Unable to fetch expenses");
          setData({ expenses: [], summary: null });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month]);

  const handleRangeChange = (direction) => {
    const currentDate = new Date(`${month}-01T00:00:00`);
    const newDate = direction === "prev" ? subMonths(currentDate, 1) : subMonths(currentDate, -1);
    setMonth(format(newDate, "yyyy-MM"));
  };

  return (
    <div className="page">
      <NavBar />

      <section style={{ marginTop: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
        <button onClick={() => handleRangeChange("prev")} style={navButton}>&larr;</button>
        <h2 style={{ margin: 0 }}>{format(new Date(`${month}-01T00:00:00`), "MMMM yyyy")}</h2>
        <button onClick={() => handleRangeChange("next")} style={navButton}>&rarr;</button>
      </section>

      {loading ? (
        <p>Loading analytics...</p>
      ) : error ? (
        <p style={{ color: "var(--danger)" }}>{error}</p>
      ) : (
        <>
          <StatCards summary={data.summary} />
          <div style={{ marginTop: "1.5rem", display: "grid", gap: "1rem", gridTemplateColumns: "2fr 1fr" }}>
            <ExpenseChart summary={data.summary} />
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Overspending Alerts</h3>
              {Object.entries(data.summary?.overspending_categories || {}).length === 0 ? (
                <p>Great job! You're within budgets for all categories.</p>
              ) : (
                <ul>
                  {Object.entries(data.summary.overspending_categories).map(([category, amount]) => (
                    <li key={category}>
                      <strong>{category}</strong>: €{amount.toFixed(2)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="card" style={{ marginTop: "1.5rem" }}>
            <h3 style={{ marginTop: 0 }}>Latest Expenses</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left" }}>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {data.expenses.map((expense) => (
                  <tr key={expense.expense_id}>
                    <td>{expense.category}</td>
                    <td>€{Number(expense.amount).toFixed(2)}</td>
                    <td>{expense.description || "-"}</td>
                    <td>{new Date(expense.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
                {!data.expenses.length && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "1rem" }}>
                      No expenses recorded for this month.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

const navButton = {
  border: "none",
  background: "var(--card)",
  borderRadius: "50%",
  width: "40px",
  height: "40px",
  boxShadow: "0 10px 20px rgba(15,23,42,0.08)",
  cursor: "pointer",
};

export default Dashboard;

