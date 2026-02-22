// Centralized API configuration
// Use import.meta.env.VITE_API_URL for the backend URL

const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost';
const API_PORT = import.meta.env.VITE_API_PORT || '3000';
const API_URL = import.meta.env.VITE_API_URL || `${API_HOST}:${API_PORT}`;

export const API_ENDPOINTS = {
  // Auth endpoints
  login: `${API_URL}/api/auth/login`,
  register: `${API_URL}/api/auth/register`,
  googleAuth: `${API_URL}/api/auth/google`,
  logout: `${API_URL}/api/auth/logout`,
  getMe: `${API_URL}/api/auth/me`,
  updateProfileImage: `${API_URL}/api/auth/update-profile-image`,
  verifyEmail: `${API_URL}/api/auth/verify-email`,
  resendVerification: `${API_URL}/api/auth/resend-verification`,
  forgotPassword: `${API_URL}/api/auth/forgot-password`,
  resetPassword: `${API_URL}/api/auth/reset-password`,
  updatePassword: `${API_URL}/api/auth/password`,
  
  // User endpoints
  getUsers: `${API_URL}/api/users`,
  getUserStatus: `${API_URL}/api/users/status`,
  search: `${API_URL}/api/search`,
  
  // Socket.io
  socketUrl: API_URL,
};

export default API_URL;
