import React, { useEffect, useState } from "react";
import { format, subMonths } from "date-fns";
import NavBar from "../components/NavBar";
import StatCards from "../components/StatCards";
import ExpenseChart from "../components/ExpenseChart";
import NotificationCenter from "../components/NotificationCenter";
import { expenseAPI, notificationsAPI } from "../services/api";

const categories = ["Food", "Travel", "Rent", "Shopping", "Utilities", "Health", "Entertainment", "Misc"];

const Dashboard = () => {
  const [month, setMonth] = useState(format(new Date(), "yyyy-MM"));
  const [data, setData] = useState({ expenses: [], summary: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);
  const [editForm, setEditForm] = useState({ category: "", amount: "", description: "", timestamp: "" });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

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
        const response = await expenseAPI.listByMonth(month);
        const responseData = response.data || {};
        setData({
          expenses: responseData.expenses || [],
          summary: responseData.summary || null
        });
        
        // Fetch notification count
        try {
          const notifResponse = await notificationsAPI.getByMonth(month);
          const notifCount = notifResponse.data?.count || 0;
          setNotificationCount(notifCount);
        } catch (notifErr) {
          console.error("Error fetching notifications:", notifErr);
        }
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

  const handleEdit = (expense) => {
    setEditingExpense(expense.expense_id);
    setEditForm({
      category: expense.category,
      amount: expense.amount.toString(),
      description: expense.description || "",
      timestamp: expense.timestamp.slice(0, 16),
    });
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
    setEditForm({ category: "", amount: "", description: "", timestamp: "" });
  };

  const handleSaveEdit = async (expenseId) => {
    try {
      const updatePayload = {
        category: editForm.category,
        amount: Number(editForm.amount),
        description: editForm.description,
        timestamp: new Date(editForm.timestamp).toISOString(),
      };
      await expenseAPI.update(expenseId, updatePayload);
      setEditingExpense(null);
      // Refresh data
      const response = await expenseAPI.listByMonth(month);
      const responseData = response.data || {};
      setData({
        expenses: responseData.expenses || [],
        summary: responseData.summary || null
      });
      // Refresh notification count
      const notifResponse = await notificationsAPI.getByMonth(month);
      setNotificationCount(notifResponse.data?.count || 0);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update expense");
    }
  };

  const handleDelete = async (expenseId) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return;
    }
    try {
      await expenseAPI.remove(expenseId);
      // Refresh data
      const response = await expenseAPI.listByMonth(month);
      const responseData = response.data || {};
      setData({
        expenses: responseData.expenses || [],
        summary: responseData.summary || null
      });
      // Refresh notification count
      const notifResponse = await notificationsAPI.getByMonth(month);
      setNotificationCount(notifResponse.data?.count || 0);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete expense");
    }
  };

  return (
    <div className="page">
      <NavBar />

      <section style={{ marginTop: "2rem", display: "flex", alignItems: "center", gap: "1rem", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button onClick={() => handleRangeChange("prev")} style={navButton}>&larr;</button>
          <h2 style={{ margin: 0 }}>{format(new Date(`${month}-01T00:00:00`), "MMMM yyyy")}</h2>
          <button onClick={() => handleRangeChange("next")} style={navButton}>&rarr;</button>
        </div>
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          style={{
            ...notificationButtonStyle,
            background: notificationCount > 0 ? "var(--danger)" : "var(--primary)",
          }}
        >
          🔔 Notifications
          {notificationCount > 0 && (
            <span style={badgeStyle}>{notificationCount}</span>
          )}
        </button>
      </section>

      {showNotifications && (
        <NotificationCenter month={month} onClose={() => setShowNotifications(false)} />
      )}

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
            <h3 style={{ marginTop: 0, marginBottom: "1.25rem", fontSize: "1.25rem", fontWeight: 600 }}>Latest Expenses</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: "2px solid #e2e8f0" }}>
                    <th style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 600, color: "#64748b", letterSpacing: "0.05em" }}>Category</th>
                    <th style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 600, color: "#64748b", letterSpacing: "0.05em" }}>Amount</th>
                    <th style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 600, color: "#64748b", letterSpacing: "0.05em" }}>Description</th>
                    <th style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 600, color: "#64748b", letterSpacing: "0.05em" }}>Timestamp</th>
                    <th style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 600, color: "#64748b", letterSpacing: "0.05em" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.expenses && data.expenses.length > 0 ? (
                    data.expenses.map((expense, index) => (
                      <tr 
                        key={expense.expense_id}
                        style={{
                          borderBottom: index < data.expenses.length - 1 ? "1px solid #f1f5f9" : "none",
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        {editingExpense === expense.expense_id ? (
                          <>
                            <td style={{ padding: "1rem" }}>
                              <select
                                value={editForm.category}
                                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                style={tableInputStyle}
                              >
                                {categories.map((cat) => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                            </td>
                            <td style={{ padding: "1rem" }}>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={editForm.amount}
                                onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                                style={tableInputStyle}
                              />
                            </td>
                            <td style={{ padding: "1rem" }}>
                              <input
                                type="text"
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                style={tableInputStyle}
                              />
                            </td>
                            <td style={{ padding: "1rem" }}>
                              <input
                                type="datetime-local"
                                value={editForm.timestamp}
                                onChange={(e) => setEditForm({ ...editForm, timestamp: e.target.value })}
                                style={tableInputStyle}
                              />
                            </td>
                            <td style={{ padding: "1rem" }}>
                              <button onClick={() => handleSaveEdit(expense.expense_id)} style={actionButtonStyle}>
                                Save
                              </button>
                              <button onClick={handleCancelEdit} style={{ ...actionButtonStyle, background: "#ef4444" }}>
                                Cancel
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td style={{ padding: "1rem", fontWeight: 500 }}>{expense.category}</td>
                            <td style={{ padding: "1rem", fontWeight: 600, color: "var(--primary)" }}>€{Number(expense.amount).toFixed(2)}</td>
                            <td style={{ padding: "1rem", color: "#64748b" }}>{expense.description || "-"}</td>
                            <td style={{ padding: "1rem", color: "#64748b", fontSize: "0.9rem" }}>{new Date(expense.timestamp).toLocaleString()}</td>
                            <td style={{ padding: "1rem" }}>
                              <button onClick={() => handleEdit(expense)} style={actionButtonStyle}>
                                Edit
                              </button>
                              <button onClick={() => handleDelete(expense.expense_id)} style={{ ...actionButtonStyle, background: "#ef4444" }}>
                                Delete
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                        No expenses recorded for this month.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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

const tableInputStyle = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  borderRadius: "6px",
  border: "1px solid #e2e8f0",
  fontSize: "0.875rem",
  transition: "all 0.2s",
  outline: "none",
};

const actionButtonStyle = {
  padding: "0.5rem 1rem",
  borderRadius: "6px",
  border: "none",
  background: "var(--primary)",
  color: "#fff",
  cursor: "pointer",
  marginRight: "0.5rem",
  fontSize: "0.875rem",
  fontWeight: 500,
  transition: "all 0.2s",
};

const notificationButtonStyle = {
  padding: "0.6rem 1.2rem",
  borderRadius: 999,
  border: "none",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "0.9rem",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  position: "relative",
};

const badgeStyle = {
  background: "#fff",
  color: "var(--danger)",
  borderRadius: "50%",
  width: "20px",
  height: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.75rem",
  fontWeight: 700,
};

export default Dashboard;

