import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { app } from "../../config/firebase";

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
    CheckCircle,
    User,
    UserPlus,
    Phone,
    Camera,
    Upload,
    X,
    Check,
    Star,
    Sparkles
} from 'lucide-react';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [currentFeature, setCurrentFeature] = useState(0);
    const [step, setStep] = useState(1);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const validEmailDomains = [
        'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'
    ];

    const features = [
        { icon: Shield, text: "Bank-level security", color: "text-blue-300" },
        { icon: Zap, text: "Instant messaging", color: "text-yellow-300" },
        { icon: MessageCircle, text: "Group chats up to 1000", color: "text-green-300" },
        { icon: Star, text: "Premium features free", color: "text-emerald-300" }
    ];

    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];


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
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        calculatePasswordStrength(formData.password);
    }, [formData.password]);

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        setPasswordStrength(strength);
    };

    // const handleGoogleSignIn = async () => {
    //     const auth = getAuth(app);
    //     const provider = new GoogleAuthProvider();

    //     try {
    //         const result = await signInWithPopup(auth, provider);
    //         const user = result.user;

    //         console.log("✅ Google Sign-In successful:", user);

    //         toast.success(`Welcome ${user.displayName || 'User'}!`, {
    //             position: "top-right",
    //             autoClose: 3000,
    //         });

    //         navigate("/chatify");
    //     } catch (error) {
    //         console.error("Google Sign-In Error:", error);

    //         let message = "Google Sign-In failed. Please allow popups and try again.";

    //         if (error.code === "auth/popup-blocked") {
    //             message = "Popup blocked. Please enable popups in your browser settings.";
    //         } else if (error.code === "auth/cancelled-popup-request") {
    //             message = "Popup request was cancelled. Please try again.";
    //         }

    //         toast.error(message, {
    //             position: "top-right",
    //             autoClose: 5000,
    //         });
    //     }
    // };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size must be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImagePreview(e.target.result);
                setProfileImage(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeProfileImage = () => {
        setProfileImage(null);
        setProfileImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
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

    const validatePhone = (phone) => {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phone) return "Phone number is required";
        if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
            return "Please enter a valid phone number";
        }
        return "";
    };

    const validatePassword = (password) => {
        if (!password) return "Password is required";
        if (password.length < 8) return "Password must be at least 8 characters";
        if (password.length > 50) return "Password must not exceed 50 characters";

        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!hasLower) return "Password must contain at least one lowercase letter";
        if (!hasUpper) return "Password must contain at least one uppercase letter";
        if (!hasNumber) return "Password must contain at least one number";
        if (!hasSpecial) return "Password must contain at least one special character";

        return "";
    };

    const validateUsername = (username) => {
        if (!username) return "Username is required";
        if (username.length < 3) return "Username must be at least 3 characters";
        if (username.length > 20) return "Username must not exceed 20 characters";
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return "Username can only contain letters, numbers, and underscores";
        }
        return "";
    };

    const validateForm = () => {
        const errors = {};

        const usernameError = validateUsername(formData.username);
        const fullNameError = !formData.fullName ? "Full name is required" : "";
        const emailError = validateEmail(formData.email);
        const phoneError = validatePhone(formData.phone);
        const passwordError = validatePassword(formData.password);
        const confirmPasswordError = formData.password !== formData.confirmPassword
            ? "Passwords do not match" : "";

        if (usernameError) errors.username = usernameError;
        if (fullNameError) errors.fullName = fullNameError;
        if (emailError) errors.email = emailError;
        if (phoneError) errors.phone = phoneError;
        if (passwordError) errors.password = passwordError;
        if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error('Please fix the errors below');
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('username', formData.username);
            formDataToSend.append('fullName', formData.fullName);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('password', formData.password);
            if (formData.profileImage) {
                formDataToSend.append('profileImage', formData.profileImage);
            }

            const response = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                body: formDataToSend // no headers, browser sets correct one
            });
            console.log(formDataToSend);
            const data = await response.json();

            if (response.ok) {
                toast.success('🎉 Account created successfully! Welcome to Chatify!');
                setFormData({
                    username: '',
                    fullName: '',
                    email: '',
                    phone: '',
                    password: '',
                    confirmPassword: '',
                    profileImage: null
                });
                setStep(1); // Optional: reset to first step
                navigate('/chatify');
            } else {
                if (data.errors) {
                    const backendErrors = {};
                    data.errors.forEach(err => {
                        backendErrors[err.path] = err.msg;
                    });
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
        const stepOneFields = ['username', 'fullName', 'email'];
        const stepOneErrors = {};

        stepOneFields.forEach(field => {
            let error = '';
            switch (field) {
                case 'username':
                    error = validateUsername(formData[field]);
                    break;
                case 'fullName':
                    error = !formData[field] ? 'Full name is required' : '';
                    break;
                case 'email':
                    error = validateEmail(formData[field]);
                    break;
            }
            if (error) stepOneErrors[field] = error;
        });

        setFormErrors(stepOneErrors);

        if (Object.keys(stepOneErrors).length === 0) {
            setStep(2);
        } else {
            toast.error('Please complete all required fields');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden">
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
                <div className="w-96 h-96 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl" />
            </motion.div>

            {/* Floating Elements */}
            {[...Array(8)].map((_, i) => (
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
                        left: `${5 + i * 12}%`,
                        top: `${10 + i * 8}%`,
                    }}
                >
                    <div className="w-3 h-3 bg-gradient-to-r from-green-400/30 to-emerald-400/30 rounded-full">
                        <Sparkles className="w-3 h-3 text-green-400/50" />
                    </div>
                </motion.div>
            ))}

            <div className="relative z-10 min-h-screen flex">
                {/* Left Side - Enhanced Branding */}
                <motion.div
                    className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-green-700 to-emerald-600 relative overflow-hidden"
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
                                <MessageCircle className="w-14 h-14 text-white" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-center"
                        >
                            <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                                Join
                            </h1>
                            <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-green-200 to-emerald-200 bg-clip-text text-transparent">
                                Chatify
                            </h1>
                        </motion.div>

                        <motion.p
                            className="text-xl text-green-100 mb-12 max-w-md leading-relaxed"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            Create your account and join millions of users in secure, private conversations
                        </motion.p>

                        {/* Enhanced Animated Features */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentFeature}
                                className="flex items-center space-x-4 bg-white/10 backdrop-blur-lg rounded-full px-8 py-4 border border-white/20"
                                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -30, scale: 0.9 }}
                                transition={{ duration: 0.6 }}
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                >
                                    {React.createElement(features[currentFeature].icon, {
                                        className: `w-6 h-6 ${features[currentFeature].color}`
                                    })}
                                </motion.div>
                                <span className="text-white font-semibold text-lg">
                                    {features[currentFeature].text}
                                </span>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <CheckCircle className="w-5 h-5 text-green-300" />
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Enhanced Stats */}
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
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
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

                {/* Right Side - Enhanced Registration Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
                    <motion.div
                        className="w-full max-w-lg"
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
                                <UserPlus className="w-10 h-10 text-white" />
                            </motion.div>
                            <h1 className="text-4xl font-black text-gray-900 mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                Join Chatify
                            </h1>
                            <p className="text-gray-600">Create your account in just a few steps</p>
                        </div>

                        {/* Enhanced Registration Form */}
                        <motion.div
                            className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {/* Form Header */}
                            <div className="hidden lg:block text-center mb-8">
                                <h2 className="text-4xl font-black text-gray-900 mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    Create Account
                                </h2>
                                <p className="text-gray-600 text-lg">Join our community of millions</p>
                            </div>

                            {/* Progress Indicator */}
                            <div className="flex justify-center mb-8">
                                <div className="flex items-center space-x-4">
                                    <motion.div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                                            }`}
                                        animate={{ scale: step === 1 ? 1.1 : 1 }}
                                    >
                                        {step > 1 ? <Check className="w-4 h-4" /> : '1'}
                                    </motion.div>
                                    <motion.div
                                        className={`w-16 h-1 ${step >= 2 ? 'bg-green-600' : 'bg-gray-200'}`}
                                        animate={{ scaleX: step >= 2 ? 1 : 0.3 }}
                                        style={{ originX: 0 }}
                                    />
                                    <motion.div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                                            }`}
                                        animate={{ scale: step === 2 ? 1.1 : 1 }}
                                    >
                                        2
                                    </motion.div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <AnimatePresence mode="wait">
                                    {step === 1 && (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -50 }}
                                            className="space-y-6"
                                        >
                                            {/* Username Field */}
                                            <motion.div
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.1 }}
                                            >
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Username
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <User className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <motion.input
                                                        type="text"
                                                        name="username"
                                                        value={formData.username}
                                                        onChange={handleChange}
                                                        className={`block w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white ${formErrors.username ? 'border-red-300' : 'border-gray-200'
                                                            }`}
                                                        placeholder="Choose a unique username"
                                                        whileFocus={{ scale: 1.02 }}
                                                    />
                                                </div>
                                                {formErrors.username && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="text-red-500 text-sm mt-1"
                                                    >
                                                        {formErrors.username}
                                                    </motion.p>
                                                )}
                                            </motion.div>

                                            {/* Full Name Field */}
                                            <motion.div
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Full Name
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <UserPlus className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <motion.input
                                                        type="text"
                                                        name="fullName"
                                                        value={formData.fullName}
                                                        onChange={handleChange}
                                                        className={`block w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white ${formErrors.fullName ? 'border-red-300' : 'border-gray-200'
                                                            }`}
                                                        placeholder="Enter your full name"
                                                        whileFocus={{ scale: 1.02 }}
                                                    />
                                                </div>
                                                {formErrors.fullName && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="text-red-500 text-sm mt-1"
                                                    >
                                                        {formErrors.fullName}
                                                    </motion.p>
                                                )}
                                            </motion.div>

                                            {/* Email Field */}
                                            <motion.div
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.3 }}
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
                                                        className={`block w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white ${formErrors.email ? 'border-red-300' : 'border-gray-200'
                                                            }`}
                                                        placeholder="Enter your email address"
                                                        whileFocus={{ scale: 1.02 }}
                                                    />
                                                </div>
                                                {formErrors.email && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="text-red-500 text-sm mt-1"
                                                    >
                                                        {formErrors.email}
                                                    </motion.p>
                                                )}
                                            </motion.div>

                                            {/* Next Button */}
                                            <motion.button
                                                type="button"
                                                onClick={nextStep}
                                                className="group w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.4 }}
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

                                    {step === 2 && (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -50 }}
                                            className="space-y-6"
                                        >
                                            {/* Profile Picture Upload */}
                                            <motion.div
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 0.1 }}
                                                className="text-center"
                                            >
                                                <label className="block text-sm font-bold text-gray-700 mb-4">
                                                    Profile Picture (Optional)
                                                </label>
                                                <div className="flex justify-center">
                                                    <div className="relative">
                                                        <motion.div
                                                            className="w-24 h-24 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-purple-400 transition-colors duration-300 overflow-hidden"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => fileInputRef.current?.click()}
                                                        >
                                                            {profileImagePreview ? (
                                                                <img
                                                                    src={profileImagePreview}
                                                                    alt="Profile preview"
                                                                    className="w-full h-full object-cover rounded-full"
                                                                />
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
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </motion.button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* ✅ Updated file input */}
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            const previewURL = URL.createObjectURL(file);
                                                            setProfileImagePreview(previewURL); // for preview
                                                            setFormData((prev) => ({ ...prev, profileImage: file })); // for backend
                                                        }
                                                    }}
                                                    className="hidden"
                                                />

                                                <p className="text-xs text-gray-500 mt-2">Max size: 5MB</p>
                                            </motion.div>


                                            {/* Phone Number Field */}
                                            <motion.div
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Phone Number
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <Phone className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <motion.input
                                                        type="tel"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        className={`block w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white ${formErrors.phone ? 'border-red-300' : 'border-gray-200'
                                                            }`}
                                                        placeholder="+1 (555) 123-4567"
                                                        whileFocus={{ scale: 1.02 }}
                                                    />
                                                </div>
                                                {formErrors.phone && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="text-red-500 text-sm mt-1"
                                                    >
                                                        {formErrors.phone}
                                                    </motion.p>
                                                )}
                                            </motion.div>

                                            {/* Password Field */}
                                            <motion.div
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.3 }}
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
                                                        className={`block w-full pl-12 pr-12 py-4 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white ${formErrors.password ? 'border-red-300' : 'border-gray-200'
                                                            }`}
                                                        placeholder="Create a strong password"
                                                        whileFocus={{ scale: 1.02 }}
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

                                                {/* Password Strength Indicator */}
                                                {formData.password && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        className="mt-2"
                                                    >
                                                        <div className="flex space-x-1 mb-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <motion.div
                                                                    key={i}
                                                                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'
                                                                        }`}
                                                                    initial={{ scaleX: 0 }}
                                                                    animate={{ scaleX: i < passwordStrength ? 1 : 0.3 }}
                                                                    transition={{ delay: i * 0.1 }}
                                                                />
                                                            ))}
                                                        </div>
                                                        <p className={`text-xs font-medium ${passwordStrength <= 2 ? 'text-red-500' :
                                                            passwordStrength <= 3 ? 'text-yellow-500' : 'text-green-500'
                                                            }`}>
                                                            {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : 'Very Weak'}
                                                        </p>
                                                    </motion.div>
                                                )}

                                                {formErrors.password && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="text-red-500 text-sm mt-1"
                                                    >
                                                        {formErrors.password}
                                                    </motion.p>
                                                )}
                                            </motion.div>

                                            {/* Confirm Password Field */}
                                            <motion.div
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.4 }}
                                            >
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Confirm Password
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <Lock className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <motion.input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        name="confirmPassword"
                                                        value={formData.confirmPassword}
                                                        onChange={handleChange}
                                                        className={`block w-full pl-12 pr-12 py-4 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white ${formErrors.confirmPassword ? 'border-red-300' : 'border-gray-200'
                                                            }`}
                                                        placeholder="Confirm your password"
                                                        whileFocus={{ scale: 1.02 }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    >
                                                        <motion.div
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            {showConfirmPassword ? (
                                                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                                            ) : (
                                                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                                            )}
                                                        </motion.div>
                                                    </button>
                                                </div>
                                                {formErrors.confirmPassword && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="text-red-500 text-sm mt-1"
                                                    >
                                                        {formErrors.confirmPassword}
                                                    </motion.p>
                                                )}
                                            </motion.div>

                                            {/* Terms and Conditions */}
                                            <motion.div
                                                className="flex items-start space-x-3"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.5 }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    id="terms"
                                                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-1"
                                                    required
                                                />
                                                <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                                                    I agree to the{' '}
                                                    <a href="/terms" className="font-medium text-purple-600 hover:text-purple-500 transition-colors">
                                                        Terms of Service
                                                    </a>
                                                    {' '}and{' '}
                                                    <a href="/privacy" className="font-medium text-purple-600 hover:text-purple-500 transition-colors">
                                                        Privacy Policy
                                                    </a>
                                                </label>
                                            </motion.div>

                                            {/* Action Buttons */}
                                            <div className="flex space-x-4">
                                                <motion.button
                                                    type="button"
                                                    onClick={() => setStep(1)}
                                                    className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-bold text-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    Back
                                                </motion.button>

                                                <motion.button
                                                    type="submit"
                                                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.6 }}
                                                >
                                                    <div className="flex items-center justify-center">
                                                        <Sparkles className="w-5 h-5 mr-2" />
                                                        Create Account
                                                    </div>
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Social Login - Only show on step 1 */}
                                {step === 1 && (
                                    <>
                                        <motion.div
                                            className="relative"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 }}
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
                                            transition={{ delay: 0.6 }}
                                        >
                                            <motion.button
                                                type="button"
                                                onClick={handleGoogleSignIn}
                                                className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-300 hover:border-purple-300"
                                                whileHover={{ scale: 1.05, y: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Chrome className="w-5 h-5 mr-2 text-gray-600" />
                                                <span className="text-sm font-medium text-gray-700">Google</span>
                                            </motion.button>


                                            <motion.button
                                                type="button"
                                                className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-300 hover:border-purple-300"
                                                whileHover={{ scale: 1.05, y: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Smartphone className="w-5 h-5 mr-2 text-gray-600" />
                                                <span className="text-sm font-medium text-gray-700">Phone</span>
                                            </motion.button>
                                        </motion.div>
                                    </>
                                )}
                            </form>

                            {/* Login Link */}
                            <motion.div
                                className="mt-8 text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                <p className="text-gray-600">
                                    Already have an account?{' '}
                                    <a
                                        href="/auth/login"
                                        className="font-bold text-green-600 hover:text-green-500 transition-colors"
                                    >
                                        Sign in here
                                    </a>
                                </p>
                            </motion.div>

                            {/* Decorative Elements */}
                            <div className="absolute top-4 right-4 opacity-10">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                >
                                    <Sparkles className="w-8 h-8 text-purple-500" />
                                </motion.div>
                            </div>
                            <div className="absolute bottom-4 left-4 opacity-10">
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                >
                                    <Star className="w-6 h-6 text-blue-500" />
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;