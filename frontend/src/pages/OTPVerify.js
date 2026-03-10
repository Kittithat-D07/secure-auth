import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function OTPVerify() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [devOTP, setDevOTP] = useState("");
  const refs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { email, type, devOTP: initialDevOTP } = location.state || {};
  const isVerify = type === "verify";

  useEffect(() => {
    if (!email) navigate("/login");
    refs.current[0]?.focus();
    if (initialDevOTP) setDevOTP(initialDevOTP);
  }, [email, navigate, initialDevOTP]);

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      refs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) return setError("Please enter all 6 digits");
    setLoading(true); setError("");
    try {
      if (isVerify) {
        await api.post("/auth/verify-otp", { email, code });
        setSuccess("Email verified! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        const res = await api.post("/auth/verify-2fa", { email, code });
        const { accessToken, user } = res.data.data;
        localStorage.setItem("accessToken", accessToken);
        setUser(user);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      refs.current[0]?.focus();
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    setResending(true); setError(""); setSuccess("");
    try {
      const res = await api.post("/auth/resend-otp", { email, type });
      const newDevOTP = res.data?.data?.devOTP;
      if (newDevOTP) setDevOTP(newDevOTP);
      setSuccess("New OTP sent!");
    } catch {
      setError("Failed to resend OTP. Please try again.");
    } finally { setResending(false); }
  };

  const handleCopyOTP = () => {
    if (devOTP) {
      navigator.clipboard.writeText(devOTP);
      // auto-fill OTP boxes
      setOtp(devOTP.split(""));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="orb orb1" /><div className="orb orb2" /><div className="orb orb3" />
      </div>
      <div className="auth-card">
        <div className="auth-logo-wrap"><div className="auth-logo">⬡</div></div>
        <h1 className="auth-title">{isVerify ? "Verify Email" : "Two-Factor Auth"}</h1>
        <p className="auth-sub">
          Enter the 6-digit code sent to<br />
          <strong style={{ color: "#e2e8f0" }}>{email}</strong>
        </p>

        {/* DEV MODE BANNER */}
        {devOTP && (
          <div style={{
            background: "linear-gradient(135deg, #1e3a5f, #1a2a4a)",
            border: "1px solid #3b82f6",
            borderRadius: 12,
            padding: "12px 16px",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}>
            <div>
              <div style={{ color: "#93c5fd", fontSize: 11, fontWeight: 700, marginBottom: 4, letterSpacing: 1 }}>
                YOUR OTP
              </div>
              <div style={{ color: "#fff", fontSize: 24, fontWeight: 800, letterSpacing: 8, fontFamily: "monospace" }}>
                {devOTP}
              </div>
            </div>
            <button
              onClick={handleCopyOTP}
              style={{
                background: "#3b82f6",
                border: "none",
                borderRadius: 8,
                color: "#fff",
                padding: "8px 14px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Auto Fill ✓
            </button>
          </div>
        )}

        {error && <div className="auth-error">⚠️ {error}</div>}
        {success && <div className="auth-success">✅ {success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="otp-row" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (refs.current[i] = el)}
                className="otp-box"
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
              />
            ))}
          </div>
          <button type="submit" className="btn-primary" disabled={loading || otp.join("").length !== 6}>
            {loading ? <><span className="spinner" /> Verifying...</> : "Verify Code →"}
          </button>
        </form>
        <p className="auth-footer">
          Didn't receive the code?{" "}
          <button
            onClick={handleResend}
            disabled={resending}
            style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}
          >
            {resending ? "Sending..." : "Resend OTP"}
          </button>
        </p>
      </div>
    </div>
  );
}