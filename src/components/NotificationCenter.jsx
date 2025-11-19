import React, { useState, useEffect } from "react";
import { notificationsAPI } from "../services/api";

const NotificationCenter = ({ month, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(new Set());

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      setLoading(true);
      try {
        const response = month 
          ? await notificationsAPI.getByMonth(month)
          : await notificationsAPI.getCurrent();
        setNotifications(response.data?.notifications || []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [month]);

  const handleDismiss = (id) => {
    setDismissed(new Set([...dismissed, id]));
  };

  const visibleNotifications = notifications.filter(n => !dismissed.has(n.id));

  if (loading) {
    return null;
  }

  if (visibleNotifications.length === 0) {
    return null;
  }

  const getSeverityStyle = (severity) => {
    const styles = {
      danger: {
        background: "#fef2f2",
        border: "1px solid #fca5a5",
        icon: "!",
        color: "#dc2626",
      },
      warning: {
        background: "#fffbeb",
        border: "1px solid #fcd34d",
        icon: "!",
        color: "#d97706",
      },
      info: {
        background: "#eff6ff",
        border: "1px solid #93c5fd",
        icon: "i",
        color: "#2563eb",
      },
      success: {
        background: "#f0fdf4",
        border: "1px solid #86efac",
        icon: "✓",
        color: "#16a34a",
      },
    };
    return styles[severity] || styles.info;
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Notifications</h3>
        {onClose && (
          <button onClick={onClose} style={closeButtonStyle}>
            ×
          </button>
        )}
      </div>
      <div style={listStyle}>
        {visibleNotifications.map((notification) => {
          const style = getSeverityStyle(notification.severity);
          return (
            <div
              key={notification.id}
              style={{
                ...notificationStyle,
                background: style.background,
                border: style.border,
              }}
            >
              <div style={contentStyle}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                  <div style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: style.color,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    flexShrink: 0,
                  }}>
                    {style.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: style.color, marginBottom: "0.25rem" }}>
                      {notification.title}
                    </div>
                    <div style={{ color: "#64748b", fontSize: "0.9rem" }}>
                      {notification.message}
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDismiss(notification.id)}
                style={dismissButtonStyle}
                title="Dismiss"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const containerStyle = {
  position: "fixed",
  top: "90px",
  right: "20px",
  width: "420px",
  maxHeight: "650px",
  background: "#fff",
  borderRadius: "16px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
  zIndex: 1000,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  border: "1px solid #e2e8f0",
};

const headerStyle = {
  padding: "1.25rem 1.5rem",
  borderBottom: "1px solid #e2e8f0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#f8fafc",
};

const closeButtonStyle = {
  background: "none",
  border: "none",
  fontSize: "1.5rem",
  cursor: "pointer",
  color: "#64748b",
  padding: "0",
  width: "24px",
  height: "24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const listStyle = {
  padding: "0.5rem",
  overflowY: "auto",
  maxHeight: "500px",
};

const notificationStyle = {
  padding: "1rem",
  borderRadius: "12px",
  marginBottom: "0.75rem",
  display: "flex",
  alignItems: "flex-start",
  gap: "0.75rem",
  position: "relative",
  transition: "all 0.2s",
};

const contentStyle = {
  flex: 1,
};

const dismissButtonStyle = {
  background: "none",
  border: "none",
  fontSize: "1.2rem",
  cursor: "pointer",
  color: "#94a3b8",
  padding: "0",
  width: "20px",
  height: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

export default NotificationCenter;

