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
      console.log("Full login response:", response);
      console.log("Response data:", response.data);
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
      
      // Extract token and user info
      const token = response.data?.access_token || 
                   response.data?.access_token || 
                   response?.access_token ||
                   (typeof response.data === 'string' ? JSON.parse(response.data)?.access_token : null);
      
      const user = response.data?.user;
      
      console.log("Token extracted:", token);
      console.log("User info:", user);
      
      if (token) {
        localStorage.setItem("token", token);
        // Store user info if available
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }
        console.log("Token and user info stored in localStorage");
        // Use window.location for hard navigation to ensure auth check works
        window.location.href = "/dashboard";
      } else {
        console.error("Token not found. Response structure:", JSON.stringify(response.data, null, 2));
        setError("No token received from server. Check console for details.");
      }
    } catch (err) {
      console.error("Login error:", err);
      console.error("Error response:", err.response);
      console.error("Error data:", err.response?.data);
      setError(err.response?.data?.detail || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ display: "grid", placeItems: "center", minHeight: "calc(100vh - 4rem)" }}>
      <form className="card" style={{ width: "100%", maxWidth: 420 }} onSubmit={handleSubmit}>
        <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1.75rem", fontWeight: 700 }}>Welcome back</h2>
        <p style={{ color: "var(--muted)", margin: "0 0 2rem 0", fontSize: "0.95rem" }}>Track your finances securely</p>

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
              value={form.password}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter your password"
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
            {loading ? "Signing in..." : "Login"}
          </button>

          <p style={{ textAlign: "center", margin: 0, color: "#64748b", fontSize: "0.9rem" }}>
            New user? <Link to="/register" style={{ color: "var(--primary)", fontWeight: 500 }}>Create an account</Link>
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

export default Login;

