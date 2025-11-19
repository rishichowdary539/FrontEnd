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

