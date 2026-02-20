import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mic, MicOff, Video, VideoOff, Phone, Maximize2, Minimize2,
    MessageSquare, MoreVertical, User, Circle, X
} from 'lucide-react';

// ─── Avatar Color Generator ───────────────────────────────────────────────────
const AVATAR_COLORS = [
    ['#1a1a2e', '#e94560'], ['#0f3460', '#53d8fb'], ['#16213e', '#f5a623'],
    ['#1b4332', '#40916c'], ['#3d0066', '#c77dff'], ['#7b2d00', '#ff9a3c'],
];

function getAvatarColors(name) {
    let hash = 0;
    for (let i = 0; i < name?.length || 0; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name) {
    return name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';
}

// ─── Avatar Component ──────────────────────────────────────────────────────────
function Avatar({ name, size = 120 }) {
    const [bg, accent] = getAvatarColors(name || 'User');
    return (
        <div
            className="rounded-full flex items-center justify-center font-bold"
            style={{
                width: size, height: size,
                background: `linear-gradient(135deg, ${bg}, ${accent})`,
                fontSize: size * 0.35,
                color: '#fff',
            }}
        >
            {getInitials(name || 'U')}
        </div>
    );
}

// ─── Video Call Component ────────────────────────────────────────────────────
const VideoCall = ({ 
    isOpen, 
    onClose, 
    callType = 'video',
    user = { name: 'Unknown User' },
    isIncoming = true,
    onAccept,
    onDecline
}) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [callStatus, setCallStatus] = useState(isIncoming ? 'ringing' : 'connecting');

    // Call timer
    useEffect(() => {
        let interval;
        if (callStatus === 'connected') {
            interval = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [callStatus]);

    // Simulate connection
    useEffect(() => {
        if (!isIncoming && isOpen) {
            const timer = setTimeout(() => {
                setCallStatus('connected');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isIncoming, isOpen]);

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getStatusText = () => {
        if (isIncoming) {
            if (callStatus === 'ringing') return 'incoming video call...';
            return 'calling...';
        }
        if (callStatus === 'connecting') return 'connecting...';
        if (callStatus === 'connected') return formatDuration(callDuration);
        return 'call ended';
    };

    // Incoming call screen
    if (isIncoming && callStatus === 'ringing') {
        return (
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center"
                        style={{
                            background: 'linear-gradient(135deg, #0a0f14 0%, #1a1f2e 50%, #0a0f14 100%)',
                        }}
                    >
                        {/* Background blur effect */}
                        <div className="absolute inset-0 opacity-30">
                            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#25d366] rounded-full blur-[100px]" />
                            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#53d8fb] rounded-full blur-[100px]" />
                        </div>

                        {/* Main content */}
                        <div className="relative z-10 flex flex-col items-center">
                            {/* Animated ringing avatar */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <Avatar name={user.name} size={160} />
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-white text-2xl font-semibold mt-8"
                            >
                                {user.name}
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-[#25d366] text-lg mt-2"
                            >
                                {getStatusText()}
                            </motion.p>

                            {/* Call actions */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="flex items-center gap-8 mt-12"
                            >
                                {/* Decline button */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onDecline}
                                    className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-xl"
                                >
                                    <Phone size={28} className="text-white rotate-[135deg]" />
                                </motion.button>

                                {/* Accept button */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onAccept}
                                    className="w-16 h-16 rounded-full bg-[#25d366] flex items-center justify-center shadow-xl"
                                >
                                    <Video size={28} className="text-white" />
                                </motion.button>
                            </motion.div>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <X size={24} className="text-white" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }

    // Active call screen
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`fixed z-[100] ${isMinimized ? 'bottom-8 right-8 w-80 h-60' : 'inset-0'}`}
                    style={{
                        background: 'linear-gradient(135deg, #0a0f14 0%, #1a1f2e 50%, #0a0f14 100%)',
                    }}
                >
                    {/* Background effects */}
                    {!isMinimized && (
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#25d366]/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#53d8fb]/10 to-transparent" />
                        </div>
                    )}

                    {/* Header */}
                    {!isMinimized && (
                        <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10">
                            <button
                                onClick={() => setIsMinimized(true)}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <Minimize2 size={20} className="text-white/70" />
                            </button>
                            <div className="text-white/70 text-sm">
                                {formatDuration(callDuration)}
                            </div>
                            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                                <MoreVertical size={20} className="text-white/70" />
                            </button>
                        </div>
                    )}

                    {/* Minimized state */}
                    {isMinimized ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                        >
                            <div className="relative w-full h-full bg-[#1a1f2e]">
                                <div className="absolute top-3 right-3">
                                    <button
                                        onClick={onClose}
                                        className="p-1.5 rounded-full bg-red-500"
                                    >
                                        <X size={14} className="text-white" />
                                    </button>
                                </div>
                                <div className="flex flex-col items-center justify-center h-full">
                                    <Avatar name={user.name} size={60} />
                                    <p className="text-white text-sm mt-2">{user.name}</p>
                                    <p className="text-[#25d366] text-xs">{formatDuration(callDuration)}</p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        /* Main video area */
                        <div className="relative z-10 flex flex-col items-center justify-center h-full">
                            {/* Remote video placeholder */}
                            <div className="flex flex-col items-center">
                                <Avatar name={user.name} size={180} />
                                
                                <p className="text-white text-xl font-medium mt-6">
                                    {user.name}
                                </p>
                                <p className="text-[#25d366] text-sm mt-1">
                                    {getStatusText()}
                                </p>
                            </div>

                            {/* Self video preview */}
                            <div className="absolute bottom-32 right-8 w-32 h-48 rounded-xl overflow-hidden shadow-xl border border-white/10 bg-[#233138]">
                                {isVideoOff ? (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <VideoOff size={24} className="text-white/50" />
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1f2e] to-[#233138]">
                                        <User size={32} className="text-white/30" />
                                    </div>
                                )}
                                <div className="absolute bottom-2 left-2 text-white/50 text-xs">
                                    You
                                </div>
                            </div>

                            {/* Call controls */}
                            <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-6">
                                {/* Mute button */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsMuted(!isMuted)}
                                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                                        isMuted ? 'bg-red-500' : 'bg-white/10 hover:bg-white/20'
                                    }`}
                                >
                                    {isMuted ? (
                                        <MicOff size={22} className="text-white" />
                                    ) : (
                                        <Mic size={22} className="text-white" />
                                    )}
                                </motion.button>

                                {/* Video toggle */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsVideoOff(!isVideoOff)}
                                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                                        isVideoOff ? 'bg-red-500' : 'bg-white/10 hover:bg-white/20'
                                    }`}
                                >
                                    {isVideoOff ? (
                                        <VideoOff size={22} className="text-white" />
                                    ) : (
                                        <Video size={22} className="text-white" />
                                    )}
                                </motion.button>

                                {/* End call button */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-xl"
                                >
                                    <Phone size={26} className="text-white rotate-[135deg]" />
                                </motion.button>

                                {/* Chat button */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                                >
                                    <MessageSquare size={22} className="text-white" />
                                </motion.button>

                                {/* Expand button */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsMinimized(true)}
                                    className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                                >
                                    <Maximize2 size={22} className="text-white" />
                                </motion.button>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default VideoCall;

