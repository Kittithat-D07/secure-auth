import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import "./Dashboard.css";
import "./Profile.css";

const ACTION_ICONS = {
  LOGIN: { icon: "🔓", color: "#34d399", label: "Login" },
  LOGOUT: { icon: "🔒", color: "#64748b", label: "Logout" },
  REGISTER: { icon: "✨", color: "#4f6ef7", label: "Register" },
  PASSWORD_RESET: { icon: "🔑", color: "#f59e0b", label: "Password Reset" },
};

export default function ActivityLog() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/auth/activity").then((res) => setLogs(res.data.data)).finally(() => setLoading(false));
  }, []);

  const formatTime = (dateStr) => new Date(dateStr).toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" });

  return (
    <div className="dash-container">
      <div className="dash-bg" />
      <nav className="dash-nav">
        <div className="dash-nav-logo">⬡ SecureAuth</div>
        <div className="dash-nav-right">
          <button className="nav-admin-btn" onClick={() => navigate("/dashboard")}>Dashboard</button>
          {user?.role === "ADMIN" && <button className="nav-admin-btn" onClick={() => navigate("/admin")}>Admin Panel</button>}
          <div className="nav-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <button className="nav-logout" onClick={async () => { await logout(); navigate("/login"); }}>Sign out</button>
        </div>
      </nav>
      <main className="dash-main">
        <div className="dash-hero">
          <h1>Activity <span>Log</span></h1>
          <p>Your recent account activity</p>
        </div>
        <div className="activity-card">
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Loading...</div>
          ) : logs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>No activity yet</div>
          ) : (
            <div className="activity-list">
              {logs.map((log) => {
                const action = ACTION_ICONS[log.action] || { icon: "📋", color: "#64748b", label: log.action };
                return (
                  <div key={log.id} className="activity-item">
                    <div className="activity-icon" style={{ background: `${action.color}20`, color: action.color }}>{action.icon}</div>
                    <div className="activity-info">
                      <div className="activity-action">{action.label}</div>
                      <div className="activity-meta">
                        {log.ip && <span>IP: {log.ip}</span>}
                      </div>
                    </div>
                    <div className="activity-time">{formatTime(log.createdAt)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
