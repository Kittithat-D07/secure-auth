# 🔐 SecureAuth

Full-stack authentication system built with **Node.js + React + PostgreSQL**.  
Featuring JWT, Email OTP 2FA, Role-based Access Control, Redis token blacklist, and more.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat&logo=redis&logoColor=white)

---

## 🌐 Live Demo

| | URL |
|---|---|
| 🖥️ Frontend | https://secure-aut.netlify.app |
| 📚 Swagger Docs | https://secure-auth-production-18f9.up.railway.app/api/docs |

> **⚠️ DEV MODE:** OTP code and reset link are displayed directly on the frontend for demo purposes.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔑 JWT Authentication | Access Token (15min) + Refresh Token (7 days) with rotation |
| 📧 Email OTP 2FA | 6-digit OTP sent on every login |
| ✅ Email Verification | OTP sent on registration |
| 🔒 Token Blacklist | Redis-based logout — instant access token revocation |
| 👑 Role-Based Access | USER / ADMIN roles enforced at middleware level |
| 🛡️ Rate Limiting | 10 attempts / 15 min per IP |
| 🔑 Forgot/Reset Password | Secure time-limited reset link via email |
| 📋 Activity Log | Track LOGIN / LOGOUT / REGISTER events per user |
| 🔄 Token Rotation | New token pair on every refresh, old tokens invalidated |
| 🌐 Google OAuth2 | Sign in with Google |
| 📚 Swagger UI | Interactive API docs at `/api/docs` |

---

## 🏗️ Tech Stack

**Backend:** Node.js, Express.js, Prisma ORM, PostgreSQL, Redis, Resend, JWT, Swagger

**Frontend:** React 18, React Router v6, Axios (with auto token refresh interceptor), Custom CSS

**Infrastructure:** Railway (Backend + DB + Redis), Netlify (Frontend)

---

## 📁 Project Structure

```
secure-auth/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── config/
│       │   ├── email.js          # Resend email service
│       │   ├── redis.js          # Redis connection
│       │   └── swagger.js        # Swagger config
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   └── admin.controller.js
│       ├── middleware/
│       │   ├── auth.middleware.js   # JWT verification + Role check
│       │   ├── rateLimiter.js       # Rate limiting
│       │   └── errorHandler.js      # Global error handler
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── user.routes.js
│       │   └── admin.routes.js
│       └── index.js
└── frontend/
    ├── public/
    │   ├── index.html
    │   └── _redirects              # Netlify SPA routing fix
    └── src/
        ├── api/
        │   └── axios.js            # Axios instance + interceptors
        ├── context/
        │   └── AuthContext.js      # Global auth state
        ├── components/
        │   └── ProtectedRoute.js   # Route guards
        ├── pages/
        │   ├── Login.js
        │   ├── Register.js
        │   ├── OTPVerify.js        # DEV MODE: shows OTP on screen
        │   ├── ForgotPassword.js   # DEV MODE: shows reset link on screen
        │   ├── ResetPassword.js
        │   ├── Dashboard.js
        │   ├── Profile.js
        │   ├── ActivityLog.js
        │   └── AdminPanel.js
        └── index.css
```

---

## 🔄 Auth Flow

```
Register → OTP Email → Verify Email → Login → 2FA OTP → JWT Tokens
                                                              ↓
                                         Access Token (15min) + Refresh Token (7d Cookie)
                                                              ↓
                                         Auto refresh via Axios interceptor
```

### Register
```
POST /api/auth/register
→ Create user (isEmailVerified: false)
→ Send OTP to email
POST /api/auth/verify-otp
→ isEmailVerified: true → Can now login
```

### Login (2FA)
```
POST /api/auth/login
→ Verify credentials
→ Send 2FA OTP to email
POST /api/auth/verify-2fa
→ Access Token (15min) + Refresh Token (7d HttpOnly Cookie)
```

### Token Refresh
```
POST /api/auth/refresh
→ Validate refresh token from cookie
→ Delete old token (Rotation)
→ Issue new Access Token + Refresh Token
```

### Logout
```
POST /api/auth/logout
→ Blacklist Access Token in Redis
→ Delete Refresh Token from DB
→ Clear cookie
```

---

## 🚀 Getting Started (Local)

### Prerequisites
- Node.js >= 18
- PostgreSQL
- Redis
- Resend account (for email)

### 1. Clone the repository
```bash
git clone https://github.com/Kittithat-D07/secure-auth.git
cd secure-auth
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# แก้ไข .env ใส่ค่าที่ถูกต้อง
npx prisma migrate dev --name init
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 4. Environment Variables (Backend)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/secure_auth_db"
REDIS_URL="redis://localhost:6379"

ACCESS_TOKEN_SECRET="your-strong-secret-key"
REFRESH_TOKEN_SECRET="your-strong-refresh-secret"

RESEND_API_KEY="re_xxxxxxxxxxxxxxxxx"

PORT=5000
NODE_ENV=development
CLIENT_URL="http://localhost:3000"

GOOGLE_CLIENT_ID="your-google-client-id"
```

### 5. Environment Variables (Frontend)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## ☁️ Deployment

### Backend — Railway
1. Create new project on [Railway](https://railway.app)
2. Add **PostgreSQL** and **Redis** services
3. Deploy from GitHub
4. Set environment variables:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
ACCESS_TOKEN_SECRET=your-secret
REFRESH_TOKEN_SECRET=your-refresh-secret
RESEND_API_KEY=re_xxxxxxxxx
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-app.netlify.app
```

5. Set start command:
```
npx prisma migrate deploy && node src/index.js
```

### Frontend — Netlify
1. Connect GitHub repo on [Netlify](https://netlify.com)
2. Set build settings:

```
Base directory:    frontend
Build command:     npm run build
Publish directory: frontend/build
```

3. Set environment variable:
```
REACT_APP_API_URL=https://your-backend.railway.app/api
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register + send OTP |
| POST | `/api/auth/verify-otp` | Verify email OTP |
| POST | `/api/auth/resend-otp` | Resend OTP |
| POST | `/api/auth/login` | Login → send 2FA OTP |
| POST | `/api/auth/verify-2fa` | Verify 2FA → get JWT |
| POST | `/api/auth/google` | Google OAuth2 |
| POST | `/api/auth/forgot-password` | Send reset link |
| POST | `/api/auth/reset-password` | Reset password |
| POST | `/api/auth/refresh` | Rotate refresh token |
| POST | `/api/auth/logout` | Revoke tokens |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/auth/activity` | Activity log |

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

---

## 🔒 Security Concepts

1. **Short-lived JWT** — 15min access token minimizes exposure window
2. **Refresh Token Rotation** — old token deleted on every refresh, reuse detection ready
3. **HttpOnly Cookie** — refresh token inaccessible to JavaScript (XSS protection)
4. **Token Blacklist** — Redis stores revoked access tokens until expiry
5. **Email OTP 2FA** — every login requires real-time email verification
6. **Rate Limiting** — brute force protection (10 req / 15 min per IP)
7. **bcrypt hashing** — passwords hashed with salt rounds = 12
8. **CORS** — restricted to frontend origin only

---

## 👨‍💻 Author

Built as a portfolio project to demonstrate production-grade authentication system design.

> GitHub: [@Kittithat-D07](https://github.com/Kittithat-D07)
