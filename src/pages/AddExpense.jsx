import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { expenseAPI } from "../services/api";

const categories = ["Food", "Travel", "Rent", "Shopping", "Utilities", "Health", "Entertainment", "Misc"];

const AddExpense = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    category: categories[0],
    amount: "",
    description: "",
    timestamp: new Date().toISOString(),
  });
  const [status, setStatus] = useState({ message: "", variant: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: "", variant: "" });
    
    // Check if token exists
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus({ message: "Not authenticated. Please login again.", variant: "danger" });
      setTimeout(() => navigate("/login"), 2000);
      return;
    }
    
    try {
      console.log("Sending expense data:", { ...form, amount: Number(form.amount) });
      const response = await expenseAPI.add({ ...form, amount: Number(form.amount) });
      console.log("Expense saved response:", response);
      setStatus({ message: "Expense saved!", variant: "success" });
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      console.error("Error saving expense:", err);
      console.error("Error response:", err.response);
      console.error("Error data:", err.response?.data);
      if (err.response?.status === 401) {
        setStatus({ message: "Authentication failed. Please login again.", variant: "danger" });
        localStorage.removeItem("token");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setStatus({ message: err.response?.data?.detail || err.message || "Unable to save expense", variant: "danger" });
      }
    }
  };

  return (
    <div className="page">
      <NavBar />
      <section style={{ marginTop: "2rem", maxWidth: "600px", margin: "2rem auto 0" }}>
        <div className="card">
          <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1.75rem", fontWeight: 700 }}>Add Expense</h2>
          <p style={{ color: "#64748b", margin: "0 0 1.5rem 0", fontSize: "0.95rem" }}>
            Record a new expense to track your spending.
          </p>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <label style={labelStyle}>
              <span style={labelTextStyle}>Category</span>
              <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>

            <label style={labelStyle}>
              <span style={labelTextStyle}>Amount (€)</span>
              <input name="amount" type="number" min="0" step="0.01" required value={form.amount} onChange={handleChange} style={inputStyle} />
            </label>

            <label style={labelStyle}>
              <span style={labelTextStyle}>Description</span>
              <textarea name="description" rows={3} value={form.description} onChange={handleChange} style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }} />
            </label>

            <label style={labelStyle}>
              <span style={labelTextStyle}>Timestamp</span>
              <input name="timestamp" type="datetime-local" value={form.timestamp.slice(0, 16)} onChange={(e) => setForm({ ...form, timestamp: new Date(e.target.value).toISOString() })} style={inputStyle} />
            </label>

            {status.message && (
              <div style={{
                padding: "0.875rem 1rem",
                borderRadius: "8px",
                background: status.variant === "success" ? "#f0fdf4" : "#fef2f2",
                border: `1px solid ${status.variant === "success" ? "#86efac" : "#fca5a5"}`,
                color: status.variant === "success" ? "#16a34a" : "#dc2626",
                fontSize: "0.9rem",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}>
                <span>{status.message}</span>
              </div>
            )}

            <button type="submit" style={buttonStyle}>
              Save Expense
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

const labelStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
};

const labelTextStyle = {
  fontSize: "0.875rem",
  fontWeight: 500,
  color: "#475569",
};

const inputStyle = {
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  fontSize: "0.95rem",
  transition: "all 0.2s",
  outline: "none",
};

const buttonStyle = {
  padding: "0.875rem 1.5rem",
  borderRadius: "8px",
  border: "none",
  background: "var(--primary)",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: "0.95rem",
  transition: "all 0.2s",
};

export default AddExpense;

