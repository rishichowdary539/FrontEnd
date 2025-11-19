import React, { useState } from "react";
import { format } from "date-fns";
import NavBar from "../components/NavBar";
import { reportAPI } from "../services/api";

const Report = () => {
  const [month, setMonth] = useState(format(new Date(), "yyyy-MM"));
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReport = async () => {
    // Check if token exists
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated. Please login again.");
      setTimeout(() => window.location.href = "/login", 2000);
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      const { data } = await reportAPI.fetchMonthly(month);
      setReport(data);
    } catch (err) {
      setReport(null);
      if (err.response?.status === 401) {
        setError("Authentication failed. Redirecting to login...");
        localStorage.removeItem("token");
        setTimeout(() => window.location.href = "/login", 2000);
      } else {
        setError(err.response?.data?.detail || "No report available for this month.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <NavBar />
      <section style={{ marginTop: "2rem", maxWidth: "900px", margin: "2rem auto 0" }}>
        <div className="card">
          <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1.75rem", fontWeight: 700 }}>Monthly Reports</h2>
          <p style={{ color: "#64748b", margin: "0 0 1.5rem 0", fontSize: "0.95rem" }}>
            Generate detailed expense reports with insights and downloadable files.
          </p>
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end", flexWrap: "wrap" }}>
            <label style={{ flex: "1", minWidth: "200px" }}>
              <span style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#475569", marginBottom: "0.5rem" }}>Period</span>
              <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} style={inputStyle} />
            </label>
            <button onClick={fetchReport} style={buttonStyle} disabled={loading}>
              {loading ? "Generating..." : "Generate Report"}
            </button>
          </div>
          {error && (
            <div style={{
              marginTop: "1.25rem",
              padding: "0.875rem 1rem",
              borderRadius: "8px",
              background: "#fef2f2",
              border: "1px solid #fca5a5",
              color: "var(--danger)",
              fontSize: "0.9rem",
              fontWeight: 500,
            }}>
              {error}
            </div>
          )}
        </div>

        {report && (
          <div className="card" style={{ marginTop: "1.5rem" }}>
            <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.25rem", fontWeight: 600 }}>Summary for {month}</h3>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
              gap: "1.5rem",
              marginBottom: "1.5rem",
              padding: "1.25rem",
              background: "#f8fafc",
              borderRadius: "12px",
              border: "1px solid #e2e8f0"
            }}>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                  Total Spent
                </div>
                <div style={{ fontWeight: 700, fontSize: "1.5rem", color: "var(--primary)" }}>
                  €{Number(report.total_spent || 0).toFixed(2)}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
              <a href={report.pdf_report_url} target="_blank" rel="noreferrer" style={linkButton}>
                Download PDF
              </a>
              <a href={report.csv_report_url} target="_blank" rel="noreferrer" style={linkButton}>
                Download CSV
              </a>
            </div>
            <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid #e2e8f0" }}>
              <h4 style={{ margin: "0 0 1rem 0", fontSize: "1rem", fontWeight: 600 }}>Spending Spikes</h4>
              {!(report.spending_spikes?.length) ? (
                <p style={{ color: "#64748b", margin: 0 }}>No spikes detected</p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {report.spending_spikes.map((spike) => (
                    <li key={spike.expense_id || spike.timestamp} style={{
                      padding: "0.875rem 1rem",
                      background: "#f8fafc",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}>
                      <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{spike.category}</div>
                      <div style={{ fontSize: "0.875rem", color: "#64748b" }}>
                        €{Number(spike.amount).toFixed(2)} on {new Date(spike.timestamp).toLocaleDateString()}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
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
  padding: "0.75rem 1.5rem",
  borderRadius: "8px",
  border: "none",
  background: "var(--primary)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "0.9rem",
  transition: "all 0.2s",
  whiteSpace: "nowrap",
};

const linkButton = {
  ...buttonStyle,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  gap: "0.5rem",
};

export default Report;

