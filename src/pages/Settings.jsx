import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { settingsAPI } from "../services/api";

const categories = ["Food", "Travel", "Rent", "Shopping", "Utilities", "Health", "Entertainment", "Education", "Misc"];

const Settings = () => {
  const [schedulerStatus, setSchedulerStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [thresholds, setThresholds] = useState({});
  const [isUpdatingThresholds, setIsUpdatingThresholds] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not authenticated. Redirecting to login...");
        setTimeout(() => window.location.href = "/login", 2000);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const [schedulerResponse, thresholdsResponse] = await Promise.all([
          settingsAPI.getScheduler(),
          settingsAPI.getThresholds()
        ]);
        
        const schedulerData = schedulerResponse.data;
        setSchedulerStatus(schedulerData);
        
        const thresholdsData = thresholdsResponse.data;
        setThresholds(thresholdsData.thresholds || {});
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Authentication failed. Redirecting to login...");
          localStorage.removeItem("token");
          setTimeout(() => window.location.href = "/login", 2000);
        } else {
          setError(err.response?.data?.detail || "Unable to fetch scheduler status");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const handleStart = async () => {
    setError("");
    setSuccess("");
    try {
      const response = await settingsAPI.startScheduler();
      setSuccess("Monthly reports enabled. You will receive email reports on the 1st day of each month at 00:00 UTC.");
      // Refresh status to get updated state
      const statusResponse = await settingsAPI.getScheduler();
      setSchedulerStatus(statusResponse.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to enable monthly reports");
    }
  };

  const handleStop = async () => {
    setError("");
    setSuccess("");
    if (!window.confirm("Are you sure you want to disable monthly reports? You will not receive monthly report emails.")) {
      return;
    }
    try {
      const response = await settingsAPI.stopScheduler();
      setSuccess("Monthly reports disabled. You will not receive email reports.");
      // Refresh status to get updated state
      const statusResponse = await settingsAPI.getScheduler();
      setSchedulerStatus(statusResponse.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to disable monthly reports");
    }
  };


  const handleThresholdChange = (category, value) => {
    setThresholds({
      ...thresholds,
      [category]: parseFloat(value) || 0,
    });
  };

  const handleUpdateThresholds = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsUpdatingThresholds(true);
    try {
      const response = await settingsAPI.updateThresholds(thresholds);
      setSuccess(response.data.message || "Budget thresholds updated successfully");
      // Refresh thresholds
      const thresholdsResponse = await settingsAPI.getThresholds();
      setThresholds(thresholdsResponse.data.thresholds || {});
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update budget thresholds");
    } finally {
      setIsUpdatingThresholds(false);
    }
  };


  return (
    <div className="page">
      <NavBar />
      <section style={{ marginTop: "2rem", maxWidth: "1200px", margin: "2rem auto 0" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1.75rem", fontWeight: 700 }}>Settings</h2>
          <p style={{ color: "#64748b", margin: 0, fontSize: "0.95rem" }}>
            Manage scheduler configuration and budget thresholds for notifications.
          </p>
        </div>

        {loading ? (
          <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
            <p style={{ color: "#64748b", margin: 0 }}>Loading settings...</p>
          </div>
        ) : error && !schedulerStatus ? (
          <div className="card" style={{ background: "#fef2f2", border: "1px solid #fca5a5" }}>
            <p style={{ color: "var(--danger)", margin: 0 }}>{error}</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1.5rem" }}>
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>Monthly Reports</h3>
                  <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0.25rem 0 0 0" }}>
                    Enable or disable automatic monthly report emails. Reports run on the 1st day of each month at 00:00 UTC.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <button
                    onClick={handleStart}
                    disabled={schedulerStatus?.enabled}
                    style={{
                      ...buttonStyle,
                      background: schedulerStatus?.enabled ? "#cbd5e1" : "var(--success)",
                      cursor: schedulerStatus?.enabled ? "not-allowed" : "pointer",
                      opacity: schedulerStatus?.enabled ? 0.6 : 1,
                      transition: "all 0.2s",
                    }}
                  >
                    Start
                  </button>
                  <button
                    onClick={handleStop}
                    disabled={!schedulerStatus?.enabled}
                    style={{
                      ...buttonStyle,
                      background: !schedulerStatus?.enabled ? "#cbd5e1" : "var(--danger)",
                      cursor: !schedulerStatus?.enabled ? "not-allowed" : "pointer",
                      opacity: !schedulerStatus?.enabled ? 0.6 : 1,
                      transition: "all 0.2s",
                    }}
                  >
                    Stop
                  </button>
                </div>
              </div>
              
              {schedulerStatus && (
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                  gap: "1.5rem",
                  padding: "1.25rem",
                  background: "#f8fafc",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0"
                }}>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                      Status
                    </div>
                    <div style={{
                      color: schedulerStatus.enabled ? "var(--success)" : "var(--danger)",
                      fontWeight: 600,
                      fontSize: "1.1rem"
                    }}>
                      {schedulerStatus.enabled ? "● Enabled" : "● Disabled"}
                    </div>
                    {!schedulerStatus.enabled && (
                      <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem" }}>
                        You will not receive monthly report emails
                      </div>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                      Schedule
                    </div>
                    <div style={{ fontWeight: 600, fontSize: "1.1rem" }}>
                      1st day at 00:00 UTC
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem" }}>
                      Monthly
                    </div>
                  </div>
                  {schedulerStatus.schedule && schedulerStatus.schedule.next_run && (
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                        Next Run
                      </div>
                      <div style={{ fontWeight: 500, fontSize: "0.95rem" }}>
                        {new Date(schedulerStatus.schedule.next_run).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="card">
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.25rem", fontWeight: 600 }}>Budget Thresholds</h3>
              <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 1.5rem 0" }}>
                Set spending limits for each category. You'll receive notifications when spending crosses these thresholds.
              </p>
              <form onSubmit={handleUpdateThresholds} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
                  {categories.map((category) => (
                    <label key={category} style={labelStyle}>
                      <span style={labelTextStyle}>{category}</span>
                      <div style={{ position: "relative" }}>
                        <span style={{
                          position: "absolute",
                          left: "0.85rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#64748b",
                          fontWeight: 500
                        }}>€</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={thresholds[category] || ""}
                          onChange={(e) => handleThresholdChange(category, e.target.value)}
                          placeholder="0.00"
                          style={{ ...inputStyle, paddingLeft: "2rem" }}
                        />
                      </div>
                    </label>
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={isUpdatingThresholds}
                  style={{
                    ...buttonStyle,
                    background: isUpdatingThresholds ? "#cbd5e1" : "var(--primary)",
                    cursor: isUpdatingThresholds ? "not-allowed" : "pointer",
                    opacity: isUpdatingThresholds ? 0.6 : 1,
                    alignSelf: "flex-start",
                    transition: "all 0.2s",
                  }}
                >
                  {isUpdatingThresholds ? "Updating..." : "Update Budget Thresholds"}
                </button>
              </form>
            </div>

            {(error || success) && (
              <div style={{
                padding: "1rem 1.25rem",
                borderRadius: "12px",
                background: error ? "#fef2f2" : "#f0fdf4",
                border: `1px solid ${error ? "#fca5a5" : "#86efac"}`,
                color: error ? "#dc2626" : "#16a34a",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                fontSize: "0.9rem",
                fontWeight: 500,
              }}>
                <span>{error || success}</span>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

const buttonStyle = {
  padding: "0.75rem 1.5rem",
  borderRadius: "8px",
  border: "none",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: "0.9rem",
  transition: "all 0.2s",
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

export default Settings;

