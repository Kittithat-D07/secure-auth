# 🔐 SecureAuth

Full-stack authentication system built with **Node.js + React + PostgreSQL**. Featuring JWT, Email OTP 2FA, Role-based Access Control, Redis token blacklist, and more.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat&logo=redis&logoColor=white)

## 🌐 Live Demo

| | URL |
|---|---|
| 🖥️ Frontend | https://secure-auth.netlify.app |
| ⚙️ Backend API | https://secure-auth-production-2a24.up.railway.app |
| 📚 Swagger Docs | https://secure-auth-production-2a24.up.railway.app/api/docs |

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔑 JWT Authentication | Access Token (15min) + Refresh Token (7 days) with rotation |
| 📧 Email OTP 2FA | Real 6-digit OTP sent to Gmail on every login |
| ✅ Email Verification | OTP sent on registration via Gmail |
| 🔒 Token Blacklist | Redis-based logout — instant access token revocation |
| 👑 Role-Based Access | USER / ADMIN roles enforced at middleware level |
| 🛡️ Rate Limiting | 10 attempts / 15 min per IP via express-rate-limit |
| 🔑 Forgot/Reset Password | Secure time-limited reset link via email |
| 📋 Activity Log | Track LOGIN / LOGOUT / REGISTER events per user |
| 🔄 Token Rotation | New token pair on every refresh, old tokens invalidated |
| 📚 Swagger UI | Interactive API documentation at /api/docs |

## 🏗️ Tech Stack

**Backend:** Node.js, Express.js, Prisma ORM, PostgreSQL, Redis, Nodemailer (Gmail), JWT, Swagger

**Frontend:** React 18, React Router v6, Axios (with auto token refresh interceptor), Custom CSS

## 📁 Project Structure

```
secure-auth/
├── backend/
│   ├── prisma/schema.prisma
│   ├── src/
│   │   ├── config/      email.js, redis.js, swagger.js
│   │   ├── controllers/ auth.controller.js, admin.controller.js
│   │   ├── middleware/  auth.middleware.js, rateLimiter.js, errorHandler.js
│   │   ├── routes/      auth.routes.js, user.routes.js, admin.routes.js
│   │   └── index.js
│   └── package.json
└── frontend/
    ├── public/          index.html, _redirects
    ├── src/
    │   ├── api/         axios.js
    │   ├── context/     AuthContext.js
    │   ├── components/  ProtectedRoute.js
    │   ├── pages/       Login, Register, OTPVerify, ForgotPassword,
    │   │                ResetPassword, Dashboard, Profile,
    │   │                ActivityLog, AdminPanel
    │   └── index.css
    └── package.json
```

## 🔄 Auth Flow

```
Register → OTP Email → Verify → Login → 2FA OTP Email → JWT Tokens
                                                              ↓
                                              Access (15m) + Refresh (7d Cookie)
                                                              ↓
                                              Auto refresh via Axios interceptor
```

## 🔒 Security Concepts

1. **Short-lived JWT** — 15min access token minimizes exposure window
2. **Refresh Token Rotation** — old token deleted on every refresh, reuse detection
3. **HttpOnly Cookie** — refresh token inaccessible to JavaScript (XSS protection)
4. **Token Blacklist** — Redis stores revoked tokens until expiry
5. **Email OTP 2FA** — every login requires real email verification
6. **Rate Limiting** — brute force protection on auth endpoints

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register + send OTP email |
| POST | `/api/auth/verify-otp` | Verify email OTP |
| POST | `/api/auth/resend-otp` | Resend OTP |
| POST | `/api/auth/login` | Login → send 2FA OTP |
| POST | `/api/auth/verify-2fa` | Verify 2FA → get JWT |
| POST | `/api/auth/forgot-password` | Send reset link |
| POST | `/api/auth/reset-password` | Reset with token |
| POST | `/api/auth/refresh` | Rotate refresh token |
| POST | `/api/auth/logout` | Revoke tokens |
| GET | `/api/auth/me` | Current user |
| GET | `/api/auth/activity` | Activity log |
| GET/PATCH | `/api/users/profile` | Get/update profile |
| PATCH | `/api/users/change-password` | Change password |
| GET | `/api/admin/stats` | Dashboard stats (ADMIN) |
| GET | `/api/admin/users` | List users (ADMIN) |
| PATCH | `/api/admin/users/:id/role` | Change role (ADMIN) |
| PATCH | `/api/admin/users/:id/status` | Toggle status (ADMIN) |

## 👨‍💻 Author

Built as a portfolio project to demonstrate production-grade authentication system design and implementation.
