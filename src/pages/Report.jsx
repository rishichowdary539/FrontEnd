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
      <section className="card" style={{ marginTop: "2rem" }}>
        <h2>Monthly Reports</h2>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <label>
            Period
            <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} style={inputStyle} />
          </label>
          <button onClick={fetchReport} style={buttonStyle} disabled={loading}>
            {loading ? "Generating..." : "Generate Report"}
          </button>
        </div>
        {error && <p style={{ color: "var(--danger)", marginTop: "1rem" }}>{error}</p>}
      </section>

      {report && (
        <section className="card" style={{ marginTop: "1.5rem" }}>
          <h3 style={{ marginTop: 0 }}>Summary for {month}</h3>
          <p>Total spent: €{Number(report.total_spent || 0).toFixed(2)}</p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <a href={report.pdf_report_url} target="_blank" rel="noreferrer" style={linkButton}>
              Download PDF
            </a>
            <a href={report.csv_report_url} target="_blank" rel="noreferrer" style={linkButton}>
              Download CSV
            </a>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <h4>Spending spikes</h4>
            {!(report.spending_spikes?.length) ? (
              <p>No spikes detected 🎉</p>
            ) : (
              <ul>
                {report.spending_spikes.map((spike) => (
                  <li key={spike.expense_id || spike.timestamp}>
                    {spike.category} — €{Number(spike.amount).toFixed(2)} on{" "}
                    {new Date(spike.timestamp).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

const inputStyle = {
  display: "block",
  padding: "0.6rem 0.8rem",
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  marginTop: "0.35rem",
};

const buttonStyle = {
  padding: "0.7rem 1.5rem",
  borderRadius: 999,
  border: "none",
  background: "var(--primary)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 600,
};

const linkButton = {
  ...buttonStyle,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
};

export default Report;

