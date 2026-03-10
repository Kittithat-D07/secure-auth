import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Auth.css";

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
      setError(err.response?.data?.message || "Login failed");
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
          <h1>Welcome back</h1>
          <p>Sign in to your account</p>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <div style={{ textAlign: "right", marginTop: -8 }}>
            <Link to="/forgot-password" style={{ color: "#4f6ef7", fontSize: "13px", textDecoration: "none" }}>Forgot password?</Link>
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <span className="spinner" /> : "Sign In"}
          </button>
        </form>
        <p className="auth-link">Don't have an account? <Link to="/register">Sign up</Link></p>
      </div>
    </div>
  );
}
