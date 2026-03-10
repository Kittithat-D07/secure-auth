import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await api.post("/auth/login", { email, password });
      navigate("/otp", { state: { email, type: "2fa" } });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="orb orb1" /><div className="orb orb2" /><div className="orb orb3" />
      </div>
      <div className="auth-card">
        <div className="auth-logo-wrap"><div className="auth-logo">⬡</div></div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to your SecureAuth account</p>
        {error && <div className="auth-error">⚠️ {error}</div>}
        <form onSubmit={handleSubmit} className="form">
          <div className="field">
            <label>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoFocus />
          </div>
          <div className="field">
            <div className="field-row">
              <label>Password</label>
              <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
            </div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <><span className="spinner" /> Signing in...</> : "Sign In →"}
          </button>
        </form>
        <p className="auth-footer">Don't have an account? <Link to="/register">Create one</Link></p>
      </div>
    </div>
  );
}
