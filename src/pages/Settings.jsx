import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { settingsAPI } from "../services/api";

const Settings = () => {
  const [schedulerStatus, setSchedulerStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [schedule, setSchedule] = useState({ day: 1, hour: 6, minute: 0 });
  const [isUpdating, setIsUpdating] = useState(false);

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
        const response = await settingsAPI.getScheduler();
        const data = response.data;
        setSchedulerStatus(data);
        if (data.schedule) {
          setSchedule({
            day: data.schedule.day || 1,
            hour: data.schedule.hour || 6,
            minute: data.schedule.minute || 0,
          });
        }
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
      setSuccess(response.data.message || "Scheduler started successfully");
      setSchedulerStatus(response.data.status);
      // Refresh status
      const statusResponse = await settingsAPI.getScheduler();
      setSchedulerStatus(statusResponse.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to start scheduler");
    }
  };

  const handleStop = async () => {
    setError("");
    setSuccess("");
    if (!window.confirm("Are you sure you want to stop the scheduler? Monthly reports will not run automatically.")) {
      return;
    }
    try {
      const response = await settingsAPI.stopScheduler();
      setSuccess(response.data.message || "Scheduler stopped successfully");
      setSchedulerStatus({ running: false });
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to stop scheduler");
    }
  };

  const handleUpdateSchedule = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsUpdating(true);
    try {
      const response = await settingsAPI.updateSchedule(schedule);
      setSuccess(response.data.message || "Schedule updated successfully");
      // Refresh status
      const statusResponse = await settingsAPI.getScheduler();
      setSchedulerStatus(statusResponse.data);
      if (statusResponse.data.schedule) {
        setSchedule({
          day: statusResponse.data.schedule.day || schedule.day,
          hour: statusResponse.data.schedule.hour || schedule.hour,
          minute: statusResponse.data.schedule.minute || schedule.minute,
        });
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update schedule");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="page">
      <NavBar />
      <section style={{ marginTop: "2rem" }}>
        <h2>Scheduler Settings</h2>
        <p style={{ color: "#64748b", marginBottom: "2rem" }}>
          Control the automatic monthly expense reports cron job. The scheduler runs Lambda functions to generate reports.
        </p>

        {loading ? (
          <p>Loading scheduler status...</p>
        ) : error && !schedulerStatus ? (
          <p style={{ color: "var(--danger)" }}>{error}</p>
        ) : (
          <>
            <div className="card" style={{ marginTop: "1.5rem" }}>
              <h3 style={{ marginTop: 0 }}>Scheduler Status</h3>
              {schedulerStatus && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <strong>Status:</strong>{" "}
                    <span style={{
                      color: schedulerStatus.running ? "var(--success)" : "var(--danger)",
                      fontWeight: 600
                    }}>
                      {schedulerStatus.running ? "Running" : "Stopped"}
                    </span>
                  </div>
                  {schedulerStatus.schedule && (
                    <>
                      <div>
                        <strong>Current Schedule:</strong> Day {schedulerStatus.schedule.day} at {String(schedulerStatus.schedule.hour).padStart(2, '0')}:{String(schedulerStatus.schedule.minute).padStart(2, '0')} UTC
                      </div>
                      {schedulerStatus.schedule.next_run && (
                        <div>
                          <strong>Next Run:</strong> {new Date(schedulerStatus.schedule.next_run).toLocaleString()}
                        </div>
                      )}
                    </>
                  )}
                  {schedulerStatus.jobs && schedulerStatus.jobs.length > 0 && (
                    <div>
                      <strong>Jobs:</strong>
                      <ul style={{ marginTop: "0.5rem" }}>
                        {schedulerStatus.jobs.map((job) => (
                          <li key={job.id}>
                            {job.name} {job.next_run && `(Next: ${new Date(job.next_run).toLocaleString()})`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
                <button
                  onClick={handleStart}
                  disabled={schedulerStatus?.running}
                  style={{
                    ...buttonStyle,
                    background: schedulerStatus?.running ? "#94a3b8" : "var(--success)",
                    cursor: schedulerStatus?.running ? "not-allowed" : "pointer",
                  }}
                >
                  Start Scheduler
                </button>
                <button
                  onClick={handleStop}
                  disabled={!schedulerStatus?.running}
                  style={{
                    ...buttonStyle,
                    background: !schedulerStatus?.running ? "#94a3b8" : "var(--danger)",
                    cursor: !schedulerStatus?.running ? "not-allowed" : "pointer",
                  }}
                >
                  Stop Scheduler
                </button>
              </div>
            </div>

            <div className="card" style={{ marginTop: "1.5rem" }}>
              <h3 style={{ marginTop: 0 }}>Update Schedule</h3>
              <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1rem" }}>
                Configure when the monthly reports should run. Format: Day of month (1-31), Hour (0-23), Minute (0-59) in UTC.
              </p>
              <form onSubmit={handleUpdateSchedule} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                  <label>
                    Day of Month (1-31)
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={schedule.day}
                      onChange={(e) => setSchedule({ ...schedule, day: parseInt(e.target.value) || 1 })}
                      style={inputStyle}
                      required
                    />
                  </label>
                  <label>
                    Hour (0-23) UTC
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={schedule.hour}
                      onChange={(e) => setSchedule({ ...schedule, hour: parseInt(e.target.value) || 0 })}
                      style={inputStyle}
                      required
                    />
                  </label>
                  <label>
                    Minute (0-59)
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={schedule.minute}
                      onChange={(e) => setSchedule({ ...schedule, minute: parseInt(e.target.value) || 0 })}
                      style={inputStyle}
                      required
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={isUpdating}
                  style={{
                    ...buttonStyle,
                    background: isUpdating ? "#94a3b8" : "var(--primary)",
                    cursor: isUpdating ? "not-allowed" : "pointer",
                  }}
                >
                  {isUpdating ? "Updating..." : "Update Schedule"}
                </button>
              </form>
            </div>

            {error && (
              <div style={{
                marginTop: "1rem",
                padding: "1rem",
                background: "#fef2f2",
                border: "1px solid #fca5a5",
                borderRadius: 8,
                color: "#dc2626"
              }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{
                marginTop: "1rem",
                padding: "1rem",
                background: "#f0fdf4",
                border: "1px solid #86efac",
                borderRadius: 8,
                color: "#16a34a"
              }}>
                {success}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

const buttonStyle = {
  padding: "0.9rem 1.5rem",
  borderRadius: 999,
  border: "none",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: "0.9rem",
};

const inputStyle = {
  width: "100%",
  padding: "0.85rem",
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  marginTop: "0.35rem",
};

export default Settings;

