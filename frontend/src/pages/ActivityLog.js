import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const ACTION_MAP = {
  LOGIN:          { icon: "🔓", color: "#34d399", label: "Login" },
  LOGOUT:         { icon: "🔒", color: "#64748b", label: "Logout" },
  REGISTER:       { icon: "✨", color: "#6366f1", label: "Register" },
  PASSWORD_RESET: { icon: "🔑", color: "#f59e0b", label: "Password Reset" },
};

export default function ActivityLog() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/auth/activity")
      .then((r) => setLogs(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fmt = (d) => new Date(d).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

  return (
    <div className="app-wrap">
      <div className="app-bg" />
      <nav className="navbar">
        <div className="navbar-logo">⬡ SecureAuth</div>
        <div className="navbar-right">
          <button className="btn-ghost" onClick={() => navigate("/dashboard")}>Dashboard</button>
          {user?.role === "ADMIN" && <button className="btn-ghost" onClick={() => navigate("/admin")}>👑 Admin</button>}
          <div className="nav-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <button className="btn-danger" onClick={async () => { await logout(); navigate("/login"); }}>Sign out</button>
        </div>
      </nav>
      <main className="page-content">
        <div className="page-hero">
          <h1 className="page-title">Activity <span>Log</span></h1>
          <p className="page-sub">Your recent account activity (last 20 events)</p>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 48, color: "#64748b" }}>Loading activity...</div>
          ) : logs.length === 0 ? (
            <div style={{ textAlign: "center", padding: 48, color: "#64748b" }}>No activity recorded yet</div>
          ) : (
            <div className="activity-list">
              {logs.map((log) => {
                const a = ACTION_MAP[log.action] || { icon: "📋", color: "#64748b", label: log.action };
                return (
                  <div key={log.id} className="activity-item">
                    <div className="activity-icon" style={{ background: `${a.color}20`, color: a.color }}>{a.icon}</div>
                    <div className="activity-info">
                      <div className="activity-action">{a.label}</div>
                      {log.ip && <div className="activity-ip">IP: {log.ip}</div>}
                    </div>
                    <div className="activity-time">{fmt(log.createdAt)}</div>
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
