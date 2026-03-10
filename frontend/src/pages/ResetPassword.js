import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../api/axios";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
          <p style={{ color: "#f87171", marginBottom: 16, fontWeight: 600 }}>Invalid reset link</p>
          <Link to="/forgot-password" style={{ color: "#6366f1" }}>Request a new one</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setError("Passwords do not match");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    setLoading(true); setError("");
    try {
      await api.post("/auth/reset-password", { token, password });
      setDone(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. Link may have expired.");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="orb orb1" /><div className="orb orb2" /><div className="orb orb3" />
      </div>
      <div className="auth-card">
        <div className="auth-logo-wrap"><div className="auth-logo">⬡</div></div>
        <h1 className="auth-title">Reset password</h1>
        <p className="auth-sub">Enter your new password below</p>
        {done ? (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <p style={{ color: "#34d399", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Password reset!</p>
            <p style={{ color: "#64748b", fontSize: 14 }}>Redirecting to login in 3 seconds...</p>
          </div>
        ) : (
          <>
            {error && <div className="auth-error">⚠️ {error}</div>}
            <form onSubmit={handleSubmit} className="form">
              <div className="field">
                <label>New Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" required autoFocus />
              </div>
              <div className="field">
                <label>Confirm New Password</label>
                <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter new password" required />
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <><span className="spinner" /> Resetting...</> : "Reset Password →"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
