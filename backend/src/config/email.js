const Brevo = require('@getbrevo/brevo');

// แก้ไขการสร้าง instance ให้ถูกต้องตาม SDK เวอร์ชันปัจจุบัน
const apiInstance = new Brevo.TransactionalEmailsApi();

// วิธีการเซต API Key ที่ถูกต้อง
apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

const sendOTPEmail = async (to, name, code, type = "verify") => {
  const isVerify = type === "verify";
  const subject = isVerify ? "✅ Verify your email — SecureAuth" : "🔐 Your 2FA code — SecureAuth";
  const title = isVerify ? "Verify Your Email" : "Two-Factor Authentication";
  const desc = isVerify 
    ? "Enter this code to verify your email address. Valid for 10 minutes." 
    : "Enter this code to complete your login. Valid for 10 minutes.";

  const sendSmtpEmail = new Brevo.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.sender = { "name": "SecureAuth", "email": "dew201102@gmail.com" }; // เมลที่ใช้สมัคร Brevo
  sendSmtpEmail.to = [{ "email": to, "name": name }];
  
  sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#0f0f0f;font-family:sans-serif">
      <div style="background:#0f0f0f;padding:40px 20px;text-align:center">
        <div style="background:#1a1a2e;border-radius:20px;padding:40px;display:inline-block;border:1px solid #2a2a4a;max-width:480px">
          <h2 style="color:#e2e8f0;margin-top:0">${title}</h2>
          <p style="color:#64748b">Hi <strong>${name}</strong>,</p>
          <p style="color:#64748b">${desc}</p>
          <div style="background:#0f172a;border:2px solid #4f46e5;padding:20px;border-radius:16px;margin:20px 0">
            <span style="font-size:32px;letter-spacing:10px;color:#818cf8;font-weight:bold">${code}</span>
          </div>
          <p style="color:#475569;font-size:12px">© 2026 SecureAuth — Portfolio Project</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Brevo: Email sent successfully. MessageId: ${data.body.messageId}`);
  } catch (error) {
    // การดึง error message จาก Brevo SDK ต้องใช้ .response.body
    console.error("❌ Brevo Error:", error.response ? JSON.stringify(error.response.body) : error.message);
  }
};

const sendResetPasswordEmail = async (to, name, resetUrl) => {
  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = "🔑 Reset your password — SecureAuth";
  sendSmtpEmail.sender = { "name": "SecureAuth", "email": "dew201102@gmail.com" };
  sendSmtpEmail.to = [{ "email": to, "name": name }];
  
  sendSmtpEmail.htmlContent = `
    <div style="text-align:center;padding:40px;background:#0f0f0f;color:white;">
      <h2>Reset Your Password</h2>
      <p>Hi ${name}, click the link below to reset your password:</p>
      <div style="margin: 30px 0;">
        <a href="${resetUrl}" style="background:#4f46e5;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;">Reset Password</a>
      </div>
      <p style="font-size:12px;color:#64748b;">If you didn't request this, please ignore this email.</p>
    </div>
  `;

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Brevo: Reset email sent. MessageId: ${data.body.messageId}`);
  } catch (error) {
    console.error("❌ Brevo Error:", error.response ? JSON.stringify(error.response.body) : error.message);
  }
};

module.exports = { sendOTPEmail, sendResetPasswordEmail };