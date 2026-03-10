import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => { await logout(); navigate("/login"); };

  return (
    <div className="dash-container">
      <div className="dash-bg" />
      <nav className="dash-nav">
        <div className="dash-nav-logo">⬡ SecureAuth</div>
        <div className="dash-nav-right">
          {user?.role === "ADMIN" && <button className="nav-admin-btn" onClick={() => navigate("/admin")}>Admin Panel</button>}
          <button className="nav-admin-btn" onClick={() => navigate("/profile")}>Profile</button>
          <button className="nav-admin-btn" onClick={() => navigate("/activity")}>Activity</button>
          <div className="nav-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <button className="nav-logout" onClick={handleLogout}>Sign out</button>
        </div>
      </nav>
      <main className="dash-main">
        <div className="dash-hero">
          <div className="dash-badge">{user?.role === "ADMIN" ? "👑 Administrator" : "👤 User"}</div>
          <h1>Hello, <span>{user?.name}</span></h1>
          <p>You're successfully authenticated</p>
        </div>
        <div className="dash-cards">
          <div className="dash-card" onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>
            <div className="card-icon">👤</div>
            <div className="card-label">Profile</div>
            <div className="card-value">Edit your info</div>
          </div>
          <div className="dash-card" onClick={() => navigate("/activity")} style={{ cursor: "pointer" }}>
            <div className="card-icon">📋</div>
            <div className="card-label">Activity Log</div>
            <div className="card-value">View login history</div>
          </div>
          <div className="dash-card">
            <div className="card-icon">🛡️</div>
            <div className="card-label">Role</div>
            <div className="card-value">{user?.role}</div>
          </div>
          <div className="dash-card">
            <div className="card-icon">✅</div>
            <div className="card-label">2FA Status</div>
            <div className="card-value">Email OTP Active</div>
          </div>
        </div>
        <div className="dash-info">
          <h2>How this auth system works</h2>
          <div className="info-grid">
            <div className="info-item"><span className="info-num">01</span><div><h3>JWT Access Token</h3><p>Short-lived token (15 min) sent in Authorization header</p></div></div>
            <div className="info-item"><span className="info-num">02</span><div><h3>Refresh Token Rotation</h3><p>New token pair on each refresh, old tokens immediately invalidated</p></div></div>
            <div className="info-item"><span className="info-num">03</span><div><h3>Email OTP 2FA</h3><p>Every login requires a 6-digit OTP sent to your email</p></div></div>
            <div className="info-item"><span className="info-num">04</span><div><h3>Rate Limiting</h3><p>Login endpoint limited to 10 attempts per 15 minutes per IP</p></div></div>
          </div>
        </div>
      </main>
    </div>
  );
}
