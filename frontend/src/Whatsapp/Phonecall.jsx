import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mic, MicOff, Phone, MessageSquare, MoreVertical, User, Volume2,
    Circle, X, Pause, Play
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

// ─── Pulsing Circle Animation ───────────────────────────────────────────────────
function PulsingCircle({ color = '#25d366' }) {
    return (
        <div className="relative">
            <motion.div
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: color }}
            />
            <motion.div
                animate={{ scale: [1, 1.3], opacity: [0.7, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: color }}
            />
        </div>
    );
}

// ─── Audio Call Component ─────────────────────────────────────────────────────
const Phonecall = ({ 
    isOpen, 
    onClose, 
    callType = 'audio',
    user = { name: 'Unknown User' },
    isIncoming = true,
    onAccept,
    onDecline
}) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeakerOn, setIsSpeakerOn] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [callStatus, setCallStatus] = useState(isIncoming ? 'ringing' : 'connecting');
    const [isPaused, setIsPaused] = useState(false);

    // Call timer
    useEffect(() => {
        let interval;
        if (callStatus === 'connected' && !isPaused) {
            interval = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [callStatus, isPaused]);

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
            if (callStatus === 'ringing') return 'incoming audio call...';
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
                            {/* Animated ringing avatar with pulsing */}
                            <div className="relative">
                                <PulsingCircle color="#25d366" />
                                <motion.div
                                    animate={{
                                        scale: [1, 1.02, 1],
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <Avatar name={user.name} size={160} />
                                </motion.div>
                            </div>

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
                                className="flex items-center gap-10 mt-12"
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
                                    <Phone size={28} className="text-white" />
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
                    className="fixed inset-0 z-[100] flex flex-col"
                    style={{
                        background: 'linear-gradient(180deg, #1a2634 0%, #0d1520 100%)',
                    }}
                >
                    {/* Background effects */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-[#25d366]/30 to-transparent" />
                    </div>

                    {/* Header */}
                    <div className="relative z-10 flex items-center justify-between p-6">
                        <div className="text-white/50 text-sm">
                            {formatDuration(callDuration)}
                        </div>
                        <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                            <MoreVertical size={20} className="text-white/70" />
                        </button>
                    </div>

                    {/* Main content */}
                    <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                        {/* Animated avatar during call */}
                        <div className="relative">
                            {/* Sound wave animation when connected */}
                            {callStatus === 'connected' && (
                                <div className="absolute inset-0 flex items-center justify-center -top-4">
                                    <div className="flex items-end gap-1 h-16">
                                        {[...Array(5)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{
                                                    height: [8, 24, 12, 20, 8],
                                                }}
                                                transition={{
                                                    duration: 0.8,
                                                    repeat: Infinity,
                                                    delay: i * 0.1,
                                                    ease: "easeInOut"
                                                }}
                                                className="w-1 rounded-full bg-[#25d366]"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            <Avatar name={user.name} size={180} />
                        </div>
                        
                        <p className="text-white text-2xl font-semibold mt-8">
                            {user.name}
                        </p>
                        <p className={`text-lg mt-2 ${callStatus === 'connected' ? 'text-[#25d366]' : 'text-white/60'}`}>
                            {getStatusText()}
                        </p>

                        {/* Connection quality indicator */}
                        {callStatus === 'connected' && (
                            <div className="flex items-center gap-1 mt-4">
                                <Circle size={8} className="fill-[#25d366] text-[#25d366]" />
                                <Circle size={8} className="fill-[#25d366] text-[#25d366]" />
                                <Circle size={8} className="fill-[#25d366] text-[#25d366]" />
                                <Circle size={8} className="fill-white/30 text-white/30" />
                                <span className="text-white/40 text-xs ml-2">HD</span>
                            </div>
                        )}
                    </div>

                    {/* Call controls */}
                    <div className="relative z-10 flex items-center justify-center gap-6 pb-12 px-6">
                        {/* Mute button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsMuted(!isMuted)}
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                                isMuted ? 'bg-red-500' : 'bg-[#2a3942] hover:bg-[#3a4a56]'
                            }`}
                        >
                            {isMuted ? (
                                <MicOff size={20} className="text-white" />
                            ) : (
                                <Mic size={20} className="text-white" />
                            )}
                        </motion.button>

                        {/* Speaker button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                                isSpeakerOn ? 'bg-[#25d366]' : 'bg-[#2a3942] hover:bg-[#3a4a56]'
                            }`}
                        >
                            <Volume2 size={20} className="text-white" />
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

                        {/* Pause button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsPaused(!isPaused)}
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                                isPaused ? 'bg-yellow-500' : 'bg-[#2a3942] hover:bg-[#3a4a56]'
                            }`}
                        >
                            {isPaused ? (
                                <Play size={20} className="text-white" />
                            ) : (
                                <Pause size={20} className="text-white" />
                            )}
                        </motion.button>

                        {/* Chat button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-14 h-14 rounded-full bg-[#2a3942] hover:bg-[#3a4a56] flex items-center justify-center"
                        >
                            <MessageSquare size={20} className="text-white" />
                        </motion.button>
                    </div>

                    {/* Bottom info bar */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                        <p className="text-white/30 text-xs">
                            End-to-end encrypted
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Phonecall;

