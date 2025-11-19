import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const response = await authAPI.register(form);
      // Store user info if available
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ display: "grid", placeItems: "center", minHeight: "calc(100vh - 4rem)" }}>
      <form className="card" style={{ width: "100%", maxWidth: 420 }} onSubmit={handleSubmit}>
        <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1.75rem", fontWeight: 700 }}>Create your account</h2>
        <p style={{ color: "var(--muted)", margin: "0 0 2rem 0", fontSize: "0.95rem" }}>Securely store and analyze your expenses</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <label style={labelStyle}>
            <span style={labelTextStyle}>Email</span>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              style={inputStyle}
              placeholder="you@example.com"
            />
          </label>

          <label style={labelStyle}>
            <span style={labelTextStyle}>Password</span>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Minimum 6 characters"
            />
          </label>

          {error && (
            <div style={{
              padding: "0.875rem 1rem",
              borderRadius: "8px",
              background: "#fef2f2",
              border: "1px solid #fca5a5",
              color: "var(--danger)",
              fontSize: "0.9rem",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div style={{
              padding: "0.875rem 1rem",
              borderRadius: "8px",
              background: "#f0fdf4",
              border: "1px solid #86efac",
              color: "#16a34a",
              fontSize: "0.9rem",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}>
              <span>{success}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.875rem 1.5rem",
              borderRadius: "8px",
              border: "none",
              background: loading ? "#cbd5e1" : "var(--primary)",
              color: "#fff",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: "0.95rem",
              transition: "all 0.2s",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Creating account..." : "Register"}
          </button>

          <p style={{ textAlign: "center", margin: 0, color: "#64748b", fontSize: "0.9rem" }}>
            Already have an account? <Link to="/login" style={{ color: "var(--primary)", fontWeight: 500 }}>Login</Link>
          </p>
        </div>
      </form>
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

export default Register;

