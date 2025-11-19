import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { lambdaAPI } from "../services/api";

const Lambda = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [triggerResult, setTriggerResult] = useState(null);
  const [triggering, setTriggering] = useState(false);

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
        const response = await lambdaAPI.status();
        setStatus(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Authentication failed. Redirecting to login...");
          localStorage.removeItem("token");
          setTimeout(() => window.location.href = "/login", 2000);
        } else {
          setError(err.response?.data?.detail || "Unable to fetch Lambda status");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const handleTrigger = async () => {
    if (!window.confirm("Are you sure you want to manually trigger the Lambda function for monthly reports?")) {
      return;
    }

    setTriggering(true);
    setTriggerResult(null);
    setError("");
    try {
      const response = await lambdaAPI.trigger();
      setTriggerResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to trigger Lambda function");
      setTriggerResult({ success: false, error: err.response?.data?.detail || err.message });
    } finally {
      setTriggering(false);
    }
  };

  return (
    <div className="page">
      <NavBar />
      <section style={{ marginTop: "2rem" }}>
        <h2>Lambda Function Management</h2>

        {loading ? (
          <p>Loading Lambda status...</p>
        ) : error && !status ? (
          <p style={{ color: "var(--danger)" }}>{error}</p>
        ) : (
          <>
            <div className="card" style={{ marginTop: "1.5rem" }}>
              <h3 style={{ marginTop: 0 }}>Lambda Function Status</h3>
              {status && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <strong>Function Name:</strong> {status.function_name}
                  </div>
                  <div>
                    <strong>Status:</strong>{" "}
                    <span style={{ 
                      color: status.status === "Active" ? "var(--success)" : "var(--danger)",
                      fontWeight: 600
                    }}>
                      {status.status}
                    </span>
                  </div>
                  <div>
                    <strong>Runtime:</strong> {status.runtime}
                  </div>
                  <div>
                    <strong>Last Modified:</strong> {new Date(status.last_modified).toLocaleString()}
                  </div>
                  {status.scheduler && (
                    <div>
                      <strong>Scheduler Status:</strong>{" "}
                      <span style={{ 
                        color: status.scheduler.running ? "var(--success)" : "var(--danger)",
                        fontWeight: 600
                      }}>
                        {status.scheduler.running ? "Running" : "Stopped"}
                      </span>
                      {status.scheduler.next_run && (
                        <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#64748b" }}>
                          Next run: {new Date(status.scheduler.next_run).toLocaleString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="card" style={{ marginTop: "1.5rem" }}>
              <h3 style={{ marginTop: 0 }}>Manual Trigger</h3>
              <p style={{ color: "#64748b", marginBottom: "1rem" }}>
                Manually trigger the Lambda function to generate monthly expense reports.
              </p>
              <button
                onClick={handleTrigger}
                disabled={triggering}
                style={{
                  padding: "0.9rem 1.5rem",
                  borderRadius: 999,
                  border: "none",
                  background: triggering ? "#94a3b8" : "var(--primary)",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: triggering ? "not-allowed" : "pointer",
                }}
              >
                {triggering ? "Triggering..." : "Trigger Lambda Function"}
              </button>

              {triggerResult && (
                <div style={{ 
                  marginTop: "1rem", 
                  padding: "1rem", 
                  borderRadius: 8,
                  background: triggerResult.success ? "#f0fdf4" : "#fef2f2",
                  border: `1px solid ${triggerResult.success ? "#86efac" : "#fca5a5"}`,
                }}>
                  <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
                    {triggerResult.success ? "✓ Trigger Successful" : "✗ Trigger Failed"}
                  </div>
                  {triggerResult.result && (
                    <div style={{ fontSize: "0.9rem", color: "#64748b" }}>
                      Result: {triggerResult.result}
                    </div>
                  )}
                  {triggerResult.error && (
                    <div style={{ fontSize: "0.9rem", color: "#dc2626" }}>
                      Error: {triggerResult.error}
                    </div>
                  )}
                  {triggerResult.status_code && (
                    <div style={{ fontSize: "0.9rem", color: "#64748b" }}>
                      Status Code: {triggerResult.status_code}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Lambda;

