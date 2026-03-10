import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return setError("Password must be at least 6 characters");
    setLoading(true); setError("");
    try {
      const res = await api.post("/auth/register", { email, password, name });
      const devOTP = res.data?.data?.devOTP;
      navigate("/otp", { state: { email, type: "verify", devOTP } });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="orb orb1" /><div className="orb orb2" /><div className="orb orb3" />
      </div>
      <div className="auth-card">
        <div className="auth-logo-wrap"><div className="auth-logo">⬡</div></div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Start your secure journey</p>
        {error && <div className="auth-error">⚠️ {error}</div>}
        <form onSubmit={handleSubmit} className="form">
          <div className="field">
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required autoFocus />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" required />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <><span className="spinner" /> Creating account...</> : "Create Account →"}
          </button>
        </form>
        <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}