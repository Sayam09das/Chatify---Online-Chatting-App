// Centralized API configuration
// Use import.meta.env.VITE_API_URL for the backend URL

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Auth endpoints
  login: `${API_URL}/auth/login`,
  register: `${API_URL}/auth/register`,
  googleAuth: `${API_URL}/api/auth/google`,
  logout: `${API_URL}/auth/logout`,
  getMe: `${API_URL}/auth/me`,
  updateProfileImage: `${API_URL}/auth/update-profile-image`,
  verifyEmail: `${API_URL}/auth/verify-email`,
  resendVerification: `${API_URL}/auth/resend-verification`,
  forgotPassword: `${API_URL}/auth/forgot-password`,
  resetPassword: `${API_URL}/auth/reset-password`,
  updatePassword: `${API_URL}/auth/password`,
  
  // User endpoints
  getUsers: `${API_URL}/auth/users`,
  search: `${API_URL}/api/search`,
  
  // Socket.io
  socketUrl: API_URL,
};

export default API_URL;

