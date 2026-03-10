import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import "./Auth.css";

export default function OTPVerify() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const refs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { email, type } = location.state || {};

  const isVerify = type === "verify";

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val.slice(-1);
    setOtp(newOtp);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) return setError("Please enter all 6 digits");
    setLoading(true); setError("");
    try {
      if (isVerify) {
        await api.post("/auth/verify-otp", { email, code });
        navigate("/login");
      } else {
        const res = await api.post("/auth/verify-2fa", { email, code });
        const { accessToken, user } = res.data.data;
        localStorage.setItem("accessToken", accessToken);
        setUser(user);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    try {
      await api.post("/auth/resend-otp", { email, type });
      setError("");
      alert("OTP resent!");
    } catch { setError("Failed to resend OTP"); }
  };

  return (
    <div className="auth-container">
      <div className="auth-bg">
        <div className="auth-orb orb1" /><div className="auth-orb orb2" /><div className="auth-orb orb3" />
      </div>
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo"><span>⬡</span></div>
          <h1>{isVerify ? "Verify your email" : "Two-Factor Auth"}</h1>
          <p>Enter the 6-digit code sent to <strong style={{ color: "#f1f5f9" }}>{email}</strong></p>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="otp-inputs">
            {otp.map((digit, i) => (
              <input
                key={i} ref={(el) => (refs.current[i] = el)}
                className="otp-input" type="text" inputMode="numeric"
                maxLength={1} value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
              />
            ))}
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <span className="spinner" /> : "Verify Code"}
          </button>
        </form>
        <p className="auth-link">
          Didn't receive the code?{" "}
          <button onClick={handleResend} style={{ background: "none", border: "none", color: "#4f6ef7", cursor: "pointer", fontSize: "14px", fontWeight: 500 }}>
            Resend
          </button>
        </p>
      </div>
    </div>
  );
}
