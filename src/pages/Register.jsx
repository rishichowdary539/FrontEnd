import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { authAPI } from "../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <div style={containerStyle}>
      <div style={leftSectionStyle}>
        {/* <img 
          src="/images/expense-tracker-sidebar.jpg" 
          alt="Expense Tracker" 
          style={imageStyle}
        /> */}
        <div style={leftContentStyle}>
          <h1 style={titleStyle}>Smart Expense Tracker</h1>
          <p style={descriptionStyle}>
            Streamline expense tracking, automate reporting, and gain clarity on every financial transaction.
          </p>
          <ul style={featuresListStyle}>
            <li style={featureItemStyle}>
              <span style={checkmarkStyle}>✓</span>
              <span>Smart Dashboard: Monitor expenses, budgets, and spending patterns in one place.</span>
            </li>
            <li style={featureItemStyle}>
              <span style={checkmarkStyle}>✓</span>
              <span>Automated Reports: Generate monthly reports with insights and budget alerts.</span>
            </li>
            <li style={featureItemStyle}>
              <span style={checkmarkStyle}>✓</span>
              <span>Budget Management: Set thresholds and receive notifications for overspending.</span>
            </li>
          </ul>
        </div>
      </div>

      <div style={rightSectionStyle}>
        <div style={registerCardStyle}>
          <h2 style={welcomeStyle}>Create your account</h2>
          <p style={instructionStyle}>Sign up to start tracking your expenses</p>
          <p style={subInstructionStyle}>Enter your details to create a new account and begin managing your finances.</p>

          <form onSubmit={handleSubmit} style={formStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Email</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                style={inputStyle}
                placeholder="name@example.com"
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Password</label>
              <div style={passwordContainerStyle}>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={form.password}
                  onChange={handleChange}
                  style={passwordInputStyle}
                  placeholder="Minimum 6 characters"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={eyeButtonStyle}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </span>
              </div>
            </div>

            {error && (
              <div style={errorStyle}>
                {error}
              </div>
            )}

            {success && (
              <div style={successStyle}>
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={submitButtonStyle}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = "#1d4ed8";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = "#2563eb";
                }
              }}
            >
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          <p style={troubleStyle}>
            Already have an account? <Link to="/login" style={linkStyle}>Sign in</Link> instead.
          </p>
        </div>
      </div>
    </div>
  );
};

const containerStyle = {
  display: "flex",
  minHeight: "100vh",
  backgroundColor: "#f8fafc",
};

const leftSectionStyle = {
  flex: "1",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "3rem",
  backgroundColor: "#2563eb",
  borderRight: "1px solid #1d4ed8",
};

const imageStyle = {
  width: "100%",
  maxWidth: "500px",
  height: "auto",
  borderRadius: "12px",
  marginBottom: "2rem",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  border: "1px solid #e2e8f0",
};

const leftContentStyle = {
  maxWidth: "600px",
  textAlign: "center",
  color: "#ffffff",
};

const titleStyle = {
  fontSize: "2.5rem",
  fontWeight: 700,
  marginBottom: "1rem",
  color: "#ffffff",
};

const descriptionStyle = {
  fontSize: "1.1rem",
  marginBottom: "2rem",
  lineHeight: "1.6",
  color: "rgba(255,255,255,0.9)",
};

const featuresListStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  textAlign: "left",
};

const featureItemStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: "0.75rem",
  marginBottom: "1rem",
  fontSize: "1rem",
  lineHeight: "1.6",
};

const checkmarkStyle = {
  color: "#86efac",
  fontWeight: "bold",
  fontSize: "1.2rem",
  flexShrink: 0,
};

const rightSectionStyle = {
  flex: "1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "2rem",
  backgroundColor: "#f8fafc",
};

const registerCardStyle = {
  width: "100%",
  maxWidth: "450px",
  backgroundColor: "#ffffff",
  padding: "2.5rem",
  borderRadius: "12px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
};

const welcomeStyle = {
  fontSize: "1.75rem",
  fontWeight: 700,
  marginBottom: "0.5rem",
  color: "#1e293b",
};

const instructionStyle = {
  fontSize: "0.95rem",
  color: "#64748b",
  marginBottom: "0.5rem",
  fontWeight: 500,
};

const subInstructionStyle = {
  fontSize: "0.875rem",
  color: "#94a3b8",
  marginBottom: "1.5rem",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1.25rem",
};

const inputGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
};

const labelStyle = {
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
  boxSizing: "border-box",
};

const passwordContainerStyle = {
  position: "relative",
  display: "flex",
  alignItems: "center",
};

const passwordInputStyle = {
  ...inputStyle,
  paddingRight: "3rem",
};

const eyeButtonStyle = {
  position: "absolute",
  right: "0.75rem",
  cursor: "pointer",
  padding: "0.25rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#64748b",
};

const errorStyle = {
  padding: "0.875rem 1rem",
  borderRadius: "8px",
  background: "#fef2f2",
  border: "1px solid #fca5a5",
  color: "#dc2626",
  fontSize: "0.9rem",
  fontWeight: 500,
};

const successStyle = {
  padding: "0.875rem 1rem",
  borderRadius: "8px",
  background: "#f0fdf4",
  border: "1px solid #86efac",
  color: "#16a34a",
  fontSize: "0.9rem",
  fontWeight: 500,
};

const submitButtonStyle = {
  width: "100%",
  padding: "0.875rem 1.5rem",
  borderRadius: "8px",
  border: "none",
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "0.95rem",
  transition: "all 0.2s",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
};

const troubleStyle = {
  textAlign: "center",
  marginTop: "1.5rem",
  fontSize: "0.875rem",
  color: "#64748b",
};

const linkStyle = {
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: 500,
};

export default Register;

