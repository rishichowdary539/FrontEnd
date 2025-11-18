import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="card" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <div>
        <h2 style={{ margin: 0 }}>Smart Expense Tracker</h2>
        <p style={{ margin: 0, color: "var(--muted)" }}>Finance & Economic Cloud Project</p>
      </div>
      <nav style={{ marginLeft: "auto", display: "flex", gap: "1rem" }}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/add">Add Expense</Link>
        <Link to="/report">Monthly Reports</Link>
      </nav>
      <button
        onClick={handleLogout}
        style={{
          marginLeft: "1rem",
          background: "var(--danger)",
          color: "#fff",
          border: "none",
          borderRadius: "999px",
          padding: "0.5rem 1.4rem",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </header>
  );
};

export default NavBar;

