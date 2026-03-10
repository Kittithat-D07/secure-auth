import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [cur, setCur] = useState("");
  const [newPw, setNewPw] = useState("");
  const [conPw, setConPw] = useState("");
  const [profileMsg, setProfileMsg] = useState(null);
  const [pwMsg, setPwMsg] = useState(null);
  const [loadP, setLoadP] = useState(false);
  const [loadPw, setLoadPw] = useState(false);

  const updateProfile = async (e) => {
    e.preventDefault(); setLoadP(true); setProfileMsg(null);
    try {
      await api.patch("/users/profile", { name });
      setProfileMsg({ ok: true, text: "Profile updated successfully!" });
    } catch (err) {
      setProfileMsg({ ok: false, text: err.response?.data?.message || "Failed to update" });
    } finally { setLoadP(false); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (newPw !== conPw) return setPwMsg({ ok: false, text: "Passwords do not match" });
    setLoadPw(true); setPwMsg(null);
    try {
      await api.patch("/users/change-password", { currentPassword: cur, newPassword: newPw });
      setPwMsg({ ok: true, text: "Password changed successfully!" });
      setCur(""); setNewPw(""); setConPw("");
    } catch (err) {
      setPwMsg({ ok: false, text: err.response?.data?.message || "Failed to change password" });
    } finally { setLoadPw(false); }
  };

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
          <h1 className="page-title">My <span>Profile</span></h1>
          <p className="page-sub">Manage your account settings</p>
        </div>
        <div className="grid-2">
          {/* Profile Info */}
          <div className="card">
            <div className="card-title">Personal Information</div>
            <div className="user-chip">
              <div className="user-chip-av">{user?.name?.[0]?.toUpperCase()}</div>
              <div>
                <div className="user-chip-name">{user?.name}</div>
                <div className="user-chip-email">{user?.email}</div>
                <span className={`role-badge ${user?.role === "ADMIN" ? "role-admin" : "role-user"}`}>{user?.role}</span>
              </div>
            </div>
            {profileMsg && <div className={`msg ${profileMsg.ok ? "msg-ok" : "msg-err"}`}>{profileMsg.ok ? "✅" : "⚠️"} {profileMsg.text}</div>}
            <form onSubmit={updateProfile}>
              <div className="profile-field"><label>Display Name</label><input value={name} onChange={(e) => setName(e.target.value)} required /></div>
              <div className="profile-field"><label>Email</label><input value={user?.email} disabled /></div>
              <button type="submit" className="btn-primary" disabled={loadP} style={{ marginTop: 8 }}>
                {loadP ? <><span className="spinner" /> Saving...</> : "Save Changes"}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="card">
            <div className="card-title">Change Password</div>
            {user?.googleId && !user?.password ? (
              <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>Your account uses Google login. No password to change.</p>
            ) : (
              <>
                {pwMsg && <div className={`msg ${pwMsg.ok ? "msg-ok" : "msg-err"}`}>{pwMsg.ok ? "✅" : "⚠️"} {pwMsg.text}</div>}
                <form onSubmit={changePassword}>
                  <div className="profile-field"><label>Current Password</label><input type="password" value={cur} onChange={(e) => setCur(e.target.value)} placeholder="••••••••" required /></div>
                  <div className="profile-field"><label>New Password</label><input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Min. 6 characters" required /></div>
                  <div className="profile-field"><label>Confirm New Password</label><input type="password" value={conPw} onChange={(e) => setConPw(e.target.value)} placeholder="Re-enter new password" required /></div>
                  <button type="submit" className="btn-primary" disabled={loadPw} style={{ marginTop: 8 }}>
                    {loadPw ? <><span className="spinner" /> Changing...</> : "Change Password"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
