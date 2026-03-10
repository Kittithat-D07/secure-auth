import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import "./Dashboard.css";

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/admin/stats").then((r) => setStats(r.data.data));
    api.get("/admin/users").then((r) => setUsers(r.data.data));
  }, []);

  const handleRoleChange = async (id, role) => {
    await api.patch(`/admin/users/${id}/role`, { role });
    setUsers(users.map((u) => u.id === id ? { ...u, role } : u));
  };

  const handleToggleStatus = async (id) => {
    const res = await api.patch(`/admin/users/${id}/status`);
    setUsers(users.map((u) => u.id === id ? { ...u, isActive: res.data.data.isActive } : u));
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dash-container">
      <div className="dash-bg" />
      <nav className="dash-nav">
        <div className="dash-nav-logo">⬡ SecureAuth</div>
        <div className="dash-nav-right">
          <button className="nav-admin-btn" onClick={() => navigate("/dashboard")}>Dashboard</button>
          <div className="nav-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <button className="nav-logout" onClick={async () => { await logout(); navigate("/login"); }}>Sign out</button>
        </div>
      </nav>
      <main className="dash-main">
        <div className="dash-hero">
          <div className="dash-badge">👑 Admin Panel</div>
          <h1>User <span>Management</span></h1>
        </div>
        {stats && (
          <div className="admin-stats">
            <div className="stat-card"><div className="stat-icon">👥</div><div className="stat-label">Total Users</div><div className="stat-value">{stats.totalUsers}</div></div>
            <div className="stat-card"><div className="stat-icon">👑</div><div className="stat-label">Admins</div><div className="stat-value">{stats.totalAdmins}</div></div>
            <div className="stat-card"><div className="stat-icon">✅</div><div className="stat-label">Active</div><div className="stat-value">{stats.activeUsers}</div></div>
            <div className="stat-card"><div className="stat-icon">🆕</div><div className="stat-label">New Today</div><div className="stat-value">{stats.newToday}</div></div>
          </div>
        )}
        <div className="admin-table-wrap">
          <div className="admin-table-header">
            <h2>All Users</h2>
            <input className="search-input" placeholder="Search name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td style={{ color: "#e2e8f0", fontWeight: 500 }}>{u.name}</td>
                  <td style={{ color: "#94a3b8" }}>{u.email}</td>
                  <td><span className={`badge ${u.role === "ADMIN" ? "badge-admin" : "badge-user"}`}>{u.role}</span></td>
                  <td><span className={`badge ${u.isActive ? "badge-active" : "badge-inactive"}`}>{u.isActive ? "Active" : "Disabled"}</span></td>
                  <td>
                    <button className="action-btn" onClick={() => handleRoleChange(u.id, u.role === "ADMIN" ? "USER" : "ADMIN")}>
                      {u.role === "ADMIN" ? "→ User" : "→ Admin"}
                    </button>
                    <button className="action-btn" onClick={() => handleToggleStatus(u.id)}>
                      {u.isActive ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
