import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./Auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-container">
      <div className="auth-bg">
        <div className="auth-orb orb1" /><div className="auth-orb orb2" /><div className="auth-orb orb3" />
      </div>
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo"><span>⬡</span></div>
          <h1>Forgot password</h1>
          <p>We'll send a reset link to your email</p>
        </div>
        {sent ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📧</div>
            <p style={{ color: "#34d399", marginBottom: "8px", fontWeight: 600 }}>Reset link sent!</p>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>
              Check your inbox at <strong style={{ color: "#f1f5f9" }}>{email}</strong>
            </p>
            <Link to="/login" style={{ color: "#4f6ef7", fontSize: "14px" }}>← Back to login</Link>
          </div>
        ) : (
          <>
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? <span className="spinner" /> : "Send Reset Link"}
              </button>
            </form>
            <p className="auth-link"><Link to="/login">← Back to login</Link></p>
          </>
        )}
      </div>
    </div>
  );
}
