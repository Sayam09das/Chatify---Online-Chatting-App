import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Phone, Video, Search, MoreVertical, Send,
    Smile, Paperclip, Mic, Camera, Image, FileText, MapPin,
    Check, CheckCheck, Lock, ArrowDown, VolumeX, Volume2,
    Pin, Trash2, Reply, Forward, Copy, Download, Play, Pause,
    MessageCircle
} from 'lucide-react';

// Helper to format last seen
const formatLastSeen = (date) => {
    if (!date) return 'unknown';
    
    const now = new Date();
    const lastSeen = new Date(date);
    const diffMs = now - lastSeen;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    if (diffDay === 1) return 'yesterday';
    if (diffDay < 7) return `${diffDay} days ago`;
    
    return lastSeen.toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short',
        year: lastSeen.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
};

// ─── Avatar Color Generator ───────────────────────────────────────────────────
const AVATAR_COLORS = [
    ['#1a1a2e', '#e94560'], ['#0f3460', '#53b8fb'], ['#16213e', '#f5a623'],
    ['#1b4332', '#40916c'], ['#3d0066', '#c77dff'], ['#7b2d00', '#ff9a3c'],
    ['#0d1b2a', '#e0fbfc'], ['#2d1b69', '#ff6584'],
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
function Avatar({ name, src, size = 40, online }) {
    const [bg, accent] = getAvatarColors(name || 'User');
    return (
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
            {src ? (
                <img src={src} alt={name} className="rounded-full object-cover w-full h-full" />
            ) : (
                <div
                    className="rounded-full flex items-center justify-center font-bold select-none"
                    style={{
                        width: size, height: size,
                        background: `linear-gradient(135deg, ${bg}, ${accent})`,
                        fontSize: size * 0.33,
                        color: '#fff',
                        letterSpacing: '0.05em',
                    }}
                >
                    {getInitials(name || 'U')}
                </div>
            )}
            {online !== undefined && (
                <span
                    className="absolute bottom-0 right-0 rounded-full border-2"
                    style={{
                        width: size * 0.27, height: size * 0.27,
                        background: online ? '#25d366' : '#aaa',
                        borderColor: '#111b21',
                    }}
                />
            )}
        </div>
    );
}

// ─── Message Status Icon ───────────────────────────────────────────────────────
function MessageStatus({ status }) {
    if (status === 'read') return <CheckCheck size={14} className="text-[#53bdeb] flex-shrink-0" />;
    if (status === 'delivered') return <CheckCheck size={14} className="text-gray-400 flex-shrink-0" />;
    if (status === 'sent') return <Check size={14} className="text-gray-400 flex-shrink-0" />;
    return null;
}

// ─── Message Bubble ──────────────────────────────────────────────────────────────
function MessageBubble({ message, isOwn, showAvatar, onReply, onForward, onCopy }) {
    const [showActions, setShowActions] = useState(false);
    const isVoice = message.type === 'voice';
    const isImage = message.type === 'image';
    const isFile = message.type === 'file';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex gap-2 max-w-[75%] ${isOwn ? 'ml-auto flex-row-reverse' : ''}`}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            {/* Avatar for received messages */}
            {!isOwn && showAvatar && (
                <Avatar name={message.senderName || 'User'} size={32} />
            )}
            {!isOwn && !showAvatar && <div className="w-8 flex-shrink-0" />}

            {/* Message bubble */}
            <div className={`relative group ${isOwn ? 'order-first' : ''}`}>
                {/* Hover actions */}
                <AnimatePresence>
                    {showActions && (
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className={`absolute -top-8 ${isOwn ? 'right-0' : 'left-0'} flex items-center gap-0.5 bg-[#233138] rounded-lg shadow-lg p-1 z-10`}
                        >
                            <button onClick={onReply} className="p-1.5 hover:bg-white/10 rounded text-gray-300" title="Reply">
                                <Reply size={14} />
                            </button>
                            <button onClick={onForward} className="p-1.5 hover:bg-white/10 rounded text-gray-300" title="Forward">
                                <Forward size={14} />
                            </button>
                            <button onClick={onCopy} className="p-1.5 hover:bg-white/10 rounded text-gray-300" title="Copy">
                                <Copy size={14} />
                            </button>
                            <button className="p-1.5 hover:bg-white/10 rounded text-gray-300" title="More">
                                <MoreVertical size={14} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Message content */}
                <div
                    className={`px-3 py-2 rounded-2xl min-w-[120px] ${
                        isOwn
                            ? 'bg-[#25d366] text-[#111b21] rounded-br-sm'
                            : 'bg-[#233138] text-[#e9edef] rounded-bl-sm'
                    }`}
                >
                    {/* Voice message */}
                    {isVoice && (
                        <div className="flex items-center gap-2">
                            <button className={`p-2 rounded-full ${isOwn ? 'bg-[#111b21]/20' : 'bg-white/10'}`}>
                                <Play size={14} className={isOwn ? 'text-[#111b21]' : 'text-[#e9edef]'} />
                            </button>
                            <div className="flex-1 h-8 rounded-full bg-black/20 relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-[10px] opacity-70">0:00 / {message.duration || '0:15'}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Image message */}
                    {isImage && message.mediaUrl && (
                        <div className="mb-1">
                            <img src={message.mediaUrl} alt="Shared" className="max-w-[250px] rounded-lg" />
                        </div>
                    )}

                    {/* File message */}
                    {isFile && (
                        <div className={`flex items-center gap-2 p-2 rounded-lg ${isOwn ? 'bg-[#111b21]/20' : 'bg-white/10'}`}>
                            <FileText size={20} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm truncate">{message.fileName || 'Document'}</p>
                                <p className="text-[10px] opacity-70">{message.fileSize || '0 KB'}</p>
                            </div>
                        </div>
                    )}

                    {/* Text message */}
                    {!isVoice && !isImage && !isFile && (
                        <p className="text-[15px] leading-relaxed break-words">{message.text}</p>
                    )}

                    {/* Time and status */}
                    <div className={`flex items-center justify-end gap-1 mt-1 ${isOwn ? 'text-[#111b21]/70' : 'text-[#8696a0]'}`}>
                        <span className="text-[11px]">{message.time}</span>
                        {isOwn && <MessageStatus status={message.status} />}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Date Separator ─────────────────────────────────────────────────────────────
function DateSeparator({ date }) {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    let displayDate = date;
    if (date === today) displayDate = 'Today';
    else if (date === yesterday) displayDate = 'Yesterday';
    else {
        const d = new Date(date);
        displayDate = d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    return (
        <div className="flex items-center justify-center my-4">
            <span className="bg-[#233138] text-[#8696a0] text-[12px] px-3 py-1 rounded-full">
                {displayDate}
            </span>
        </div>
    );
}

// ─── Chat Header ────────────────────────────────────────────────────────────────
function ChatHeader({ chat, onBack, onCall, onVideoCall }) {
    if (!chat) return null;

    // Get the last seen formatted text
    const lastSeenText = chat.online 
        ? 'online' 
        : (chat.lastSeenFormatted || formatLastSeen(chat.lastSeen) || 'offline');

    return (
        <div className="flex items-center justify-between px-4 py-3" style={{ background: '#202c33' }}>
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="lg:hidden p-1 -ml-1 hover:bg-white/10 rounded-full">
                    <ArrowLeft size={20} className="text-[#aebac1]" />
                </button>
                <Avatar name={chat.name} src={chat.avatar} size={40} online={chat.online} />
                <div>
                    <h3 className="text-[#e9edef] font-semibold text-sm">{chat.name}</h3>
                    <p className="text-[#8696a0] text-xs">
                        {chat.typing ? (
                            <span className="text-[#25d366]">typing...</span>
                        ) : (
                            <span>{lastSeenText}</span>
                        )}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-1">
                <button onClick={onVideoCall} className="p-2 hover:bg-white/10 rounded-full text-[#aebac1]">
                    <Video size={20} />
                </button>
                <button onClick={onCall} className="p-2 hover:bg-white/10 rounded-full text-[#aebac1]">
                    <Phone size={20} />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-full text-[#aebac1]">
                    <Search size={20} />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-full text-[#aebac1]">
                    <MoreVertical size={20} />
                </button>
            </div>
        </div>
    );
}

// ─── Message Input ──────────────────────────────────────────────────────────────
function MessageInput({ value, onChange, onSend, onEmojiToggle, onAttachToggle, onTyping, isRecording, recordingTime, onStartRecording, onStopRecording }) {
    const inputRef = useRef(null);
    const [showAttachMenu, setShowAttachMenu] = useState(false);
    const typingTimeoutRef = useRef(null);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    const handleChange = (e) => {
        const text = e.target.value;
        onChange(text);
        
        // Handle typing indicator
        if (onTyping && text.length > 0) {
            onTyping(true);
            
            // Clear previous timeout
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            
            // Stop typing after 2 seconds of no input
            typingTimeoutRef.current = setTimeout(() => {
                onTyping(false);
            }, 2000);
        } else if (onTyping) {
            onTyping(false);
        }
    };

    const handleSend = () => {
        // Stop typing indicator
        if (onTyping) {
            onTyping(false);
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        }
        onSend();
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const attachmentOptions = [
        { icon: FileText, label: 'Document', color: 'text-blue-400' },
        { icon: Camera, label: 'Camera', color: 'text-green-400' },
        { icon: Image, label: 'Gallery', color: 'text-purple-400' },
        { icon: Mic, label: 'Audio', color: 'text-red-400' },
        { icon: MapPin, label: 'Location', color: 'text-orange-400' },
    ];

    return (
        <div className="px-3 py-2" style={{ background: '#202c33' }}>
            {/* Attachment menu */}
            <AnimatePresence>
                {showAttachMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute bottom-20 left-4 bg-[#233138] rounded-xl shadow-xl p-2 flex gap-1 z-20"
                    >
                        {attachmentOptions.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => { setShowAttachMenu(false); }}
                                className="flex flex-col items-center gap-1 p-3 hover:bg-white/10 rounded-lg"
                            >
                                <div className={`p-2 rounded-full bg-white/10 ${opt.color}`}>
                                    <opt.icon size={20} />
                                </div>
                                <span className="text-[10px] text-[#8696a0]">{opt.label}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-end gap-2">
                {/* Emoji button */}
                <button
                    onClick={onEmojiToggle}
                    className="p-2 hover:bg-white/10 rounded-full text-[#aebac1] transition-colors"
                >
                    <Smile size={22} />
                </button>

                {/* Attachment button */}
                <div className="relative">
                    <button
                        onClick={() => setShowAttachMenu(!showAttachMenu)}
                        className="p-2 hover:bg-white/10 rounded-full text-[#aebac1] transition-colors"
                    >
                        <Paperclip size={22} />
                    </button>
                </div>

                {/* Text input */}
                <div className="flex-1 relative">
                    {isRecording ? (
                        <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#f15e6e]">
                            <button onClick={onStopRecording} className="text-white">
                                <Trash2 size={18} />
                            </button>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                <span className="text-white text-sm font-medium">Recording {formatTime(recordingTime)}</span>
                            </div>
                        </div>
                    ) : (
                        <input
                            ref={inputRef}
                            type="text"
                            value={value}
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                            placeholder="Type a message"
                            className="w-full px-4 py-2.5 rounded-full bg-[#2a3942] text-[#e9edef] placeholder-[#8696a0] text-sm outline-none focus:ring-1 focus:ring-[#25d366]"
                        />
                    )}
                </div>

                {/* Send / Mic button */}
                {isRecording ? (
                    <button
                        onClick={onStopRecording}
                        className="p-3 bg-[#f15e6e] hover:bg-[#e5455a] rounded-full text-white transition-colors"
                    >
                        <Send size={20} />
                    </button>
                ) : value.trim() ? (
                    <button
                        onClick={handleSend}
                        className="p-3 bg-[#25d366] hover:bg-[#20bd5a] rounded-full text-[#111b21] transition-colors"
                    >
                        <Send size={20} />
                    </button>
                ) : (
                    <button
                        onClick={onStartRecording}
                        className="p-3 hover:bg-white/10 rounded-full text-[#aebac1] transition-colors"
                    >
                        <Mic size={22} />
                    </button>
                )}
            </div>
        </div>
    );
}

// ─── Chat Background Pattern ──────────────────────────────────────────────────
const ChatBackground = () => (
    <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
    />
);

// ─── Main ChatArea Component ──────────────────────────────────────────────────
const ChatArea = ({
    chat,
    messages = [],
    currentUser,
    onSendMessage,
    onTyping,
    onBack,
    onCall,
    onVideoCall,
    onEmojiToggle,
    showEmojiPicker,
    onAttachToggle,
}) => {
    const [messageText, setMessageText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const messagesEndRef = useRef(null);
    const recordingIntervalRef = useRef(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Recording timer
    useEffect(() => {
        if (isRecording) {
            recordingIntervalRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(recordingIntervalRef.current);
            setRecordingTime(0);
        }
        return () => clearInterval(recordingIntervalRef.current);
    }, [isRecording]);

    const handleSend = () => {
        if (messageText.trim()) {
            onSendMessage(messageText.trim());
            setMessageText('');
        }
    };

    const handleStartRecording = () => {
        setIsRecording(true);
    };

    const handleStopRecording = () => {
        setIsRecording(false);
    };

    // Group messages by date
    const groupedMessages = messages.reduce((groups, message) => {
        const date = new Date(message.timestamp || Date.now()).toDateString();
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(message);
        return groups;
    }, {});

    if (!chat) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center h-full" style={{ background: '#0b141a' }}>
                <div className="text-center max-w-md px-8">
                    <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(37,211,102,0.1)' }}>
                        <MessageCircle size={48} className="text-[#25d366]" />
                    </div>
                    <h2 className="text-[#e9edef] text-2xl font-light mb-3">WhatsApp Clone</h2>
                    <p className="text-[#8696a0] text-sm leading-relaxed">
                        Send and receive messages without keeping your phone online.
                        <br />
                        <span className="flex items-center justify-center gap-1 mt-2">
                            <Lock size={12} /> End-to-end encrypted
                        </span>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full relative" style={{ background: '#0b141a' }}>
            <ChatBackground />

            {/* Header */}
            <ChatHeader
                chat={chat}
                onBack={onBack}
                onCall={onCall}
                onVideoCall={onVideoCall}
            />

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 relative" style={{ background: 'transparent' }}>
                {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                    <div key={date}>
                        <DateSeparator date={date} />
                        {dateMessages.map((message, index) => {
                            const prevMessage = dateMessages[index - 1];
                            const showAvatar = !prevMessage || prevMessage.sender !== message.sender;
                            const isOwn = message.sender === currentUser?._id || message.sender === 'me';

                            return (
                                <MessageBubble
                                    key={message._id || index}
                                    message={message}
                                    isOwn={isOwn}
                                    showAvatar={showAvatar}
                                    onReply={() => {}}
                                    onForward={() => {}}
                                    onCopy={() => {}}
                                />
                            );
                        })}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <MessageInput
                value={messageText}
                onChange={setMessageText}
                onSend={handleSend}
                onEmojiToggle={onEmojiToggle}
                onAttachToggle={onAttachToggle}
                onTyping={onTyping}
                isRecording={isRecording}
                recordingTime={recordingTime}
                onStartRecording={handleStartRecording}
                onStopRecording={handleStopRecording}
            />
        </div>
    );
};

export default ChatArea;

