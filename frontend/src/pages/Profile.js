import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import "./Dashboard.css";
import "./Profile.css";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileMsg, setProfileMsg] = useState(null);
  const [passwordMsg, setPasswordMsg] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault(); setLoadingProfile(true); setProfileMsg(null);
    try {
      await api.patch("/users/profile", { name });
      setProfileMsg({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setProfileMsg({ type: "error", text: err.response?.data?.message || "Failed to update" });
    } finally { setLoadingProfile(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return setPasswordMsg({ type: "error", text: "Passwords do not match" });
    setLoadingPassword(true); setPasswordMsg(null);
    try {
      await api.patch("/users/change-password", { currentPassword, newPassword });
      setPasswordMsg({ type: "success", text: "Password changed successfully!" });
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err) {
      setPasswordMsg({ type: "error", text: err.response?.data?.message || "Failed to change password" });
    } finally { setLoadingPassword(false); }
  };

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
          <h1>My <span>Profile</span></h1>
          <p>Manage your account settings</p>
        </div>
        <div className="profile-grid">
          <div className="profile-card">
            <h2>Personal Info</h2>
            <div className="profile-avatar-section">
              <div className="profile-avatar">{user?.name?.[0]?.toUpperCase()}</div>
              <div>
                <div className="profile-name">{user?.name}</div>
                <div className="profile-email">{user?.email}</div>
                <span className={`role-chip ${user?.role?.toLowerCase()}`}>{user?.role}</span>
              </div>
            </div>
            {profileMsg && <div className={`profile-msg ${profileMsg.type}`}>{profileMsg.text}</div>}
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-group-p"><label>Display Name</label><input value={name} onChange={(e) => setName(e.target.value)} required /></div>
              <div className="form-group-p"><label>Email</label><input value={user?.email} disabled style={{ opacity: 0.5, cursor: "not-allowed" }} /></div>
              <button type="submit" className="profile-btn" disabled={loadingProfile}>{loadingProfile ? "Saving..." : "Save Changes"}</button>
            </form>
          </div>
          <div className="profile-card">
            <h2>Change Password</h2>
            {user?.googleId ? (
              <p style={{ color: "#64748b", fontSize: "14px" }}>Your account uses Google login — no password to change.</p>
            ) : (
              <>
                {passwordMsg && <div className={`profile-msg ${passwordMsg.type}`}>{passwordMsg.text}</div>}
                <form onSubmit={handleChangePassword} className="profile-form">
                  <div className="form-group-p"><label>Current Password</label><input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" required /></div>
                  <div className="form-group-p"><label>New Password</label><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min. 6 characters" required /></div>
                  <div className="form-group-p"><label>Confirm New Password</label><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter new password" required /></div>
                  <button type="submit" className="profile-btn" disabled={loadingPassword}>{loadingPassword ? "Changing..." : "Change Password"}</button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
