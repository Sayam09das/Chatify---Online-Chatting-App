import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axios from '@/config/axios';
import {
  MessageCircle, Mail, Lock, Eye, EyeOff,
  ArrowRight, Chrome, Smartphone, Shield, Zap,
} from 'lucide-react';
import { signInWithGoogle } from '../../firebase';
import { API_ENDPOINTS } from '../../config/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const validEmailDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];

  const features = [
    { icon: Shield, text: 'End-to-end encrypted' },
    { icon: Zap, text: 'Lightning fast' },
    { icon: MessageCircle, text: 'Group chats up to 256' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: '' });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    const domain = email.split('@')[1];
    if (!validEmailDomains.includes(domain))
      return 'Please use Gmail, Yahoo, Outlook, Hotmail or iCloud';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 4) return 'Password must be at least 4 characters';
    if (password.length > 12) return 'Password must not exceed 12 characters';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      return 'Password must contain at least one special character';
    if (!/\d/.test(password)) return 'Password must contain at least one number';
    return '';
  };

  const validateForm = () => {
    const errors = {};
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const response = await axios.post(API_ENDPOINTS.login, formData);
      const { user, token } = response.data;
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('senderId', user._id);
        if (token) {
          localStorage.setItem('token', token);
        }
        
        // Check if email is verified for local accounts
        if (!user.emailVerified && user.provider === 'local') {
          toast.warning('Please verify your email before continuing. Check your inbox for the verification link.');
          return;
        }
      }
      toast.success('Login successful!');
      setTimeout(() => navigate('/chatify'), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      // Use Firebase Google Auth
      const { idToken } = await signInWithGoogle();

      // Send token to backend
      const response = await axios.post(API_ENDPOINTS.googleAuth, { idToken });
      
      const { user, token } = response.data;
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('senderId', user._id);
        if (token) {
          localStorage.setItem('token', token);
        }
      }
      
      toast.success('Google login successful!');
      setTimeout(() => navigate('/chatify'), 1000);
    } catch (error) {
      console.error('Google login error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.info('Google sign-in was cancelled');
      } else {
        toast.error(error.response?.data?.message || 'Google login failed');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 overflow-hidden relative font-sans">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Floating Background Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none z-0"
          style={{
            width: 60 + i * 20,
            height: 60 + i * 20,
            top: `${10 + i * 15}%`,
            left: i % 2 === 0 ? `${5 + i * 8}%` : `${70 + i * 4}%`,
            background: `rgba(134,239,172,${0.08 + i * 0.02})`,
          }}
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
        />
      ))}

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex flex-col justify-center flex-none w-[45%] relative overflow-hidden z-10 px-14 py-16 bg-gradient-to-br from-green-600 via-green-700 to-emerald-600">
        {/* Radial overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(52,211,153,0.15) 0%, transparent 60%)' }} />

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 relative z-10">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/40">
            <MessageCircle color="white" size={24} />
          </div>
          <span className="text-white text-3xl font-bold tracking-tight">Chatify</span>
        </div>

        {/* Headline */}
        <h1 className="relative z-10 text-white text-4xl font-bold leading-tight tracking-tight mb-4">
          Welcome Back<br />to Chatify
        </h1>
        <p className="relative z-10 text-green-200/75 text-base leading-relaxed max-w-sm mb-8">
          Connect with your world through simple, secure, and private messaging.
        </p>

        {/* Animated Feature Pill */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFeature}
            className="relative z-10 inline-flex items-center gap-3 bg-white/10 border border-green-200/20 backdrop-blur-md rounded-full px-5 py-3 mb-10 w-fit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            <span className="w-2 h-2 rounded-full bg-green-400 shadow shadow-green-400 flex-shrink-0" />
            {React.createElement(features[currentFeature].icon, { size: 16, color: '#bbf7d0' })}
            <span className="text-green-100 text-sm font-medium">{features[currentFeature].text}</span>
          </motion.div>
        </AnimatePresence>

        {/* Stats */}
        <div className="relative z-10 flex items-center gap-6 pt-7 border-t border-green-200/15">
          {[
            { value: '2B+', label: 'Users' },
            { value: '100B+', label: 'Messages' },
            { value: '180+', label: 'Countries' },
          ].map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <div className="w-px h-10 bg-green-200/15" />}
              <div>
                <div className="text-white text-2xl font-bold">{s.value}</div>
                <div className="text-green-300/60 text-xs uppercase tracking-widest mt-0.5">{s.label}</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:px-8 lg:px-16 z-10">

        {/* Mobile Header */}
        <div className="flex flex-col items-center mb-7 lg:hidden">
          <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-700 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/35 mb-3">
            <MessageCircle color="white" size={28} />
          </div>
          <p className="text-xl font-bold text-green-700">Welcome Back!</p>
          <p className="text-sm text-gray-500 mt-1">Sign in to continue to Chatify</p>
        </div>

        {/* ── CARD — Framer Motion ── */}
        <motion.div
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-green-600/10 px-8 py-10 sm:px-10"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 20, delay: 0.1 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">Sign In</h2>
          <p className="text-sm text-gray-500 mb-7">Welcome back! Please sign in to your account.</p>

          <form onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative flex items-center">
                <Mail size={18} className="absolute left-3.5 text-green-600 pointer-events-none" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm bg-gray-50 text-gray-900 transition-all duration-200 outline-none focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-600/20 ${formErrors.email ? 'border-red-400' : 'border-gray-200'
                    }`}
                />
              </div>
              <AnimatePresence>
                {formErrors.email && (
                  <motion.p
                    className="text-red-500 text-xs mt-1.5"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {formErrors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative flex items-center">
                <Lock size={18} className="absolute left-3.5 text-green-600 pointer-events-none" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm bg-gray-50 text-gray-900 transition-all duration-200 outline-none focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-600/20 ${formErrors.password ? 'border-red-400' : 'border-gray-200'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-gray-400 hover:text-green-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <AnimatePresence>
                {formErrors.password && (
                  <motion.p
                    className="text-red-500 text-xs mt-1.5"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {formErrors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Remember Me & Forgot */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" className="accent-green-600 w-4 h-4" />
                Remember me
              </label>
              <a href="/forgot-password" className="text-sm font-semibold text-green-600 hover:text-green-800 transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-base shadow-lg shadow-green-600/30 transition-colors mb-5 cursor-pointer"
              whileHover={{ scale: 1.02, boxShadow: '0 8px 28px rgba(22,163,74,0.45)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              Sign In
              <ArrowRight size={18} />
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 whitespace-nowrap">Or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <motion.button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 cursor-pointer hover:bg-green-50 hover:border-green-400 transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              {isGoogleLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Chrome size={18} className="text-green-600" />
                </motion.div>
              ) : (
                <Chrome size={18} className="text-green-600" />
              )}
              Google
            </motion.button>
            {[
              { icon: Smartphone, label: 'Phone' },
            ].map(({ icon: Icon, label }) => (
              <motion.button
                key={label}
                type="button"
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 cursor-pointer hover:bg-green-50 hover:border-green-400 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Icon size={18} className="text-green-600" />
                {label}
              </motion.button>
            ))}
          </div>

          {/* Sign Up */}
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <a href="/register" className="text-green-600 font-bold hover:text-green-800 transition-colors">
              Sign up for free
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;

