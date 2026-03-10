const Brevo = require('@getbrevo/brevo');

// ตั้งค่า Brevo API
let apiInstance = new Brevo.TransactionalEmailsApi();
let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const sendOTPEmail = async (to, name, code, type = "verify") => {
  const isVerify = type === "verify";
  const subject = isVerify ? "✅ Verify your email — SecureAuth" : "🔐 Your 2FA code — SecureAuth";
  const title = isVerify ? "Verify Your Email" : "Two-Factor Authentication";
  const desc = isVerify 
    ? "Enter this code to verify your email address. Valid for 10 minutes." 
    : "Enter this code to complete your login. Valid for 10 minutes.";

  let sendSmtpEmail = new Brevo.SendSmtpEmail();
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.sender = { "name": "SecureAuth", "email": "dew201102@gmail.com" }; // เมลที่คุณใช้สมัคร Brevo
  sendSmtpEmail.to = [{ "email": to, "name": name }];
  
  // ใช้ HTML เดิมของคุณเป๊ะๆ
  sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#0f0f0f;font-family:'Segoe UI',Arial,sans-serif">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 20px">
        <tr><td align="center">
          <table width="480" cellpadding="0" cellspacing="0" style="background:#1a1a2e;border-radius:20px;overflow:hidden;border:1px solid #2a2a4a">
            <tr>
              <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px;text-align:center">
                <div style="font-size:36px;margin-bottom:8px;color:white">⬡</div>
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
  `;

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Brevo: OTP Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Brevo Error:", error.message);
  }
};

const sendResetPasswordEmail = async (to, name, resetUrl) => {
  let sendSmtpEmail = new Brevo.SendSmtpEmail();
  sendSmtpEmail.subject = "🔑 Reset your password — SecureAuth";
  sendSmtpEmail.sender = { "name": "SecureAuth", "email": "dew201102@gmail.com" };
  sendSmtpEmail.to = [{ "email": to, "name": name }];
  
  sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#0f0f0f;font-family:'Segoe UI',Arial,sans-serif">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 20px">
        <tr><td align="center">
          <table width="480" cellpadding="0" cellspacing="0" style="background:#1a1a2e;border-radius:20px;overflow:hidden;border:1px solid #2a2a4a">
            <tr>
              <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px;text-align:center">
                <div style="font-size:36px;margin-bottom:8px;color:white">⬡</div>
                <div style="color:white;font-size:24px;font-weight:800;letter-spacing:2px">SecureAuth</div>
              </td>
            </tr>
            <tr>
              <td style="padding:40px 32px">
                <h2 style="color:#e2e8f0;font-size:22px;margin:0 0 8px">Reset Your Password</h2>
                <p style="color:#64748b;margin:0 0 4px;font-size:15px">Hi <strong style="color:#94a3b8">${name}</strong>,</p>
                <p style="color:#64748b;margin:0 0 32px;font-size:14px;line-height:1.6">Click the button below to set a new password.</p>
                <div style="text-align:center;margin-bottom:32px">
                  <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:white;text-decoration:none;padding:16px 40px;border-radius:12px;font-weight:700;font-size:16px">Reset Password</a>
                </div>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Brevo: Reset email sent to ${to}`);
  } catch (error) {
    console.error("❌ Brevo Error:", error.message);
  }
};

module.exports = { sendOTPEmail, sendResetPasswordEmail };