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
    try {
      await expenseAPI.add({ ...form, amount: Number(form.amount) });
      setStatus({ message: "Expense saved!", variant: "success" });
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setStatus({ message: err.response?.data?.detail || "Unable to save expense", variant: "danger" });
    }
  };

  return (
    <div className="page">
      <NavBar />
      <section className="card" style={{ marginTop: "2rem", maxWidth: 600 }}>
        <h2>Add Expense</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <label>
            Category
            <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>

          <label>
            Amount (€)
            <input name="amount" type="number" min="0" step="0.01" required value={form.amount} onChange={handleChange} style={inputStyle} />
          </label>

          <label>
            Description
            <textarea name="description" rows={3} value={form.description} onChange={handleChange} style={{ ...inputStyle, resize: "vertical" }} />
          </label>

          <label>
            Timestamp
            <input name="timestamp" type="datetime-local" value={form.timestamp.slice(0, 16)} onChange={(e) => setForm({ ...form, timestamp: new Date(e.target.value).toISOString() })} style={inputStyle} />
          </label>

          {status.message && (
            <p style={{ color: status.variant === "success" ? "var(--success)" : "var(--danger)" }}>
              {status.message}
            </p>
          )}

          <button type="submit" style={buttonStyle}>
            Save Expense
          </button>
        </form>
      </section>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "0.85rem",
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  marginTop: "0.35rem",
};

const buttonStyle = {
  padding: "0.9rem",
  borderRadius: 999,
  border: "none",
  background: "var(--primary)",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

export default AddExpense;

