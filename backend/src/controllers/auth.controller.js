require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const redisClient = require("../config/redis");
const { sendOTPEmail, sendResetPasswordEmail } = require("../config/email");

const prisma = new PrismaClient();

// ── helpers ──────────────────────────────────────────────────────────────────
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const generateAccessToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

const generateRefreshToken = (user) =>
  jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const logActivity = async (userId, action, req) => {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        ip: req.ip || req.connection?.remoteAddress,
        userAgent: req.headers["user-agent"],
      },
    });
  } catch {}
};

const createAndSendOTP = async (email, name, type) => {
  // 1. ลบ OTP เก่า
  await prisma.oTP.deleteMany({ where: { email, type } });
  
  // 2. สร้าง OTP ใหม่ลง Database
  const code = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await prisma.oTP.create({ data: { email, code, type, expiresAt } });
  
  // 3. ส่ง Email แบบ Non-blocking (เอา await ออกเพื่อให้ API ตอบกลับทันที)
  sendOTPEmail(email, name, code, type).catch(err => 
    console.error("📧 Background Email Error:", err.message)
  );
};

// ── controllers ──────────────────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name)
      return res.status(400).json({ success: false, message: "All fields are required" });
    if (password.length < 6)
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
      select: { id: true, email: true, name: true },
    });

    // เรียกฟังก์ชันที่แก้ใหม่ (ไม่รอส่งเมลเสร็จ)
    await createAndSendOTP(email, name, "verify");
    await logActivity(user.id, "REGISTER", req);

    res.status(201).json({
      success: true,
      message: "Registration successful! Check your email for OTP.",
      data: { email },
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmailOTP = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const otp = await prisma.oTP.findFirst({ where: { email, type: "verify" } });
    if (!otp || otp.code !== code || otp.expiresAt < new Date())
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });

    await prisma.user.update({ where: { email }, data: { isEmailVerified: true } });
    await prisma.oTP.deleteMany({ where: { email, type: "verify" } });

    res.json({ success: true, message: "Email verified! You can now login." });
  } catch (error) {
    next(error);
  }
};

const resendOTP = async (req, res, next) => {
  try {
    const { email, type } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    
    await createAndSendOTP(email, user.name, type);
    res.json({ success: true, message: "OTP resent successfully" });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password are required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    if (!user.isActive)
      return res.status(403).json({ success: false, message: "Your account has been disabled" });
    if (!user.isEmailVerified)
      return res.status(403).json({ success: false, message: "Please verify your email first" });

    await createAndSendOTP(email, user.name, "2fa");
    res.json({ success: true, message: "OTP sent to your email.", data: { email, requireOTP: true } });
  } catch (error) {
    next(error);
  }
};

const verify2FA = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const otp = await prisma.oTP.findFirst({ where: { email, type: "2fa" } });
    if (!otp || otp.code !== code || otp.expiresAt < new Date())
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });

    await prisma.oTP.deleteMany({ where: { email, type: "2fa" } });
    const user = await prisma.user.findUnique({ where: { email } });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt } });
    await logActivity(user.id, "LOGIN", req);
    setRefreshTokenCookie(res, refreshToken);

    res.json({
      success: true,
      data: {
        accessToken,
        user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar },
      },
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.json({ success: true, message: "If this email exists, a reset link has been sent." });

    await prisma.emailToken.deleteMany({ where: { email, type: "reset" } });
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    const emailToken = await prisma.emailToken.create({ data: { email, type: "reset", expiresAt } });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${emailToken.token}`;
    
    // ส่ง Reset Email แบบ Non-blocking เช่นกัน
    sendResetPasswordEmail(email, user.name, resetUrl).catch(err => 
      console.error("📧 Password Reset Email Error:", err.message)
    );

    res.json({ success: true, message: "If this email exists, a reset link has been sent." });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!password || password.length < 6)
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });

    const emailToken = await prisma.emailToken.findUnique({ where: { token } });
    if (!emailToken || emailToken.type !== "reset" || emailToken.expiresAt < new Date())
      return res.status(400).json({ success: false, message: "Invalid or expired reset link" });

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.update({
      where: { email: emailToken.email },
      data: { password: hashed },
    });
    await prisma.emailToken.delete({ where: { token } });
    await logActivity(user.id, "PASSWORD_RESET", req);

    res.json({ success: true, message: "Password reset successfully! You can now login." });
  } catch (error) {
    next(error);
  }
};

const refreshAccessToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token)
      return res.status(401).json({ success: false, message: "Refresh token required" });

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
    if (!storedToken || storedToken.expiresAt < new Date())
      return res.status(401).json({ success: false, message: "Invalid or expired refresh token" });

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });

    const user = storedToken.user;
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.refreshToken.create({ data: { token: newRefreshToken, userId: user.id, expiresAt } });
    setRefreshTokenCookie(res, newRefreshToken);

    res.json({ success: true, data: { accessToken: newAccessToken } });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];
    const refreshToken = req.cookies?.refreshToken;

    if (accessToken) {
      try {
        const decoded = jwt.decode(accessToken);
        const ttl = decoded?.exp - Math.floor(Date.now() / 1000);
        if (ttl > 0) await redisClient.setEx(`blacklist:${accessToken}`, ttl, "revoked");
      } catch {}
    }

    if (refreshToken) {
      const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
      if (stored) {
        await logActivity(stored.userId, "LOGOUT", req);
        await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
      }
    }

    res.clearCookie("refreshToken");
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, email: true, name: true, role: true,
        avatar: true, isEmailVerified: true, createdAt: true,
      },
    });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const getActivity = async (req, res, next) => {
  try {
    const logs = await prisma.activityLog.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    res.json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register, login, verifyEmailOTP, verify2FA, resendOTP,
  forgotPassword, resetPassword, refreshAccessToken, logout,
  getMe, getActivity,
};