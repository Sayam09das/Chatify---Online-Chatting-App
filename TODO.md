# TODO: Google OAuth, Email Verification & Password Reset Implementation

## Phase 1: Backend Updates
- [x] 1.1 Update backend/firebase.js - Add Firebase Admin SDK and Auth config
- [x] 1.2 Create backend/utils/email.util.js - Email sending utility
- [x] 1.3 Update backend/controllers/auth.controller.js - Add OAuth, verify, forgot, reset handlers
- [x] 1.4 Update backend/routes/auth.routes.js - Add new routes
- [x] 1.5 Update backend/models/User.js - Add verification token fields

## Phase 2: Frontend Updates
- [x] 2.1 Update frontend/src/App.jsx - Add new routes
- [x] 2.2 Create frontend/src/components/ResetPasswordPage/ResetPasswordPage.jsx
- [x] 2.3 Create frontend/src/components/VerifyEmailPage/VerifyEmailPage.jsx
- [x] 2.4 Update frontend/src/components/LoginPage/LoginPage.jsx - Add Google Sign-In
- [x] 2.5 Update frontend/src/components/RegisterPage/RegisterPage.jsx - Add Google Sign-In
- [x] 2.6 Update frontend/src/components/ForgotPasswordPage/ForgotPasswordPage.jsx - Connect to API
- [x] 2.7 Create frontend/src/firebase.js - Firebase client config

## Phase 3: Configuration (REQUIRED)
- [ ] 3.1 Add required environment variables to .env (see below)
- [ ] 3.2 Test the implementation

## Required Environment Variables

Create a `.env` file in the backend folder with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/chatify

# JWT Secrets (generate strong random strings)
JWT_ACCESS_SECRET=your-super-secret-access-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
JWT_RESET_SECRET=your-super-secret-reset-key-min-32-chars
JWT_VERIFICATION_SECRET=your-super-secret-verification-key-min-32-chars

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5173

# SendGrid (for sending emails)
# Get your API key from https://sendgrid.com/
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com

# Firebase Admin (optional - for Google OAuth verification)
# If not set, the app will use mock mode for emails
FIREBASE_PROJECT_ID=chatify-app-156f9
```

## API Endpoints Added

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/google` | Google OAuth Login/Register |
| POST | `/api/auth/verify-email` | Verify email with token |
| POST | `/api/auth/resend-verification` | Resend verification email |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |

## Frontend Routes Added

| Path | Component | Description |
|------|-----------|-------------|
| `/reset-password` | ResetPasswordPage | Reset password with token |
| `/verify-email` | VerifyEmailPage | Verify email address |

