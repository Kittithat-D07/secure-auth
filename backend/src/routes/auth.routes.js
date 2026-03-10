const express = require("express");
const router = express.Router();
const {
  register, login, verifyEmailOTP, verify2FA, resendOTP,
  forgotPassword, resetPassword, refreshAccessToken, logout,
  getMe, getActivity,
} = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { authLimiter } = require("../middleware/rateLimiter");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               email: { type: string, example: user@example.com }
 *               password: { type: string, example: password123 }
 *               name: { type: string, example: John Doe }
 *     responses:
 *       201: { description: OTP sent to email }
 *       400: { description: Validation error }
 */
router.post("/register", authLimiter, register);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify email OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               code: { type: string, example: "123456" }
 *     responses:
 *       200: { description: Email verified }
 */
router.post("/verify-otp", verifyEmailOTP);

/**
 * @swagger
 * /auth/resend-otp:
 *   post:
 *     summary: Resend OTP code
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               type: { type: string, enum: [verify, 2fa] }
 *     responses:
 *       200: { description: OTP resent }
 */
router.post("/resend-otp", authLimiter, resendOTP);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: 2FA OTP sent to email }
 */
router.post("/login", authLimiter, login);

/**
 * @swagger
 * /auth/verify-2fa:
 *   post:
 *     summary: Verify 2FA OTP and get JWT tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               code: { type: string }
 *     responses:
 *       200: { description: Login successful, returns accessToken }
 */
router.post("/verify-2fa", authLimiter, verify2FA);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Send password reset link to email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200: { description: Reset link sent }
 */
router.post("/forgot-password", authLimiter, forgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using token from email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Password reset successful }
 */
router.post("/reset-password", resetPassword);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token using cookie
 *     tags: [Auth]
 *     responses:
 *       200: { description: New access token }
 */
router.post("/refresh", refreshAccessToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout and revoke tokens
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Logged out }
 */
router.post("/logout", logout);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user info
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: User data }
 */
router.get("/me", verifyToken, getMe);

/**
 * @swagger
 * /auth/activity:
 *   get:
 *     summary: Get user activity log
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Activity logs }
 */
router.get("/activity", verifyToken, getActivity);

module.exports = router;
