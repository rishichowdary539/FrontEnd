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
      await authAPI.register(form);
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ display: "grid", placeItems: "center" }}>
      <form className="card" style={{ width: "100%", maxWidth: 420 }} onSubmit={handleSubmit}>
        <h2>Create your account</h2>
        <p style={{ color: "var(--muted)" }}>Securely store and analyze your expenses</p>

        <label>Email</label>
        <input
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          style={{ width: "100%", padding: "0.8rem", borderRadius: 12, border: "1px solid #e2e8f0" }}
        />

        <label style={{ marginTop: "1rem" }}>Password</label>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          value={form.password}
          onChange={handleChange}
          style={{ width: "100%", padding: "0.8rem", borderRadius: 12, border: "1px solid #e2e8f0" }}
        />

        {error && (
          <p style={{ color: "var(--danger)", marginTop: "0.5rem" }}>
            {error}
          </p>
        )}
        {success && (
          <p style={{ color: "var(--success)", marginTop: "0.5rem" }}>
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "1.5rem",
            width: "100%",
            padding: "0.85rem",
            borderRadius: 999,
            border: "none",
            background: "var(--primary)",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;

