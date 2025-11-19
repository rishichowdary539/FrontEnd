import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import Report from "./pages/Report";
import Lambda from "./pages/Lambda";
import Settings from "./pages/Settings";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/add"
          element={isAuthenticated() ? <AddExpense /> : <Navigate to="/login" />}
        />
        <Route
          path="/report"
          element={isAuthenticated() ? <Report /> : <Navigate to="/login" />}
        />
        <Route
          path="/lambda"
          element={isAuthenticated() ? <Lambda /> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={isAuthenticated() ? <Settings /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;

