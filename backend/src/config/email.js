const Brevo = require('@getbrevo/brevo');

// จุดที่ต้องระวังที่สุด: ต้องดึง TransactionalEmailsApi ออกจาก Brevo ก่อน
const apiInstance = new Brevo.TransactionalEmailsApi();

// วิธีการเซต API Key ที่ถูกต้องของ Brevo
apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

const sendOTPEmail = async (to, name, code, type = "verify") => {
  const isVerify = type === "verify";
  const subject = isVerify ? "✅ Verify your email — SecureAuth" : "🔐 Your 2FA code — SecureAuth";
  
  // สร้าง Object สำหรับส่งเมล
  const sendSmtpEmail = new Brevo.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.sender = { "name": "SecureAuth", "email": "dew201102@gmail.com" };
  sendSmtpEmail.to = [{ "email": to, "name": name }];
  sendSmtpEmail.htmlContent = `
    <div style="font-family: sans-serif; padding: 20px; background: #0f0f0f; color: #fff;">
      <h2>Hi ${name},</h2>
      <p>Your OTP code is: <strong style="font-size: 24px; color: #4f46e5;">${code}</strong></p>
      <p>This code is valid for 10 minutes.</p>
    </div>
  `;

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Brevo: Email Sent ID:", data.body.messageId);
  } catch (error) {
    // แก้ไขการดึง error มาโชว์ให้ละเอียดขึ้น
    console.error("❌ Brevo Error Details:", error.response ? JSON.stringify(error.response.body) : error.message);
  }
};

const sendResetPasswordEmail = async (to, name, resetUrl) => {
  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = "🔑 Reset your password — SecureAuth";
  sendSmtpEmail.sender = { "name": "SecureAuth", "email": "dew201102@gmail.com" };
  sendSmtpEmail.to = [{ "email": to, "name": name }];
  sendSmtpEmail.htmlContent = `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>Reset Password</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
    </div>
  `;

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Brevo: Reset Link Sent");
  } catch (error) {
    console.error("❌ Brevo Reset Error:", error.message);
  }
};

module.exports = { sendOTPEmail, sendResetPasswordEmail };