import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../api/axios";
import "./Auth.css";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setError("Passwords do not match");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    setLoading(true); setError("");
    try {
      await api.post("/auth/reset-password", { token, password });
      setDone(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally { setLoading(false); }
  };

  if (!token) return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <p style={{ color: "#f87171", marginBottom: 16 }}>Invalid reset link</p>
        <Link to="/login" style={{ color: "#4f6ef7", fontSize: "14px" }}>← Back to login</Link>
      </div>
    </div>
  );

  return (
    <div className="auth-container">
      <div className="auth-bg">
        <div className="auth-orb orb1" /><div className="auth-orb orb2" /><div className="auth-orb orb3" />
      </div>
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo"><span>⬡</span></div>
          <h1>Reset password</h1>
          <p>Enter your new password</p>
        </div>
        {done ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
            <p style={{ color: "#34d399", fontWeight: 600 }}>Password reset! Redirecting to login...</p>
          </div>
        ) : (
          <>
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>New Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" required />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter password" required />
              </div>
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? <span className="spinner" /> : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
