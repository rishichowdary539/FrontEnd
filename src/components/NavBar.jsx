import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const NavBar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get user from localStorage first
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setLoading(false);
      } catch (e) {
        console.error("Error parsing stored user:", e);
      }
    }

    // Fetch fresh user data from API
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authAPI.getCurrentUser();
        const userData = response.data;
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (err) {
        console.error("Error fetching user:", err);
        // If 401, user is not authenticated, clear stored user
        if (err.response?.status === 401) {
          localStorage.removeItem("user");
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Extract username from email (part before @)
  const getUsername = (email) => {
    if (!email) return "User";
    return email.split("@")[0];
  };

  return (
    <header className="card" style={{ 
      display: "flex", 
      alignItems: "center", 
      gap: "1.5rem",
      padding: "1.25rem 1.5rem",
      marginBottom: "0",
    }}>
      <div>
        <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>Smart Expense Tracker</h2>
        <p style={{ margin: "0.25rem 0 0 0", color: "var(--muted)", fontSize: "0.875rem" }}>Finance & Economic Cloud Project</p>
      </div>
      {!loading && user && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.5rem 1rem",
          background: "#f8fafc",
          borderRadius: "8px",
          marginLeft: "auto",
          marginRight: "1rem",
        }}>
          {user.profile_image_url ? (
            <img
              src={user.profile_image_url}
              alt={getUsername(user.email)}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "var(--primary)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: "0.875rem",
            }}>
              {getUsername(user.email).charAt(0).toUpperCase()}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0f172a" }}>
              {getUsername(user.email)}
            </span>
            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
              {user.email}
            </span>
          </div>
        </div>
      )}
      <nav style={{ marginLeft: user ? "0" : "auto", display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <Link 
          to="/dashboard" 
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            fontSize: "0.9rem",
            fontWeight: 500,
            color: "#475569",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f1f5f9";
            e.currentTarget.style.color = "var(--primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#475569";
          }}
        >
          Dashboard
        </Link>
        <Link 
          to="/add"
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            fontSize: "0.9rem",
            fontWeight: 500,
            color: "#475569",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f1f5f9";
            e.currentTarget.style.color = "var(--primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#475569";
          }}
        >
          Add Expense
        </Link>
        <Link 
          to="/report"
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            fontSize: "0.9rem",
            fontWeight: 500,
            color: "#475569",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f1f5f9";
            e.currentTarget.style.color = "var(--primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#475569";
          }}
        >
          Monthly Reports
        </Link>
        <Link 
          to="/settings"
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            fontSize: "0.9rem",
            fontWeight: 500,
            color: "#475569",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f1f5f9";
            e.currentTarget.style.color = "var(--primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#475569";
          }}
        >
          Settings
        </Link>
      </nav>
      {!loading && user && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.5rem 1rem",
          background: "#f8fafc",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
        }}>
          {user.profile_image_url ? (
            <img
              src={user.profile_image_url}
              alt={getUsername(user.email)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            />
          ) : (
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "var(--primary)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: "0.875rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}>
              {getUsername(user.email).charAt(0).toUpperCase()}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", minWidth: "120px" }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0f172a", lineHeight: "1.2" }}>
              {getUsername(user.email)}
            </span>
            <span style={{ fontSize: "0.75rem", color: "#64748b", lineHeight: "1.2" }}>
              {user.email.length > 20 ? user.email.substring(0, 20) + "..." : user.email}
            </span>
          </div>
        </div>
      )}
      <button
        onClick={handleLogout}
        style={{
          background: "var(--danger)",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "0.625rem 1.25rem",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: "0.9rem",
          transition: "all 0.2s",
        }}
      >
        Logout
      </button>
    </header>
  );
};

export default NavBar;

