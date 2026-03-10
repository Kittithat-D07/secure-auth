const express = require("express");
const router = express.Router();
const { register, login, verifyEmailOTP, verify2FA, resendOTP, forgotPassword, resetPassword, refreshAccessToken, logout, getMe, getActivity, googleLogin } = require("../controllers/auth.controller");
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
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *               name: { type: string }
 *     responses:
 *       201:
 *         description: OTP sent to email
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
 *               code: { type: string }
 *     responses:
 *       200:
 *         description: Email verified
 */
router.post("/verify-otp", verifyEmailOTP);

/**
 * @swagger
 * /auth/resend-otp:
 *   post:
 *     summary: Resend OTP
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: OTP resent
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
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: 2FA OTP sent
 */
router.post("/login", authLimiter, login);

/**
 * @swagger
 * /auth/verify-2fa:
 *   post:
 *     summary: Verify 2FA OTP → get JWT
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/verify-2fa", authLimiter, verify2FA);

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Google OAuth2 login
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/google", authLimiter, googleLogin);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Send password reset link
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Reset link sent
 */
router.post("/forgot-password", authLimiter, forgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password with token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Password reset successful
 */
router.post("/reset-password", resetPassword);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: New access token
 */
router.post("/refresh", refreshAccessToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out
 */
router.post("/logout", logout);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data
 */
router.get("/me", verifyToken, getMe);

/**
 * @swagger
 * /auth/activity:
 *   get:
 *     summary: Get activity log
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Activity logs
 */
router.get("/activity", verifyToken, getActivity);

module.exports = router;
