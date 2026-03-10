# 🔐 SecureAuth

A full-stack authentication system built with Node.js, React, and PostgreSQL. Featuring JWT, OTP 2FA, Role-based Access Control, and more.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat&logo=redis&logoColor=white)

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔑 JWT Authentication | Access Token (15min) + Refresh Token (7 days) |
| 🔄 Refresh Token Rotation | Old tokens invalidated on every refresh |
| 📧 Email OTP 2FA | 6-digit OTP required on every login |
| ✅ Email Verification | OTP sent on registration |
| 🔒 Token Blacklist | Logout immediately invalidates tokens via Redis |
| 👑 Role-based Access | USER / ADMIN roles with protected routes |
| 🛡️ Rate Limiting | Brute force protection via Redis (10 req/15min) |
| 🔑 Forgot/Reset Password | Secure reset link via email |
| 📋 Activity Log | Track login/logout/register history |
| 🌐 Google OAuth2 | Sign in with Google |

## 🏗️ Tech Stack

### Backend
- **Runtime:** Node.js + Express.js
- **Database:** PostgreSQL + Prisma ORM
- **Cache:** Redis (Rate Limiting + Token Blacklist)
- **Email:** Resend
- **Auth:** JWT + Google OAuth2

### Frontend
- **Framework:** React 18
- **Routing:** React Router v6
- **HTTP Client:** Axios (with interceptors for auto token refresh)
- **Styling:** Custom CSS with Google Fonts

## 📁 Project Structure

```
secure-auth/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   └── src/
│       ├── config/
│       │   ├── redis.js            # Redis connection
│       │   └── email.js            # Resend email service
│       ├── controllers/
│       │   ├── auth.controller.js  # Auth logic
│       │   └── admin.controller.js # Admin logic
│       ├── middleware/
│       │   ├── auth.middleware.js  # JWT verification + Role check
│       │   ├── rateLimiter.js      # Rate limiting
│       │   └── errorHandler.js     # Global error handler
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── user.routes.js
│       │   └── admin.routes.js
│       └── index.js
└── frontend/
    └── src/
        ├── api/
        │   └── axios.js            # Axios instance + interceptors
        ├── context/
        │   └── AuthContext.js      # Global auth state
        ├── components/
        │   └── ProtectedRoute.js   # Route guards
        └── pages/
            ├── Login.js
            ├── Register.js
            ├── OTPVerify.js
            ├── ForgotPassword.js
            ├── ResetPassword.js
            ├── Dashboard.js
            ├── Profile.js
            ├── ActivityLog.js
            └── AdminPanel.js
```

## 🔄 Authentication Flow

### Register
```
User fills form → POST /api/auth/register
→ Account created (isEmailVerified: false)
→ OTP sent to email
→ User enters OTP → POST /api/auth/verify-otp
→ isEmailVerified: true → Can now login
```

### Login (with 2FA)
```
User fills email/password → POST /api/auth/login
→ Credentials verified
→ OTP sent to email
→ User enters OTP → POST /api/auth/verify-2fa
→ Access Token (15min) + Refresh Token (7 days, HttpOnly Cookie)
```

### Token Refresh
```
Access Token expired → POST /api/auth/refresh
→ Refresh Token validated from Cookie
→ Old Refresh Token deleted (Rotation)
→ New Access Token + New Refresh Token issued
```

### Logout
```
POST /api/auth/logout
→ Access Token added to Redis blacklist (until expiry)
→ Refresh Token deleted from DB
→ Cookie cleared
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- PostgreSQL
- Redis
- Resend account (for email)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# แก้ไข .env ใส่ค่าที่ถูกต้อง
npx prisma migrate dev --name init
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

### Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/secure_auth_db"
ACCESS_TOKEN_SECRET="your-secret-key"
REFRESH_TOKEN_SECRET="your-refresh-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
REDIS_URL="redis://localhost:6379"
PORT=5000
CLIENT_URL="http://localhost:3000"
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxx"
RESEND_FROM="onboarding@resend.dev"
```

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new account |
| POST | `/api/auth/verify-otp` | Verify email with OTP |
| POST | `/api/auth/resend-otp` | Resend OTP |
| POST | `/api/auth/login` | Login (returns requireOTP) |
| POST | `/api/auth/verify-2fa` | Verify 2FA OTP → get JWT |
| POST | `/api/auth/google` | Google OAuth2 login |
| POST | `/api/auth/forgot-password` | Send reset link |
| POST | `/api/auth/reset-password` | Reset password |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/auth/activity` | Get activity log |

### User (requires auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get profile |
| PATCH | `/api/users/profile` | Update profile |
| PATCH | `/api/users/change-password` | Change password |

### Admin (requires ADMIN role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard stats |
| GET | `/api/admin/users` | List all users |
| PATCH | `/api/admin/users/:id/role` | Change user role |
| PATCH | `/api/admin/users/:id/status` | Enable/disable user |

## 🔒 Security Concepts

### 1. JWT Access Token (Short-lived)
Token อายุสั้น 15 นาที ลดความเสี่ยงถ้าถูกขโมย

### 2. Refresh Token Rotation
ทุกครั้งที่ refresh จะได้ token ใหม่และอันเก่าจะถูกลบทันที ถ้ามีคนขโมย token ไปใช้จะรู้ได้ทันที

### 3. HttpOnly Cookie
Refresh Token เก็บใน HttpOnly Cookie ทำให้ JavaScript ฝั่ง client อ่านไม่ได้ ป้องกัน XSS

### 4. Token Blacklist (Redis)
หลัง logout Access Token จะถูก blacklist ใน Redis จนกว่าจะหมดอายุ

### 5. Email OTP 2FA
ทุก login ต้องยืนยัน OTP ทาง email เพิ่มความปลอดภัยอีกชั้น

### 6. Rate Limiting (Redis)
Login endpoint จำกัด 10 ครั้ง/15 นาที ต่อ IP ป้องกัน brute force

## 👨‍💻 Author

Built for portfolio purposes to demonstrate authentication system design and implementation.
