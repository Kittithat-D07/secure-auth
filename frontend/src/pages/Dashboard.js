import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => { await logout(); navigate("/login"); };

  const features = [
    { icon: "🔑", title: "JWT Access Token", desc: "Short-lived token (15 min), sent via Authorization header on every request" },
    { icon: "🔄", title: "Refresh Token Rotation", desc: "Old tokens deleted immediately on refresh — reuse detection built in" },
    { icon: "📧", title: "Email OTP 2FA", desc: "Every login requires a 6-digit OTP sent to your real email inbox" },
    { icon: "🔒", title: "Token Blacklist", desc: "Logout immediately revokes access token via Redis — no replay attacks" },
    { icon: "👑", title: "Role-Based Access", desc: "USER / ADMIN roles enforced at middleware level on every protected route" },
    { icon: "🛡️", title: "Rate Limiting", desc: "10 attempts per 15 minutes per IP — brute force protection via Redis" },
  ];

  return (
    <div className="app-wrap">
      <div className="app-bg" />
      <nav className="navbar">
        <div className="navbar-logo">⬡ SecureAuth</div>
        <div className="navbar-right">
          {user?.role === "ADMIN" && <button className="btn-ghost" onClick={() => navigate("/admin")}>👑 Admin</button>}
          <button className="btn-ghost" onClick={() => navigate("/profile")}>Profile</button>
          <button className="btn-ghost" onClick={() => navigate("/activity")}>Activity</button>
          <div className="nav-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <button className="btn-danger" onClick={handleLogout}>Sign out</button>
        </div>
      </nav>
      <main className="page-content">
        <div className="page-hero">
          <div className="page-badge">{user?.role === "ADMIN" ? "👑 Administrator" : "👤 User"}</div>
          <h1 className="page-title">Hello, <span>{user?.name}</span> 👋</h1>
          <p className="page-sub">You're securely authenticated via Email OTP 2FA</p>
        </div>

        <div className="grid-4" style={{ marginBottom: 32 }}>
          <div className="stat-card" style={{ cursor: "pointer" }} onClick={() => navigate("/profile")}>
            <div className="stat-icon">👤</div>
            <div className="stat-label">Account</div>
            <div style={{ color: "#e2e8f0", fontWeight: 600, marginTop: 4 }}>Edit Profile</div>
          </div>
          <div className="stat-card" style={{ cursor: "pointer" }} onClick={() => navigate("/activity")}>
            <div className="stat-icon">📋</div>
            <div className="stat-label">Activity</div>
            <div style={{ color: "#e2e8f0", fontWeight: 600, marginTop: 4 }}>View Logs</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-label">2FA Status</div>
            <div style={{ color: "#34d399", fontWeight: 600, marginTop: 4 }}>Active</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🛡️</div>
            <div className="stat-label">Role</div>
            <div style={{ color: "#818cf8", fontWeight: 600, marginTop: 4 }}>{user?.role}</div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Security Features Implemented</div>
          <div className="grid-2" style={{ gap: 16 }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: 14 }}>
                <div style={{ fontSize: 24, flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{f.title}</div>
                  <div style={{ color: "#64748b", fontSize: 13, lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
