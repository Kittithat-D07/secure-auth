import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/admin/stats"), api.get("/admin/users")])
      .then(([s, u]) => { setStats(s.data.data); setUsers(u.data.data); })
      .finally(() => setLoading(false));
  }, []);

  const changeRole = async (id, currentRole) => {
    const role = currentRole === "ADMIN" ? "USER" : "ADMIN";
    try {
      await api.patch(`/admin/users/${id}/role`, { role });
      setUsers(users.map((u) => u.id === id ? { ...u, role } : u));
    } catch (err) { alert(err.response?.data?.message || "Failed"); }
  };

  const toggleStatus = async (id, isActive) => {
    try {
      await api.patch(`/admin/users/${id}/status`);
      setUsers(users.map((u) => u.id === id ? { ...u, isActive: !isActive } : u));
    } catch (err) { alert(err.response?.data?.message || "Failed"); }
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const fmt = (d) => new Date(d).toLocaleDateString("en-GB");

  return (
    <div className="app-wrap">
      <div className="app-bg" />
      <nav className="navbar">
        <div className="navbar-logo">⬡ SecureAuth</div>
        <div className="navbar-right">
          <button className="btn-ghost" onClick={() => navigate("/dashboard")}>Dashboard</button>
          <div className="nav-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <button className="btn-danger" onClick={async () => { await logout(); navigate("/login"); }}>Sign out</button>
        </div>
      </nav>
      <main className="page-content">
        <div className="page-hero">
          <div className="page-badge">👑 Admin Panel</div>
          <h1 className="page-title">User <span>Management</span></h1>
          <p className="page-sub">Manage all users, roles, and access</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid-4" style={{ marginBottom: 32 }}>
            <div className="stat-card"><div className="stat-icon">👥</div><div className="stat-label">Total Users</div><div className="stat-value">{stats.totalUsers}</div></div>
            <div className="stat-card"><div className="stat-icon">👑</div><div className="stat-label">Admins</div><div className="stat-value">{stats.totalAdmins}</div></div>
            <div className="stat-card"><div className="stat-icon">✅</div><div className="stat-label">Active</div><div className="stat-value">{stats.activeUsers}</div></div>
            <div className="stat-card"><div className="stat-icon">🆕</div><div className="stat-label">New Today</div><div className="stat-value">{stats.newToday}</div></div>
          </div>
        )}

        {/* User Table */}
        <div className="table-wrap">
          <div className="table-head">
            <div className="card-title" style={{ margin: 0 }}>All Users ({filtered.length})</div>
            <input
              className="search-box"
              placeholder="🔍 Search name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {loading ? (
            <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>Loading users...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td style={{ color: "#e2e8f0", fontWeight: 500 }}>{u.name}</td>
                    <td style={{ color: "#94a3b8" }}>{u.email}</td>
                    <td><span className={`badge ${u.role === "ADMIN" ? "badge-admin" : "badge-user"}`}>{u.role}</span></td>
                    <td><span className={`badge ${u.isActive ? "badge-active" : "badge-inactive"}`}>{u.isActive ? "Active" : "Disabled"}</span></td>
                    <td style={{ color: "#64748b" }}>{fmt(u.createdAt)}</td>
                    <td>
                      {u.id !== user?.id && (
                        <>
                          <button className="action-btn" onClick={() => changeRole(u.id, u.role)}>
                            {u.role === "ADMIN" ? "→ User" : "→ Admin"}
                          </button>
                          <button className="action-btn" onClick={() => toggleStatus(u.id, u.isActive)}>
                            {u.isActive ? "Disable" : "Enable"}
                          </button>
                        </>
                      )}
                      {u.id === user?.id && <span style={{ color: "#475569", fontSize: 12 }}>You</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
