import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  MessageCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Chrome,
  Smartphone,
  Shield,
  Zap,
  CheckCircle
} from 'lucide-react';

const LoginPage = () => {
  const [formErrors, setFormErrors] = useState({});
  const validEmailDomains = [
    'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'
  ];
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    { icon: Shield, text: "End-to-end encrypted" },
    { icon: Zap, text: "Lightning fast" },
    { icon: MessageCircle, text: "Group chats up to 256" }
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";

    const domain = email.split('@')[1];
    if (!validEmailDomains.includes(domain)) {
      return "Please use a valid email provider (Gmail, Yahoo, Outlook, etc.)";
    }
    return "";
  };
  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 4) return "Password must be at least 4 characters";
    if (password.length > 12) return "Password must not exceed 12 characters";

    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);

    if (!hasSpecialChar) return "Password must contain at least one special character";
    if (!hasNumber) return "Password must contain at least one number";

    return "";
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
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="fixed pointer-events-none z-0"
        animate={{
          x: mousePosition.x - 200,
          y: mousePosition.y - 200,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 15 }}
      >
        <div className="w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
      </motion.div>

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed w-2 h-2 bg-green-400/20 rounded-full"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            delay: i * 2,
          }}
          style={{
            left: `${10 + i * 15}%`,
            top: `${20 + i * 10}%`,
          }}
        />
      ))}

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding */}
        <motion.div
          className="hidden lg:flex lg:w-1/2 bg-green-600 relative overflow-hidden"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <motion.div
              className="w-full h-full"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px',
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 text-center">
            <motion.div
              className="mb-8"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="w-24 h-24 bg-white/10 backdrop-blur-lg rounded-3xl flex items-center justify-center shadow-2xl">
                <MessageCircle className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            <motion.h1
              className="text-5xl font-black mb-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Welcome Back to
              <br />
              <span className="text-green-200">Chatify</span>
            </motion.h1>

            <motion.p
              className="text-xl text-green-100 mb-12 max-w-md leading-relaxed"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Connect with your world through simple, secure, and private messaging
            </motion.p>

            {/* Animated Features */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature}
                className="flex items-center space-x-3 bg-white/10 backdrop-blur-lg rounded-full px-6 py-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {React.createElement(features[currentFeature].icon, {
                  className: "w-5 h-5 text-green-200"
                })}
                <span className="text-green-100 font-medium">
                  {features[currentFeature].text}
                </span>
                <CheckCircle className="w-4 h-4 text-green-300" />
              </motion.div>
            </AnimatePresence>

            {/* Stats */}
            <motion.div
              className="mt-16 grid grid-cols-3 gap-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div>
                <div className="text-3xl font-black text-green-200">2B+</div>
                <div className="text-sm text-green-100">Users</div>
              </div>
              <div>
                <div className="text-3xl font-black text-green-200">100B+</div>
                <div className="text-sm text-green-100">Messages</div>
              </div>
              <div>
                <div className="text-3xl font-black text-green-200">180+</div>
                <div className="text-sm text-green-100">Countries</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <motion.div
            className="w-full max-w-md"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <motion.div
                className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <MessageCircle className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome Back!</h1>
              <p className="text-gray-600">Sign in to continue to Chatify</p>
            </div>

            {/* Login Form */}
            <motion.div
              className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="hidden lg:block text-center mb-8">
                <h2 className="text-3xl font-black text-gray-900 mb-2">Sign In</h2>
                <p className="text-gray-600">Welcome back! Please sign in to your account</p>
              </div>

              <div onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <motion.input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                      placeholder="Enter your email"
                      whileFocus={{ scale: 1.02 }}
                      required
                    />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <motion.input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                      placeholder="Enter your password"
                      whileFocus={{ scale: 1.02 }}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </motion.div>
                    </button>
                  </div>
                </motion.div>

                {/* Remember Me & Forgot Password */}
                <motion.div
                  className="flex items-center justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-sm font-medium text-green-600 hover:text-green-500 transition-colors"
                  >
                    Forgot password?
                  </a>
                </motion.div>

                {/* Login Button */}
                <motion.button
                  type="submit"
                  className="group w-full bg-green-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex items-center justify-center">
                    Sign In
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </div>
                </motion.button>

                {/* Social Login */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or continue with</span>
                  </div>
                </motion.div>

                <motion.div
                  className="grid grid-cols-2 gap-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <motion.button
                    type="button"
                    className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Chrome className="w-5 h-5 mr-2 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Google</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Smartphone className="w-5 h-5 mr-2 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Phone</span>
                  </motion.button>
                </motion.div>
              </div>

              {/* Sign Up Link */}
              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <a
                    href="/auth/register"
                    className="font-bold text-green-600 hover:text-green-500 transition-colors"
                  >
                    Sign up for free
                  </a>
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;