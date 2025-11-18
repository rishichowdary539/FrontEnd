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
      
      // Try multiple possible response structures
      const token = response.data?.access_token || 
                   response.data?.access_token || 
                   response?.access_token ||
                   (typeof response.data === 'string' ? JSON.parse(response.data)?.access_token : null);
      
      console.log("Token extracted:", token);
      
      if (token) {
        localStorage.setItem("token", token);
        console.log("Token stored in localStorage");
        // Force navigation with a small delay to ensure token is stored
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 100);
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

