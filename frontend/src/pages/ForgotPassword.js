import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devResetUrl, setDevResetUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await api.post("/auth/forgot-password", { email });
      const url = res.data?.data?.devResetUrl;
      if (url) setDevResetUrl(url);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(devResetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpen = () => {
    window.open(devResetUrl, "_blank");
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="orb orb1" /><div className="orb orb2" /><div className="orb orb3" />
      </div>
      <div className="auth-card">
        <div className="auth-logo-wrap"><div className="auth-logo">⬡</div></div>
        <h1 className="auth-title">Forgot password?</h1>
        <p className="auth-sub">We'll send a reset link to your email</p>
        {sent ? (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📧</div>
            <p style={{ color: "#34d399", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Reset link sent!</p>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              Check your inbox at <strong style={{ color: "#e2e8f0" }}>{email}</strong>.<br />
              The link expires in 1 hour.
            </p>

            {/* DEV MODE — Reset Link */}
            {devResetUrl && (
              <div style={{
                background: "linear-gradient(135deg, #1e3a5f, #1a2a4a)",
                border: "1px solid #3b82f6",
                borderRadius: 12,
                padding: "16px",
                marginBottom: 20,
                textAlign: "left",
              }}>
                <div style={{ color: "#93c5fd", fontSize: 11, fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>
                  🧪 DEV MODE — RESET LINK
                </div>
                <p style={{ color: "#94a3b8", fontSize: 12, marginBottom: 12, wordBreak: "break-all", lineHeight: 1.5 }}>
                  {devResetUrl}
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={handleCopy}
                    style={{
                      flex: 1,
                      background: copied ? "#22c55e" : "#3b82f6",
                      border: "none",
                      borderRadius: 8,
                      color: "#fff",
                      padding: "10px",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                  >
                    {copied ? "✅ Copied!" : "📋 Copy Link"}
                  </button>
                  <button
                    onClick={handleOpen}
                    style={{
                      flex: 1,
                      background: "#7c3aed",
                      border: "none",
                      borderRadius: 8,
                      color: "#fff",
                      padding: "10px",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    🔗 Open Link
                  </button>
                </div>
              </div>
            )}

            <Link to="/login" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12, fontSize: 14, background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "white", textDecoration: "none" }}>
              ← Back to Login
            </Link>
          </div>
        ) : (
          <>
            {error && <div className="auth-error">⚠️ {error}</div>}
            <form onSubmit={handleSubmit} className="form">
              <div className="field">
                <label>Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoFocus />
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <><span className="spinner" /> Sending...</> : "Send Reset Link →"}
              </button>
            </form>
            <p className="auth-footer"><Link to="/login">← Back to login</Link></p>
          </>
        )}
      </div>
    </div>
  );
}