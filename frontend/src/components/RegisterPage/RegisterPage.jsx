import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
    MessageCircle, Mail, Lock, Eye, EyeOff, ArrowRight,
    Chrome, Smartphone, Shield, Zap, CheckCircle,
    User, UserPlus, Phone, Camera, X, Check, Star, Sparkles
} from 'lucide-react';

/* ── Framer Motion Variants ── */
const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.96 },
    visible: {
        opacity: 1, y: 0, scale: 1,
        transition: { type: 'spring', stiffness: 180, damping: 20, delay: 0.2 }
    }
};

const stepVariants = {
    enter: { opacity: 0, x: 60 },
    center: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 260, damping: 26 } },
    exit: { opacity: 0, x: -60, transition: { duration: 0.2 } }
};

const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
        opacity: 1, x: 0,
        transition: { delay: i * 0.08, type: 'spring', stiffness: 260, damping: 24 }
    })
};

const errorVariants = {
    hidden: { opacity: 0, y: -6 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 }
};

const leftPanelVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.9, ease: 'easeOut' } }
};

const rightPanelVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.9, delay: 0.15, ease: 'easeOut' } }
};

const featureVariants = {
    enter: { opacity: 0, y: 30, scale: 0.9 },
    center: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -30, scale: 0.9, transition: { duration: 0.4 } }
};

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        username: '', fullName: '', email: '',
        phone: '', password: '', confirmPassword: '', profileImage: null
    });
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [currentFeature, setCurrentFeature] = useState(0);
    const [step, setStep] = useState(1);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const validEmailDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];

    const features = [
        { icon: Shield, text: "Bank-level security", color: "text-blue-300" },
        { icon: Zap, text: "Instant messaging", color: "text-yellow-300" },
        { icon: MessageCircle, text: "Group chats up to 1000", color: "text-green-300" },
        { icon: Star, text: "Premium features free", color: "text-emerald-300" }
    ];

    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

    useEffect(() => {
        const handler = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handler);
        return () => window.removeEventListener('mousemove', handler);
    }, []);

    useEffect(() => {
        const id = setInterval(() => setCurrentFeature(p => (p + 1) % features.length), 3500);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        let s = 0;
        const p = formData.password;
        if (p.length >= 8) s++;
        if (/[a-z]/.test(p)) s++;
        if (/[A-Z]/.test(p)) s++;
        if (/[0-9]/.test(p)) s++;
        if (/[^A-Za-z0-9]/.test(p)) s++;
        setPasswordStrength(s);
    }, [formData.password]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
    };

    const removeProfileImage = () => {
        setFormData(prev => ({ ...prev, profileImage: null }));
        setProfileImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const validateEmail = (email) => {
        if (!email) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address";
        if (!validEmailDomains.includes(email.split('@')[1]))
            return "Please use a valid email provider (Gmail, Yahoo, Outlook, etc.)";
        return "";
    };

    const validatePhone = (phone) => {
        if (!phone) return "Phone number is required";
        if (!/^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, '')))
            return "Please enter a valid phone number";
        return "";
    };

    const validatePassword = (password) => {
        if (!password) return "Password is required";
        if (password.length < 8) return "Password must be at least 8 characters";
        if (password.length > 50) return "Password must not exceed 50 characters";
        if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
        if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
        if (!/\d/.test(password)) return "Password must contain at least one number";
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password must contain at least one special character";
        return "";
    };

    const validateUsername = (username) => {
        if (!username) return "Username is required";
        if (username.length < 3) return "Username must be at least 3 characters";
        if (username.length > 20) return "Username must not exceed 20 characters";
        if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Username can only contain letters, numbers, and underscores";
        return "";
    };

    const validateForm = () => {
        const errors = {};
        const usernameErr = validateUsername(formData.username);
        const fullNameErr = !formData.fullName ? "Full name is required" : "";
        const emailErr = validateEmail(formData.email);
        const phoneErr = validatePhone(formData.phone);
        const passwordErr = validatePassword(formData.password);
        const confirmPassErr = formData.password !== formData.confirmPassword ? "Passwords do not match" : "";
        if (usernameErr) errors.username = usernameErr;
        if (fullNameErr) errors.fullName = fullNameErr;
        if (emailErr) errors.email = emailErr;
        if (phoneErr) errors.phone = phoneErr;
        if (passwordErr) errors.password = passwordErr;
        if (confirmPassErr) errors.confirmPassword = confirmPassErr;
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) { toast.error('Please fix the errors below'); return; }
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('username', formData.username);
            formDataToSend.append('fullName', formData.fullName);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('password', formData.password);
            if (formData.profileImage) formDataToSend.append('profileImage', formData.profileImage);

            const response = await fetch('http://localhost:3000/auth/register', {
                method: 'POST', body: formDataToSend
            });
            const data = await response.json();

            if (response.ok) {
                toast.success('🎉 Account created successfully! Welcome to Chatify!');
                setFormData({ username: '', fullName: '', email: '', phone: '', password: '', confirmPassword: '', profileImage: null });
                setStep(1);
                navigate('/chatify');
            } else {
                if (data.errors) {
                    const backendErrors = {};
                    data.errors.forEach(err => { backendErrors[err.path] = err.msg; });
                    setFormErrors(backendErrors);
                    toast.error('Please fix the errors from the server.');
                } else {
                    toast.error(data.message || 'Registration failed.');
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong. Please try again.');
        }
    };

    const nextStep = () => {
        const errors = {};
        const usernameErr = validateUsername(formData.username);
        const fullNameErr = !formData.fullName ? 'Full name is required' : '';
        const emailErr = validateEmail(formData.email);
        if (usernameErr) errors.username = usernameErr;
        if (fullNameErr) errors.fullName = fullNameErr;
        if (emailErr) errors.email = emailErr;
        setFormErrors(errors);
        if (Object.keys(errors).length === 0) setStep(2);
        else toast.error('Please complete all required fields');
    };

    /* ── Reusable Field Error ── */
    const FieldError = ({ msg }) => (
        <AnimatePresence>
            {msg && (
                <motion.p
                    className="text-red-500 text-sm mt-1"
                    variants={errorVariants}
                    initial="hidden" animate="visible" exit="exit"
                    transition={{ duration: 0.2 }}
                >
                    {msg}
                </motion.p>
            )}
        </AnimatePresence>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Mouse-follow glow */}
            <motion.div
                className="fixed pointer-events-none z-0"
                animate={{ x: mousePosition.x - 300, y: mousePosition.y - 300 }}
                transition={{ type: 'spring', stiffness: 30, damping: 20 }}
            >
                <div className="w-96 h-96 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl" />
            </motion.div>

            {/* Floating Sparkles */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    className="fixed pointer-events-none"
                    animate={{ x: [0, 100, 0], y: [0, -100, 0], rotate: [0, 180, 360], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 8 + i, repeat: Infinity, delay: i * 2 }}
                    style={{ left: `${5 + i * 12}%`, top: `${10 + i * 8}%` }}
                >
                    <div className="w-3 h-3 bg-gradient-to-r from-green-400/30 to-emerald-400/30 rounded-full">
                        <Sparkles className="w-3 h-3 text-green-400/50" />
                    </div>
                </motion.div>
            ))}

            <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">

                {/* ── LEFT PANEL ── */}
                <motion.div
                    className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-green-700 to-emerald-600 relative overflow-hidden"
                    variants={leftPanelVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Background pattern */}
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

                    <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 text-center w-full">
                        {/* Logo icon */}
                        <motion.div
                            className="mb-8"
                            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                            transition={{ duration: 6, repeat: Infinity }}
                        >
                            <div className="w-28 h-28 bg-white/10 backdrop-blur-lg rounded-3xl flex items-center justify-center shadow-2xl border border-white/20">
                                <MessageCircle className="w-14 h-14 text-white" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">Join</h1>
                            <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-green-200 to-emerald-200 bg-clip-text text-transparent">Chatify</h1>
                        </motion.div>

                        <motion.p
                            className="text-xl text-green-100 mb-12 max-w-md leading-relaxed"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            Create your account and join millions of users in secure, private conversations
                        </motion.p>

                        {/* Animated Feature Pill */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentFeature}
                                className="flex items-center space-x-4 bg-white/10 backdrop-blur-lg rounded-full px-8 py-4 border border-white/20"
                                variants={featureVariants}
                                initial="enter" animate="center" exit="exit"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                >
                                    {React.createElement(features[currentFeature].icon, {
                                        className: `w-6 h-6 ${features[currentFeature].color}`
                                    })}
                                </motion.div>
                                <span className="text-white font-semibold text-lg">{features[currentFeature].text}</span>
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}>
                                    <CheckCircle className="w-5 h-5 text-green-300" />
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Stats */}
                        <motion.div
                            className="mt-16 grid grid-cols-3 gap-8 text-center"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            {[
                                { value: '2B+', label: 'Active Users' },
                                { value: '100B+', label: 'Messages Daily' },
                                { value: '200+', label: 'Countries' }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="text-4xl font-black text-white mb-1">{stat.value}</div>
                                    <div className="text-sm text-green-200">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>

                {/* ── RIGHT PANEL ── */}
                <motion.div
                    className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8"
                    variants={rightPanelVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="w-full max-w-lg">

                        {/* Mobile Header */}
                        <div className="lg:hidden text-center mb-8">
                            <motion.div
                                className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                                animate={{ rotate: [0, -10, 10, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            >
                                <UserPlus className="w-10 h-10 text-white" />
                            </motion.div>
                            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                Join Chatify
                            </h1>
                            <p className="text-gray-600 text-sm sm:text-base">Create your account in just a few steps</p>
                        </div>

                        {/* ── CARD ── */}
                        <motion.div
                            className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100 relative overflow-hidden"
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Desktop form header */}
                            <div className="hidden lg:block text-center mb-8">
                                <h2 className="text-4xl font-black text-gray-900 mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    Create Account
                                </h2>
                                <p className="text-gray-600 text-lg">Join our community of millions</p>
                            </div>

                            {/* Progress Steps */}
                            <div className="flex justify-center mb-8">
                                <div className="flex items-center space-x-4">
                                    <motion.div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}
                                        animate={{ scale: step === 1 ? 1.15 : 1 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    >
                                        {step > 1 ? <Check className="w-4 h-4" /> : '1'}
                                    </motion.div>

                                    <div className="w-16 h-1 rounded-full overflow-hidden bg-gray-200">
                                        <motion.div
                                            className="h-full bg-green-600"
                                            initial={{ width: '0%' }}
                                            animate={{ width: step >= 2 ? '100%' : '0%' }}
                                            transition={{ duration: 0.4, ease: 'easeInOut' }}
                                        />
                                    </div>

                                    <motion.div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}
                                        animate={{ scale: step === 2 ? 1.15 : 1 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    >
                                        2
                                    </motion.div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <AnimatePresence mode="wait">

                                    {/* ── STEP 1 ── */}
                                    {step === 1 && (
                                        <motion.div
                                            key="step1"
                                            variants={stepVariants}
                                            initial="enter" animate="center" exit="exit"
                                            className="space-y-5"
                                        >
                                            {/* Username */}
                                            <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <User className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <motion.input
                                                        type="text" name="username"
                                                        value={formData.username}
                                                        onChange={handleChange}
                                                        placeholder="Choose a unique username"
                                                        className={`block w-full pl-12 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white text-sm ${formErrors.username ? 'border-red-300' : 'border-gray-200'}`}
                                                        whileFocus={{ scale: 1.01 }}
                                                    />
                                                </div>
                                                <FieldError msg={formErrors.username} />
                                            </motion.div>

                                            {/* Full Name */}
                                            <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <UserPlus className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <motion.input
                                                        type="text" name="fullName"
                                                        value={formData.fullName}
                                                        onChange={handleChange}
                                                        placeholder="Enter your full name"
                                                        className={`block w-full pl-12 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white text-sm ${formErrors.fullName ? 'border-red-300' : 'border-gray-200'}`}
                                                        whileFocus={{ scale: 1.01 }}
                                                    />
                                                </div>
                                                <FieldError msg={formErrors.fullName} />
                                            </motion.div>

                                            {/* Email */}
                                            <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <Mail className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <motion.input
                                                        type="email" name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        placeholder="Enter your email address"
                                                        className={`block w-full pl-12 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white text-sm ${formErrors.email ? 'border-red-300' : 'border-gray-200'}`}
                                                        whileFocus={{ scale: 1.01 }}
                                                    />
                                                </div>
                                                <FieldError msg={formErrors.email} />
                                            </motion.div>

                                            {/* Continue Button */}
                                            <motion.button
                                                type="button"
                                                onClick={nextStep}
                                                className="group w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 px-6 rounded-xl font-bold text-base hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                                                whileHover={{ scale: 1.02, boxShadow: '0 8px 28px rgba(22,163,74,0.4)' }}
                                                whileTap={{ scale: 0.97 }}
                                                custom={3} variants={fieldVariants} initial="hidden" animate="visible"
                                            >
                                                <div className="flex items-center justify-center">
                                                    Continue
                                                    <motion.div
                                                        className="ml-2"
                                                        animate={{ x: [0, 5, 0] }}
                                                        transition={{ duration: 1.5, repeat: Infinity }}
                                                    >
                                                        <ArrowRight className="w-5 h-5" />
                                                    </motion.div>
                                                </div>
                                            </motion.button>
                                        </motion.div>
                                    )}

                                    {/* ── STEP 2 ── */}
                                    {step === 2 && (
                                        <motion.div
                                            key="step2"
                                            variants={stepVariants}
                                            initial="enter" animate="center" exit="exit"
                                            className="space-y-5"
                                        >
                                            {/* Profile Picture */}
                                            <motion.div
                                                custom={0} variants={fieldVariants} initial="hidden" animate="visible"
                                                className="text-center"
                                            >
                                                <label className="block text-sm font-bold text-gray-700 mb-4">Profile Picture (Optional)</label>
                                                <div className="flex justify-center">
                                                    <div className="relative">
                                                        <motion.div
                                                            className="w-24 h-24 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-green-400 transition-colors duration-300 overflow-hidden"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => fileInputRef.current?.click()}
                                                        >
                                                            {profileImagePreview ? (
                                                                <img src={profileImagePreview} alt="Profile preview" className="w-full h-full object-cover rounded-full" />
                                                            ) : (
                                                                <div className="text-center">
                                                                    <Camera className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                                                                    <span className="text-xs text-gray-500">Upload</span>
                                                                </div>
                                                            )}
                                                        </motion.div>
                                                        {profileImagePreview && (
                                                            <motion.button
                                                                type="button"
                                                                onClick={removeProfileImage}
                                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </motion.button>
                                                        )}
                                                    </div>
                                                </div>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            setProfileImagePreview(URL.createObjectURL(file));
                                                            setFormData(prev => ({ ...prev, profileImage: file }));
                                                        }
                                                    }}
                                                    className="hidden"
                                                />
                                                <p className="text-xs text-gray-500 mt-2">Max size: 5MB</p>
                                            </motion.div>

                                            {/* Phone */}
                                            <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <Phone className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <motion.input
                                                        type="tel" name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        placeholder="+1 (555) 123-4567"
                                                        className={`block w-full pl-12 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white text-sm ${formErrors.phone ? 'border-red-300' : 'border-gray-200'}`}
                                                        whileFocus={{ scale: 1.01 }}
                                                    />
                                                </div>
                                                <FieldError msg={formErrors.phone} />
                                            </motion.div>

                                            {/* Password */}
                                            <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <Lock className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <motion.input
                                                        type={showPassword ? 'text' : 'password'}
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        placeholder="Create a strong password"
                                                        className={`block w-full pl-12 pr-12 py-3.5 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white text-sm ${formErrors.password ? 'border-red-300' : 'border-gray-200'}`}
                                                        whileFocus={{ scale: 1.01 }}
                                                    />
                                                    <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                            {showPassword
                                                                ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                                                : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                                                        </motion.div>
                                                    </button>
                                                </div>

                                                {/* Strength Bar */}
                                                <AnimatePresence>
                                                    {formData.password && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="mt-2"
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
                                                </AnimatePresence>
                                                <FieldError msg={formErrors.password} />
                                            </motion.div>

                                            {/* Confirm Password */}
                                            <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <Lock className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <motion.input
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        name="confirmPassword"
                                                        value={formData.confirmPassword}
                                                        onChange={handleChange}
                                                        placeholder="Confirm your password"
                                                        className={`block w-full pl-12 pr-12 py-3.5 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white text-sm ${formErrors.confirmPassword ? 'border-red-300' : 'border-gray-200'}`}
                                                        whileFocus={{ scale: 1.01 }}
                                                    />
                                                    <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                            {showConfirmPassword
                                                                ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                                                : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                                                        </motion.div>
                                                    </button>
                                                </div>
                                                <FieldError msg={formErrors.confirmPassword} />
                                            </motion.div>

                                            {/* Terms */}
                                            <motion.div
                                                custom={4} variants={fieldVariants} initial="hidden" animate="visible"
                                                className="flex items-start space-x-3"
                                            >
                                                <input
                                                    type="checkbox" id="terms" required
                                                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-1 accent-green-600"
                                                />
                                                <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                                                    I agree to the{' '}
                                                    <a href="/terms" className="font-medium text-green-600 hover:text-green-500 transition-colors">Terms of Service</a>
                                                    {' '}and{' '}
                                                    <a href="/privacy" className="font-medium text-green-600 hover:text-green-500 transition-colors">Privacy Policy</a>
                                                </label>
                                            </motion.div>

                                            {/* Action Buttons */}
                                            <motion.div
                                                custom={5} variants={fieldVariants} initial="hidden" animate="visible"
                                                className="flex space-x-4"
                                            >
                                                <motion.button
                                                    type="button"
                                                    onClick={() => setStep(1)}
                                                    className="flex-1 bg-gray-100 text-gray-700 py-3.5 px-6 rounded-xl font-bold text-base hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-300"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.97 }}
                                                >
                                                    Back
                                                </motion.button>

                                                <motion.button
                                                    type="submit"
                                                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 px-6 rounded-xl font-bold text-base hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                                                    whileHover={{ scale: 1.02, boxShadow: '0 8px 28px rgba(22,163,74,0.4)' }}
                                                    whileTap={{ scale: 0.97 }}
                                                >
                                                    <div className="flex items-center justify-center">
                                                        <Sparkles className="w-5 h-5 mr-2" />
                                                        Create Account
                                                    </div>
                                                </motion.button>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Social Login — Step 1 only */}
                                <AnimatePresence>
                                    {step === 1 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="relative my-2">
                                                <div className="absolute inset-0 flex items-center">
                                                    <div className="w-full border-t border-gray-200" />
                                                </div>
                                                <div className="relative flex justify-center text-sm">
                                                    <span className="px-4 bg-white text-gray-500">Or continue with</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mt-4">
                                                {[
                                                    { icon: Chrome, label: 'Google' },
                                                    { icon: Smartphone, label: 'Phone' },
                                                ].map(({ icon: Icon, label }) => (
                                                    <motion.button
                                                        key={label}
                                                        type="button"
                                                        className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-green-300 transition-colors duration-300 text-sm font-medium text-gray-700"
                                                        whileHover={{ scale: 1.04, y: -2 }}
                                                        whileTap={{ scale: 0.96 }}
                                                    >
                                                        <Icon className="w-5 h-5 mr-2 text-gray-600" />
                                                        {label}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>

                            {/* Login Link */}
                            <motion.div
                                className="mt-6 text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <p className="text-gray-600 text-sm">
                                    Already have an account?{' '}
                                    <a href="/login" className="font-bold text-green-600 hover:text-green-500 transition-colors">
                                        Sign in here
                                    </a>
                                </p>
                            </motion.div>

                            {/* Decorative corner icons */}
                            <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
                                    <Sparkles className="w-8 h-8 text-green-500" />
                                </motion.div>
                            </div>
                            <div className="absolute bottom-4 left-4 opacity-10 pointer-events-none">
                                <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}>
                                    <Star className="w-6 h-6 text-green-500" />
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default RegisterPage;