import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Lock,
    Eye,
    EyeOff,
    CheckCircle,
    AlertCircle,
    Sparkles,
    Star,
    ArrowLeft,
    RefreshCw,
    Shield,
    Key
} from 'lucide-react';
import axios from 'axios';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [errors, setErrors] = useState({});
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        }
    }, [searchParams]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        let s = 0;
        const p = password;
        if (p.length >= 8) s++;
        if (/[a-z]/.test(p)) s++;
        if (/[A-Z]/.test(p)) s++;
        if (/[0-9]/.test(p)) s++;
        if (/[^A-Za-z0-9]/.test(p)) s++;
        setPasswordStrength(s);
    }, [password]);

    const validatePassword = (pwd) => {
        if (!pwd) return "Password is required";
        if (pwd.length < 8) return "Password must be at least 8 characters";
        if (!/[a-z]/.test(pwd)) return "Password must contain at least one lowercase letter";
        if (!/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter";
        if (!/\d/.test(pwd)) return "Password must contain at least one number";
        if (!/[!@#$%^&*(),.?\":{}|<>]/.test(pwd)) return "Password must contain at least one special character";
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const newErrors = {};
        const passwordError = validatePassword(password);
        const confirmError = password !== confirmPassword ? "Passwords do not match" : "";
        
        if (passwordError) newErrors.password = passwordError;
        if (confirmError) newErrors.confirmPassword = confirmError;
        
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length > 0) return;
        
        if (!token) {
            toast.error('Reset token is missing');
            return;
        }

        setIsLoading(true);
        
        try {
            const response = await axios.post('http://localhost:3000/auth/reset-password', {
                token,
                newPassword: password
            });

            if (response.data.success) {
                setIsSuccess(true);
                toast.success('Password reset successful!');
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to reset password';
            toast.error(message);
        } finally {
            setIsLoading(false);
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
                                <Key className="w-14 h-14 text-white" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-center"
                        >
                            <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                                Reset
                            </h1>
                            <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-green-200 to-emerald-200 bg-clip-text text-transparent">
                                Password
                            </h1>
                        </motion.div>

                        <motion.p
                            className="text-xl text-green-100 mb-12 max-w-md leading-relaxed"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            Create a strong password to secure your account
                        </motion.p>

                        <motion.div
                            className="grid grid-cols-3 gap-6 text-center"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            {[
                                { icon: Shield, value: '100%', label: 'Secure', color: 'text-green-300' },
                                { icon: Key, value: '256-bit', label: 'Encryption', color: 'text-blue-300' },
                                { icon: Sparkles, value: 'Instant', label: 'Update', color: 'text-purple-300' }
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

                {/* Right Side - Reset Password Form */}
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
                                <Lock className="w-10 h-10 text-white" />
                            </motion.div>
                            <h1 className="text-4xl font-black text-gray-900 mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                Reset Password
                            </h1>
                            <p className="text-gray-600">Enter your new password</p>
                        </div>

                        <AnimatePresence mode="wait">
                            {isSuccess ? (
                                /* Success State */
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
                                        Password Reset!
                                    </h3>
                                    
                                    <p className="text-gray-600 mb-6 text-center leading-relaxed">
                                        Your password has been successfully reset. You can now login with your new password.
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
                            ) : (
                                /* Form State */
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden"
                                >
                                    {/* Form Header */}
                                    <div className="hidden lg:block text-center mb-8">
                                        <h2 className="text-3xl font-black text-gray-900 mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                            Create New Password
                                        </h2>
                                        <p className="text-gray-600 text-lg">Enter a strong password for your account</p>
                                    </div>

                                    {!token && (
                                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                                            <div className="flex items-center gap-3">
                                                <AlertCircle className="w-5 h-5 text-red-500" />
                                                <p className="text-red-700 text-sm">
                                                    Invalid or missing reset token. Please use the link from your email.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        {/* Password */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-3">
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Lock className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <motion.input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={password}
                                                    onChange={(e) => {
                                                        setPassword(e.target.value);
                                                        setErrors({ ...errors, password: '' });
                                                    }}
                                                    className={`block w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white ${
                                                        errors.password ? 'border-red-300' : 'border-gray-200'
                                                    }`}
                                                    placeholder="Enter new password"
                                                    whileFocus={{ scale: 1.01 }}
                                                    disabled={isLoading || !token}
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                                    ) : (
                                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                                    )}
                                                </button>
                                            </div>
                                            
                                            {/* Strength Bar */}
                                            {password && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="mt-3"
                                                >
                                                    <div className="flex space-x-1 mb-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <motion.div
                                                                key={i}
                                                                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'}`}
                                                                initial={{ scaleX: 0 }}
                                                                animate={{ scaleX: i < passwordStrength ? 1 : 0.3 }}
                                                                transition={{ delay: i * 0.08 }}
                                                            />
                                                        ))}
                                                    </div>
                                                    <p className={`text-xs font-medium ${passwordStrength <= 2 ? 'text-red-500' : passwordStrength <= 3 ? 'text-yellow-500' : 'text-green-500'}`}>
                                                        {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : 'Very Weak'}
                                                    </p>
                                                </motion.div>
                                            )}
                                            
                                            {errors.password && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-red-500 text-sm mt-2"
                                                >
                                                    {errors.password}
                                                </motion.p>
                                            )}
                                        </div>

                                        {/* Confirm Password */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-3">
                                                Confirm Password
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Lock className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <motion.input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    value={confirmPassword}
                                                    onChange={(e) => {
                                                        setConfirmPassword(e.target.value);
                                                        setErrors({ ...errors, confirmPassword: '' });
                                                    }}
                                                    className={`block w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white ${
                                                        errors.confirmPassword ? 'border-red-300' : 'border-gray-200'
                                                    }`}
                                                    placeholder="Confirm new password"
                                                    whileFocus={{ scale: 1.01 }}
                                                    disabled={isLoading || !token}
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                                    ) : (
                                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                                    )}
                                                </button>
                                            </div>
                                            
                                            {errors.confirmPassword && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-red-500 text-sm mt-2"
                                                >
                                                    {errors.confirmPassword}
                                                </motion.p>
                                            )}
                                        </div>

                                        {/* Submit Button */}
                                        <motion.button
                                            type="submit"
                                            disabled={isLoading || !token}
                                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                            whileHover={{ scale: isLoading || !token ? 1 : 1.02 }}
                                            whileTap={{ scale: isLoading || !token ? 1 : 0.98 }}
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
                                                        Resetting Password...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Lock className="w-5 h-5 mr-2" />
                                                        Reset Password
                                                    </>
                                                )}
                                            </div>
                                        </motion.button>
                                    </form>

                                    {/* Back to Login */}
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

                                    {/* Decorative Elements */}
                                    <div className="absolute top-4 right-4 opacity-10">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Sparkles className="w-8 h-8 text-green-500" />
                                        </motion.div>
                                    </div>
                                    <div className="absolute bottom-4 left-4 opacity-10">
                                        <motion.div
                                            animate={{ rotate: -360 }}
                                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Star className="w-6 h-6 text-emerald-500" />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;

