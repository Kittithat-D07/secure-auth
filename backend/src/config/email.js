const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // ใช้ 465 สำหรับ SSL
  secure: true, // ต้องเป็น true เมื่อใช้ port 465
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  // เพิ่มการตั้งค่าเพื่อป้องกัน Timeout
  connectionTimeout: 15000, // 15 วินาที
  greetingTimeout: 15000,
  socketTimeout: 20000,
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

  try {
    await transporter.sendMail({
      from: `"SecureAuth" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
        <body style="margin:0;padding:0;background:#0f0f0f;font-family:'Segoe UI',Arial,sans-serif">
          <div style="font-size:42px;font-weight:800;letter-spacing:16px;color:#818cf8;font-family:monospace">${code}</div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("❌ Email Error:", error);
    // ไม่ throw error เพื่อไม่ให้แอปค้าง แต่เราจะเห็นสาเหตุใน Log
  }
};

const sendResetPasswordEmail = async (to, name, resetUrl) => {
  try {
    await transporter.sendMail({
      from: `"SecureAuth" <${process.env.GMAIL_USER}>`,
      to,
      subject: "🔑 Reset your password — SecureAuth",
      html: `
        `,
    });
  } catch (error) {
    console.error("❌ Reset Password Email Error:", error);
  }
};

module.exports = { sendOTPEmail, sendResetPasswordEmail };