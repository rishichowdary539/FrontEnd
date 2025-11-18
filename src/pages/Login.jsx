import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await authAPI.login(form);
      console.log("Login response:", response);
      const token = response.data?.access_token;
      console.log("Token extracted:", token);
      
      if (token) {
        localStorage.setItem("token", token);
        console.log("Token stored in localStorage");
        // Force navigation with a small delay to ensure token is stored
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 100);
      } else {
        setError("No token received from server");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ display: "grid", placeItems: "center" }}>
      <form className="card" style={{ width: "100%", maxWidth: 420 }} onSubmit={handleSubmit}>
        <h2>Welcome back</h2>
        <p style={{ color: "var(--muted)" }}>Track your finances securely</p>

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
          value={form.password}
          onChange={handleChange}
          style={{ width: "100%", padding: "0.8rem", borderRadius: 12, border: "1px solid #e2e8f0" }}
        />

        {error && (
          <p style={{ color: "var(--danger)", marginTop: "0.5rem" }}>
            {error}
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
          {loading ? "Signing in..." : "Login"}
        </button>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          New user? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

