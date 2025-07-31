import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Mail,
    ArrowLeft,
    Send,
    CheckCircle,
    Shield,
    Key,
    Clock,
    Sparkles,
    Star,
    Lock,
    RefreshCw
} from 'lucide-react';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const validEmailDomains = [
        'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'
    ];

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return "Email address is required";
        if (!emailRegex.test(email)) return "Please enter a valid email address";

        const domain = email.split('@')[1];
        if (!validEmailDomains.includes(domain)) {
            return "Please use a valid email provider (Gmail, Yahoo, Outlook, etc.)";
        }
        return "";
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        
        if (emailError) {
            setEmailError('');
        }
    };

    const handleSubmit = async () => {
        const error = validateEmail(email);
        if (error) {
            setEmailError(error);
            toast.error('Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
            toast.success('Password reset email sent successfully!');
        }, 2000);
    };

    const handleResendEmail = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast.success('Password reset email sent again!');
        }, 1500);
    };

    const handleBackToLogin = () => {
        toast.info('Redirecting to login page...');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
            <ToastContainer />

            {/* Animated Background Elements */}
            <motion.div
                className="fixed pointer-events-none z-0"
                animate={{
                    x: mousePosition.x - 300,
                    y: mousePosition.y - 300,
                }}
                transition={{ type: "spring", stiffness: 30, damping: 20 }}
            >
                <div className="w-96 h-96 bg-gradient-to-r  bg-green-600/10 to-green-500/10 rounded-full blur-3xl" />
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
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-400/30 to-indigo-400/30 rounded-full">
                        <Sparkles className="w-3 h-3 text-blue-400/50" />
                    </div>
                </motion.div>
            ))}

            <div className="relative z-10 min-h-screen flex">
                {/* Left Side - Enhanced Branding */}
                <motion.div
                    className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-green-700 to-green-600 relative overflow-hidden"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    {/* Dynamic Background Pattern */}
                    <div className="absolute inset-0 opacity-20">
                        <motion.div
                            className="w-full h-full"
                            animate={{
                                backgroundPosition: ['0% 0%', '100% 100%'],
                            }}
                            transition={{
                                duration: 25,
                                repeat: Infinity,
                                repeatType: 'reverse',
                            }}
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M40 40c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zM60 20c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                backgroundSize: '80px 80px',
                            }}
                        />
                    </div>

                    <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 text-center">
                        <motion.div
                            className="mb-8"
                            animate={{
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ duration: 6, repeat: Infinity }}
                        >
                            <div className="w-28 h-28 bg-white/10 backdrop-blur-lg rounded-3xl flex items-center justify-center shadow-2xl border border-white/20">
                                <Lock className="w-14 h-14 text-white" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-center"
                        >
                            <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                                Reset
                            </h1>
                            <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
                                Password
                            </h1>
                        </motion.div>

                        <motion.p
                            className="text-xl text-blue-100 mb-12 max-w-md leading-relaxed"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            Simply enter your email address and we'll send you a secure link to reset your password
                        </motion.p>

                        {/* Enhanced Stats */}
                        <motion.div
                            className="grid grid-cols-3 gap-6 text-center"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            {[
                                { icon: Shield, value: '100%', label: 'Secure', color: 'text-blue-300' },
                                { icon: Clock, value: '<2min', label: 'Fast', color: 'text-green-300' },
                                { icon: Key, value: '99.9%', label: 'Success', color: 'text-purple-300' }
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: index * 0.5 }}
                                        className="mb-2"
                                    >
                                        <stat.icon className={`w-6 h-6 ${stat.color} mx-auto`} />
                                    </motion.div>
                                    <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                                    <div className="text-sm text-blue-200">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>

                {/* Right Side - Forgot Password Form */}
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
                                className="w-20 h-20 bg-gradient-to-r from-green-600 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                                animate={{ rotate: [0, -10, 10, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            >
                                <Lock className="w-10 h-10 text-white" />
                            </motion.div>
                            <h1 className="text-4xl font-black text-gray-900 mb-2 bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent">
                                Reset Password
                            </h1>
                            <p className="text-gray-600">Enter your email to get reset link</p>
                        </div>

                        {/* Forgot Password Form */}
                        <motion.div
                            className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {!isSubmitted ? (
                                <>
                                    {/* Form Header */}
                                    <div className="hidden lg:block text-center mb-8">
                                        <h2 className="text-3xl font-black text-gray-900 mb-4 bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent">
                                            Forgot Password?
                                        </h2>
                                        <p className="text-gray-600 text-lg">No worries, we'll send you reset instructions</p>
                                    </div>

                                    {/* Email Input Field */}
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="mb-6"
                                    >
                                        <label className="block text-sm font-bold text-gray-700 mb-3">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="h-6 w-6 text-gray-400" />
                                            </div>
                                            <motion.input
                                                type="email"
                                                value={email}
                                                onChange={handleEmailChange}
                                                onKeyPress={handleKeyPress}
                                                className={`block w-full pl-14 pr-4 py-5 text-lg border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white ${
                                                    emailError ? 'border-red-300' : 'border-gray-200'
                                                }`}
                                                placeholder="Enter your email address"
                                                whileFocus={{ scale: 1.02 }}
                                                disabled={isLoading}
                                            />
                                        </div>
                                        {emailError && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-red-500 text-sm mt-2 ml-1"
                                            >
                                                {emailError}
                                            </motion.p>
                                        )}
                                    </motion.div>

                                    {/* Submit Button */}
                                    <motion.button
                                        disabled={isLoading}
                                        onClick={handleSubmit}
                                        className="w-full bg-gradient-to-r from-green-600 to-green-600 text-white py-5 px-6 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                                        whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        <div className="flex items-center justify-center">
                                            {isLoading ? (
                                                <>
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="mr-3"
                                                    >
                                                        <RefreshCw className="w-5 h-5" />
                                                    </motion.div>
                                                    Sending Reset Link...
                                                </>
                                            ) : (
                                                <>
                                                    Send Reset Link
                                                    <motion.div
                                                        className="ml-3"
                                                        animate={{ x: [0, 5, 0] }}
                                                        transition={{ duration: 1.5, repeat: Infinity }}
                                                    >
                                                        <Send className="w-5 h-5" />
                                                    </motion.div>
                                                </>
                                            )}
                                        </div>
                                    </motion.button>

                                    {/* Back to Login */}
                                    <motion.button
                                        onClick={handleBackToLogin}
                                        className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.7 }}
                                    >
                                        <div className="flex items-center justify-center">
                                            <ArrowLeft className="w-5 h-5 mr-2" />
                                            Back to Login
                                        </div>
                                    </motion.button>
                                </>
                            ) : (
                                /* Success State */
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center"
                                >
                                    <motion.div
                                        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                                        animate={{ 
                                            scale: [1, 1.1, 1],
                                            rotate: [0, 10, -10, 0]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <CheckCircle className="w-12 h-12 text-green-600" />
                                    </motion.div>
                                    
                                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                                        Check Your Email
                                    </h3>
                                    
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        We've sent a password reset link to<br />
                                        <span className="font-semibold text-blue-600 text-lg">{email}</span>
                                    </p>
                                    
                                    <div className="space-y-4">
                                        <motion.button
                                            onClick={handleResendEmail}
                                            disabled={isLoading}
                                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50"
                                            whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                            whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center justify-center">
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="mr-2"
                                                    >
                                                        <RefreshCw className="w-4 h-4" />
                                                    </motion.div>
                                                    Sending...
                                                </div>
                                            ) : (
                                                "Resend Email"
                                            )}
                                        </motion.button>
                                        
                                        <motion.button
                                            onClick={handleBackToLogin}
                                            className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="flex items-center justify-center">
                                                <ArrowLeft className="w-4 h-4 mr-2" />
                                                Back to Login
                                            </div>
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Decorative Elements */}
                            <div className="absolute top-4 right-4 opacity-10">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                >
                                    <Sparkles className="w-8 h-8 text-blue-500" />
                                </motion.div>
                            </div>
                            <div className="absolute bottom-4 left-4 opacity-10">
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                >
                                    <Star className="w-6 h-6 text-indigo-500" />
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Help Text */}
                        {!isSubmitted && (
                            <motion.div
                                className="mt-6 text-center text-sm text-gray-500"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                            >
                                <p>
                                    Remember your password?{' '}
                                    <button
                                        onClick={handleBackToLogin}
                                        className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                                    >
                                        Sign in here
                                    </button>
                                </p>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;