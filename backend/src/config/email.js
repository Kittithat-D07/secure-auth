const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const sendOTPEmail = async (to, name, code, type = "verify") => {
  const isVerify = type === "verify";
  const subject = isVerify
    ? "✅ Verify your email — SecureAuth"
    : "🔐 Your 2FA code — SecureAuth";
  const title = isVerify ? "Verify Your Email" : "Two-Factor Authentication";
  const desc = isVerify
    ? "Enter this code to verify your email address. Valid for 10 minutes."
    : "Enter this code to complete your login. Valid for 10 minutes.";

  await transporter.sendMail({
    from: `"SecureAuth" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 20px">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#1a1a2e;border-radius:20px;overflow:hidden;border:1px solid #2a2a4a">
        <tr>
          <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px;text-align:center">
            <div style="font-size:36px;margin-bottom:8px">⬡</div>
            <div style="color:white;font-size:24px;font-weight:800;letter-spacing:2px">SecureAuth</div>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 32px">
            <h2 style="color:#e2e8f0;font-size:22px;margin:0 0 8px">${title}</h2>
            <p style="color:#64748b;margin:0 0 4px;font-size:15px">Hi <strong style="color:#94a3b8">${name}</strong>,</p>
            <p style="color:#64748b;margin:0 0 32px;font-size:14px;line-height:1.6">${desc}</p>
            <div style="background:#0f172a;border:2px solid #4f46e5;border-radius:16px;padding:28px;text-align:center;margin-bottom:32px">
              <div style="font-size:42px;font-weight:800;letter-spacing:16px;color:#818cf8;font-family:monospace">${code}</div>
            </div>
            <p style="color:#475569;font-size:13px;margin:0;text-align:center">
              ⏱ Expires in <strong style="color:#94a3b8">10 minutes</strong> &nbsp;|&nbsp; 
              🔒 If you didn't request this, ignore this email.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#111827;padding:20px 32px;text-align:center;border-top:1px solid #1e293b">
            <p style="color:#374151;font-size:12px;margin:0">© 2026 SecureAuth — Portfolio Project</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
    `,
  });
};

const sendResetPasswordEmail = async (to, name, resetUrl) => {
  await transporter.sendMail({
    from: `"SecureAuth" <${process.env.GMAIL_USER}>`,
    to,
    subject: "🔑 Reset your password — SecureAuth",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 20px">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#1a1a2e;border-radius:20px;overflow:hidden;border:1px solid #2a2a4a">
        <tr>
          <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px;text-align:center">
            <div style="font-size:36px;margin-bottom:8px">⬡</div>
            <div style="color:white;font-size:24px;font-weight:800;letter-spacing:2px">SecureAuth</div>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 32px">
            <h2 style="color:#e2e8f0;font-size:22px;margin:0 0 8px">Reset Your Password</h2>
            <p style="color:#64748b;margin:0 0 4px;font-size:15px">Hi <strong style="color:#94a3b8">${name}</strong>,</p>
            <p style="color:#64748b;margin:0 0 32px;font-size:14px;line-height:1.6">
              Someone requested a password reset for your account. Click the button below to set a new password. This link expires in <strong style="color:#94a3b8">1 hour</strong>.
            </p>
            <div style="text-align:center;margin-bottom:32px">
              <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:white;text-decoration:none;padding:16px 40px;border-radius:12px;font-weight:700;font-size:16px">
                Reset Password
              </a>
            </div>
            <p style="color:#475569;font-size:12px;text-align:center;word-break:break-all;margin:0">
              Or copy this link: <span style="color:#6366f1">${resetUrl}</span>
            </p>
            <p style="color:#475569;font-size:13px;text-align:center;margin:20px 0 0">
              🔒 If you didn't request this, you can safely ignore this email.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#111827;padding:20px 32px;text-align:center;border-top:1px solid #1e293b">
            <p style="color:#374151;font-size:12px;margin:0">© 2026 SecureAuth — Portfolio Project</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
    `,
  });
};

module.exports = { sendOTPEmail, sendResetPasswordEmail };
