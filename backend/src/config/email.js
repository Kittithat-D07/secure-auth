const axios = require("axios");

const sendOTPEmail = async (to, name, code, type = "verify") => {
  const isVerify = type === "verify";
  const subject = isVerify ? "Verify your email — SecureAuth" : "Your 2FA code — SecureAuth";
  const title = isVerify ? "Verify Your Email" : "Two-Factor Authentication";
  const desc = isVerify ? "Enter this code to verify your email address." : "Enter this code to complete your login.";

  await axios.post("https://api.brevo.com/v3/smtp/email", {
    sender: { email: "dew201102@gmail.com", name: "SecureAuth" },
    to: [{ email: to, name }],
    subject,
    htmlContent: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#080c14;padding:40px;border-radius:16px">
        <h1 style="color:#f1f5f9;font-size:24px;margin-bottom:8px">⬡ SecureAuth</h1>
        <h2 style="color:#e2e8f0;font-size:20px;margin-bottom:8px">${title}</h2>
        <p style="color:#94a3b8;margin-bottom:4px">Hi <strong style="color:#f1f5f9">${name}</strong>,</p>
        <p style="color:#94a3b8;margin-bottom:32px">${desc}</p>
        <div style="background:#0f172a;border:1px solid #1e293b;border-radius:12px;padding:24px;text-align:center;margin-bottom:32px">
          <div style="font-size:36px;font-weight:700;letter-spacing:12px;color:#4f6ef7">${code}</div>
        </div>
        <p style="color:#64748b;font-size:13px">This code expires in <strong style="color:#94a3b8">10 minutes</strong>.</p>
        <p style="color:#64748b;font-size:13px">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  }, {
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
    },
  });
};

const sendResetPasswordEmail = async (to, name, resetUrl) => {
  await axios.post("https://api.brevo.com/v3/smtp/email", {
    sender: { email: "a47a09001@smtp-brevo.com", name: "SecureAuth" },
    to: [{ email: to, name }],
    subject: "Reset your password — SecureAuth",
    htmlContent: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#080c14;padding:40px;border-radius:16px">
        <h1 style="color:#f1f5f9;font-size:24px;margin-bottom:8px">⬡ SecureAuth</h1>
        <h2 style="color:#e2e8f0;font-size:20px;margin-bottom:8px">Reset Your Password</h2>
        <p style="color:#94a3b8;margin-bottom:4px">Hi <strong style="color:#f1f5f9">${name}</strong>,</p>
        <p style="color:#94a3b8;margin-bottom:32px">Click the button below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#4f6ef7,#7c3aed);color:white;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:600;font-size:15px;margin-bottom:32px">Reset Password</a>
        <p style="color:#64748b;font-size:13px">If you didn't request this, you can safely ignore this email.</p>
        <p style="color:#334155;font-size:12px;margin-top:16px;word-break:break-all">${resetUrl}</p>
      </div>
    `,
  }, {
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
    },
  });
};

module.exports = { sendOTPEmail, sendResetPasswordEmail };