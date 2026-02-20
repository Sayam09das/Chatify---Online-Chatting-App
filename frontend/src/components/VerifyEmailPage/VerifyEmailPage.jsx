import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Mail,
    CheckCircle,
    AlertCircle,
    Sparkles,
    Star,
    ArrowLeft,
    RefreshCw,
    Shield,
    Send
} from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const VerifyEmailPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const [token, setToken] = useState('');
    const [status, setStatus] = useState('loading'); // loading, success, error, already-verified
    const [message, setMessage] = useState('');
    const [isResending, setIsResending] = useState(false);
    const [resendEmail, setResendEmail] = useState('');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
            verifyEmail(tokenFromUrl);
        } else {
            setStatus('no-token');
        }
    }, [searchParams]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const verifyEmail = async (tokenToVerify) => {
        try {
            const response = await axios.post(API_ENDPOINTS.verifyEmail, {
                token: tokenToVerify
            });

            if (response.data.success) {
                setStatus('success');
                setMessage(response.data.message || 'Email verified successfully!');
                toast.success('Email verified successfully!');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to verify email';
            setStatus('error');
            setMessage(errorMessage);
            toast.error(errorMessage);
        }
    };

    const handleResend = async () => {
        if (!resendEmail) {
            toast.error('Please enter your email address');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(resendEmail)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setIsResending(true);
        try {
            const response = await axios.post(API_ENDPOINTS.resendVerification, {
                email: resendEmail
            });

            if (response.data.success) {
                toast.success('Verification email sent! Please check your inbox.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to resend verification email';
            toast.error(errorMessage);
        } finally {
            setIsResending(false);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Animated Background */}
            <motion.div
                className="fixed pointer-events-none z-0"
                animate={{
                    x: mousePosition.x - 300,
                    y: mousePosition.y - 300,
                }}
                transition={{ type: "spring", stiffness: 30, damping: 20 }}
            >
                <div className="w-96 h-96 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl" />
            </motion.div>

            {/* Floating Elements */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="fixed pointer-events-none"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -100, 0],
                        rotate: [0, 180, 360],
                        opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                        duration: 8 + i,
                        repeat: Infinity,
                        delay: i * 2,
                    }}
                    style={{
                        left: `${10 + i * 15}%`,
                        top: `${15 + i * 12}%`,
                    }}
                >
                    <div className="w-3 h-3 bg-gradient-to-r from-green-400/30 to-emerald-400/30 rounded-full">
                        <Sparkles className="w-3 h-3 text-green-400/50" />
                    </div>
                </motion.div>
            ))}

            <div className="relative z-10 min-h-screen flex">
                {/* Left Side - Branding */}
                <motion.div
                    className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-green-700 to-emerald-600 relative overflow-hidden"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <div className="absolute inset-0 opacity-20">
                        <motion.div
                            className="w-full h-full"
                            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                            transition={{ duration: 25, repeat: Infinity, repeatType: 'reverse' }}
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M40 40c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zM60 20c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                backgroundSize: '80px 80px',
                            }}
                        />
                    </div>

                    <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 text-center">
                        <motion.div
                            className="mb-8"
                            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                            transition={{ duration: 6, repeat: Infinity }}
                        >
                            <div className="w-28 h-28 bg-white/10 backdrop-blur-lg rounded-3xl flex items-center justify-center shadow-2xl border border-white/20">
                                <Mail className="w-14 h-14 text-white" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-center"
                        >
                            <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                                Verify
                            </h1>
                            <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-green-200 to-emerald-200 bg-clip-text text-transparent">
                                Email
                            </h1>
                        </motion.div>

                        <motion.p
                            className="text-xl text-green-100 mb-12 max-w-md leading-relaxed"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            Confirm your email address to activate your account
                        </motion.p>

                        <motion.div
                            className="grid grid-cols-3 gap-6 text-center"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            {[
                                { icon: Shield, value: '100%', label: 'Secure', color: 'text-green-300' },
                                { icon: Send, value: 'Instant', label: 'Delivery', color: 'text-blue-300' },
                                { icon: Sparkles, value: 'Free', label: 'Process', color: 'text-purple-300' }
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                                    <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                                    <div className="text-sm text-green-200">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>

                {/* Right Side - Verification Status */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
                    <motion.div
                        className="w-full max-w-md"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        {/* Mobile Header */}
                        <div className="lg:hidden text-center mb-8">
                            <motion.div
                                className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                                animate={{ rotate: [0, -10, 10, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            >
                                <Mail className="w-10 h-10 text-white" />
                            </motion.div>
                            <h1 className="text-4xl font-black text-gray-900 mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                Verify Email
                            </h1>
                            <p className="text-gray-600">Confirm your email address</p>
                        </div>

                        <AnimatePresence mode="wait">
                            {status === 'loading' && (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 text-center"
                                >
                                    <motion.div
                                        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    >
                                        <RefreshCw className="w-12 h-12 text-green-600" />
                                    </motion.div>
                                    
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                        Verifying...
                                    </h3>
                                    
                                    <p className="text-gray-600">
                                        Please wait while we verify your email address.
                                    </p>
                                </motion.div>
                            )}

                            {status === 'success' && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
                                >
                                    <motion.div
                                        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                                        animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <CheckCircle className="w-12 h-12 text-green-600" />
                                    </motion.div>
                                    
                                    <h3 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                                        Email Verified!
                                    </h3>
                                    
                                    <p className="text-gray-600 mb-6 text-center leading-relaxed">
                                        {message || 'Your email has been successfully verified. You can now use all features of Chatify.'}
                                    </p>
                                    
                                    <motion.button
                                        onClick={handleBackToLogin}
                                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="flex items-center justify-center">
                                            Go to Login
                                            <ArrowLeft className="w-5 h-5 ml-2" />
                                        </div>
                                    </motion.button>
                                </motion.div>
                            )}

                            {status === 'error' && (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
                                >
                                    <motion.div
                                        className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <AlertCircle className="w-12 h-12 text-red-600" />
                                    </motion.div>
                                    
                                    <h3 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                                        Verification Failed
                                    </h3>
                                    
                                    <p className="text-gray-600 mb-6 text-center leading-relaxed">
                                        {message || 'The verification link is invalid or has expired. Please request a new verification email below.'}
                                    </p>

                                    {/* Resend Verification Form */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Enter your email to resend verification
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Mail className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    value={resendEmail}
                                                    onChange={(e) => setResendEmail(e.target.value)}
                                                    className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                                                    placeholder="Enter your email address"
                                                />
                                            </div>
                                        </div>

                                        <motion.button
                                            onClick={handleResend}
                                            disabled={isResending}
                                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg disabled:opacity-50"
                                            whileHover={{ scale: isResending ? 1 : 1.02 }}
                                            whileTap={{ scale: isResending ? 1 : 0.98 }}
                                        >
                                            <div className="flex items-center justify-center">
                                                {isResending ? (
                                                    <>
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                            className="mr-2"
                                                        >
                                                            <RefreshCw className="w-5 h-5" />
                                                        </motion.div>
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-5 h-5 mr-2" />
                                                        Resend Verification Email
                                                    </>
                                                )}
                                            </div>
                                        </motion.button>
                                    </div>

                                    <motion.button
                                        onClick={handleBackToLogin}
                                        className="w-full mt-4 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="flex items-center justify-center">
                                            <ArrowLeft className="w-5 h-5 mr-2" />
                                            Back to Login
                                        </div>
                                    </motion.button>
                                </motion.div>
                            )}

                            {status === 'no-token' && (
                                <motion.div
                                    key="no-token"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
                                >
                                    <motion.div
                                        className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6"
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <Mail className="w-12 h-12 text-yellow-600" />
                                    </motion.div>
                                    
                                    <h3 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                                        Email Verification
                                    </h3>
                                    
                                    <p className="text-gray-600 mb-6 text-center leading-relaxed">
                                        Please use the verification link sent to your email address. The link is valid for 24 hours.
                                    </p>

                                    {/* Resend Verification Form */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Didn't receive the email?
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Mail className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    value={resendEmail}
                                                    onChange={(e) => setResendEmail(e.target.value)}
                                                    className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                                                    placeholder="Enter your email address"
                                                />
                                            </div>
                                        </div>

                                        <motion.button
                                            onClick={handleResend}
                                            disabled={isResending}
                                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg disabled:opacity-50"
                                            whileHover={{ scale: isResending ? 1 : 1.02 }}
                                            whileTap={{ scale: isResending ? 1 : 0.98 }}
                                        >
                                            <div className="flex items-center justify-center">
                                                {isResending ? (
                                                    <>
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                            className="mr-2"
                                                        >
                                                            <RefreshCw className="w-5 h-5" />
                                                        </motion.div>
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-5 h-5 mr-2" />
                                                        Resend Verification Email
                                                    </>
                                                )}
                                            </div>
                                        </motion.button>
                                    </div>

                                    <motion.button
                                        onClick={handleBackToLogin}
                                        className="w-full mt-4 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="flex items-center justify-center">
                                            <ArrowLeft className="w-5 h-5 mr-2" />
                                            Back to Login
                                        </div>
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailPage;

