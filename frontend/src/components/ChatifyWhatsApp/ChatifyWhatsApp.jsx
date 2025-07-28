import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    MessageCircle,
    Phone,
    Video,
    Search,
    MoreVertical,
    Send,
    Smile,
    Paperclip,
    Mic,
    Camera,
    Image,
    FileText,
    MapPin,
    User,
    Users,
    Settings,
    Archive,
    Star,
    Bell,
    Lock,
    HelpCircle,
    LogOut,
    Check,
    CheckCheck,
    Clock,
    ArrowLeft,
    Plus,
    X,
    Play,
    Pause,
    Download,
    Reply,
    Forward,
    Trash2,
    Info,
    Volume2,
    VolumeX,
    Maximize2,
    Minimize2
} from 'lucide-react';

const ChatifyWhatsApp = () => {
    const [activeChat, setActiveChat] = useState(null);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showAttachMenu, setShowAttachMenu] = useState(false);
    const [showChatMenu, setShowChatMenu] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isVideoCall, setIsVideoCall] = useState(false);
    const [isAudioCall, setIsAudioCall] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    // Sample chats data
    const [chats, setChats] = useState([
        {
            id: 1,
            name: 'John Doe',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            lastMessage: 'Hey, how are you doing?',
            time: '10:30 AM',
            unread: 2,
            online: true,
            typing: false,
            messages: [
                { id: 1, text: 'Hey there!', time: '10:25 AM', sender: 'them', status: 'read' },
                { id: 2, text: 'How are you doing today?', time: '10:26 AM', sender: 'them', status: 'read' },
                { id: 3, text: 'I\'m doing great! Thanks for asking', time: '10:28 AM', sender: 'me', status: 'delivered' },
                { id: 4, text: 'What about you?', time: '10:29 AM', sender: 'me', status: 'delivered' },
                { id: 5, text: 'Hey, how are you doing?', time: '10:30 AM', sender: 'them', status: 'read' }
            ]
        },
        {
            id: 2,
            name: 'Work Team',
            avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop&crop=face',
            lastMessage: 'Sarah: The project is ready',
            time: '9:45 AM',
            unread: 5,
            online: false,
            typing: false,
            isGroup: true,
            messages: [
                { id: 1, text: 'Good morning everyone!', time: '9:00 AM', sender: 'them', status: 'read', senderName: 'Mike' },
                { id: 2, text: 'Morning! Ready for the presentation?', time: '9:15 AM', sender: 'them', status: 'read', senderName: 'Sarah' },
                { id: 3, text: 'Yes, everything is prepared', time: '9:20 AM', sender: 'me', status: 'read' },
                { id: 4, text: 'The project is ready', time: '9:45 AM', sender: 'them', status: 'delivered', senderName: 'Sarah' }
            ]
        },
        {
            id: 3,
            name: 'Mom',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
            lastMessage: 'Don\'t forget dinner tonight',
            time: 'Yesterday',
            unread: 0,
            online: false,
            typing: false,
            messages: [
                { id: 1, text: 'Hi honey, how was work today?', time: '6:00 PM', sender: 'them', status: 'read' },
                { id: 2, text: 'It was good mom, thanks!', time: '6:15 PM', sender: 'me', status: 'read' },
                { id: 3, text: 'Don\'t forget dinner tonight', time: '7:30 PM', sender: 'them', status: 'read' }
            ]
        },
        {
            id: 4,
            name: 'Alex Johnson',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            lastMessage: 'Sounds good!',
            time: 'Tuesday',
            unread: 0,
            online: false,
            typing: false,
            messages: [
                { id: 1, text: 'Want to grab coffee tomorrow?', time: '2:00 PM', sender: 'me', status: 'read' },
                { id: 2, text: 'Sounds good!', time: '2:05 PM', sender: 'them', status: 'read' }
            ]
        }
    ]);

    const emojis = ['😀', '😂', '😍', '🥺', '😭', '😡', '👍', '👎', '❤️', '🔥', '💯', '😎'];

    const attachmentOptions = [
        { icon: FileText, label: 'Document', color: 'text-blue-500' },
        { icon: Camera, label: 'Camera', color: 'text-green-500' },
        { icon: Image, label: 'Gallery', color: 'text-purple-500' },
        { icon: Mic, label: 'Audio', color: 'text-red-500' },
        { icon: MapPin, label: 'Location', color: 'text-orange-500' },
        { icon: User, label: 'Contact', color: 'text-indigo-500' }
    ];

    useEffect(() => {
        scrollToBottom();
    }, [activeChat]);

    useEffect(() => {
        let interval;
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } else {
            setRecordingTime(0);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSendMessage = () => {
        if (message.trim() && activeChat) {
            const newMessage = {
                id: Date.now(),
                text: message,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                sender: 'me',
                status: 'sent'
            };

            setChats(prevChats =>
                prevChats.map(chat =>
                    chat.id === activeChat.id
                        ? {
                            ...chat,
                            messages: [...chat.messages, newMessage],
                            lastMessage: message,
                            time: 'now'
                        }
                        : chat
                )
            );

            setMessage('');
            toast.success('Message sent!');
        }
    };

    const handleStartCall = (type) => {
        if (type === 'video') {
            setIsVideoCall(true);
            toast.success('Starting video call...');
        } else {
            setIsAudioCall(true);
            toast.success('Starting audio call...');
        }
    };

    const handleEndCall = () => {
        setIsVideoCall(false);
        setIsAudioCall(false);
        setIsMuted(false);
        setIsVideoEnabled(true);
        toast.info('Call ended');
    };

    const handleFileUpload = (type) => {
        setShowAttachMenu(false);
        toast.success(`${type} attachment added`);
    };

    const startRecording = () => {
        setIsRecording(true);
        toast.info('Recording started');
    };

    const stopRecording = () => {
        setIsRecording(false);
        if (recordingTime > 0) {
            toast.success('Voice message sent!');
        }
    };

    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeMessages = activeChat ? chats.find(c => c.id === activeChat.id)?.messages || [] : [];

    return (
        <div className="h-screen bg-gray-100 flex overflow-hidden">
            <ToastContainer position="top-right" />

            {/* Sidebar */}
            <div className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-30 w-80 bg-white border-r border-gray-200 transition-transform duration-300`}>
                {/* Header */}
                <div className="bg-green-600 text-white p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <img
                                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"
                                alt="Profile"
                                className="w-10 h-10 rounded-full"
                            />
                            <h1 className="text-xl font-bold">Chatify</h1>
                        </div>
                        <div className="flex items-center space-x-2">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 hover:bg-green-700 rounded-full"
                            >
                                <Users className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 hover:bg-green-700 rounded-full"
                                onClick={() => setShowChatMenu(!showChatMenu)}
                            >
                                <MoreVertical className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search or start new chat"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:bg-white/30"
                        />
                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredChats.map((chat) => (
                        <motion.div
                            key={chat.id}
                            whileHover={{ backgroundColor: '#f3f4f6' }}
                            onClick={() => {
                                setActiveChat(chat);
                                setShowSidebar(false);
                            }}
                            className={`flex items-center p-4 cursor-pointer border-b border-gray-100 ${activeChat?.id === chat.id ? 'bg-green-50 border-r-4 border-r-green-500' : ''
                                }`}
                        >
                            <div className="relative mr-3">
                                <img
                                    src={chat.avatar}
                                    alt={chat.name}
                                    className="w-12 h-12 rounded-full"
                                />
                                {chat.online && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                                        {chat.name}
                                    </h3>
                                    <span className="text-xs text-gray-500">{chat.time}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600 truncate">
                                        {chat.typing ? (
                                            <span className="text-green-600 font-medium">typing...</span>
                                        ) : (
                                            chat.lastMessage
                                        )}
                                    </p>
                                    {chat.unread > 0 && (
                                        <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                            {chat.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Chat Menu Dropdown */}
                <AnimatePresence>
                    {showChatMenu && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute top-16 right-4 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-40"
                        >
                            {[
                                { icon: Users, label: 'New Group' },
                                { icon: Star, label: 'Starred Messages' },
                                { icon: Settings, label: 'Settings' },
                                { icon: Archive, label: 'Archived Chats' },
                                { icon: LogOut, label: 'Log Out' }
                            ].map((item, index) => (
                                <motion.button
                                    key={index}
                                    whileHover={{ backgroundColor: '#f3f4f6' }}
                                    className="flex items-center space-x-3 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                                    onClick={() => {
                                        setShowChatMenu(false);
                                        toast.info(`${item.label} clicked`);
                                    }}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </motion.button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {activeChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
                                    onClick={() => setShowSidebar(true)}
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </motion.button>
                                <div className="relative">
                                    <img
                                        src={activeChat.avatar}
                                        alt={activeChat.name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    {activeChat.online && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{activeChat.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        {activeChat.typing ? 'typing...' : activeChat.online ? 'online' : 'last seen recently'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleStartCall('video')}
                                    className="p-2 hover:bg-gray-100 rounded-full text-green-600"
                                >
                                    <Video className="w-5 h-5" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleStartCall('audio')}
                                    className="p-2 hover:bg-gray-100 rounded-full text-green-600"
                                >
                                    <Phone className="w-5 h-5" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                    <Search className="w-5 h-5" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                    <MoreVertical className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div
                            className="flex-1 overflow-y-auto p-4 space-y-4"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23dcf8c6' fill-opacity='0.1'%3E%3Cpath d='M50 50c0-27.614-22.386-50-50-50s-50 22.386-50 50 22.386 50 50 50 50-22.386 50-50z'/%3E%3C/g%3E%3C/svg%3E")`,
                                backgroundColor: '#f0f2f5'
                            }}
                        >
                            {activeMessages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'me'
                                                ? 'bg-green-500 text-white rounded-br-none'
                                                : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                                            }`}
                                    >
                                        {msg.senderName && (
                                            <p className="text-xs font-semibold text-green-600 mb-1">{msg.senderName}</p>
                                        )}
                                        <p className="text-sm">{msg.text}</p>
                                        <div className={`flex items-center justify-end space-x-1 mt-1 ${msg.sender === 'me' ? 'text-white/70' : 'text-gray-500'
                                            }`}>
                                            <span className="text-xs">{msg.time}</span>
                                            {msg.sender === 'me' && (
                                                <div className="flex">
                                                    {msg.status === 'sent' && <Check className="w-3 h-3" />}
                                                    {msg.status === 'delivered' && <CheckCheck className="w-3 h-3" />}
                                                    {msg.status === 'read' && <CheckCheck className="w-3 h-3 text-blue-400" />}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="bg-white border-t border-gray-200 p-4">
                            <div className="flex items-center space-x-3">
                                {/* Emoji Button */}
                                <div className="relative">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                        className="p-2 hover:bg-gray-100 rounded-full"
                                    >
                                        <Smile className="w-5 h-5 text-gray-500" />
                                    </motion.button>

                                    <AnimatePresence>
                                        {showEmojiPicker && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                                                className="absolute bottom-12 left-0 bg-white rounded-lg shadow-lg border border-gray-200 p-3 grid grid-cols-6 gap-2"
                                            >
                                                {emojis.map((emoji, index) => (
                                                    <motion.button
                                                        key={index}
                                                        whileHover={{ scale: 1.2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => {
                                                            setMessage(prev => prev + emoji);
                                                            setShowEmojiPicker(false);
                                                        }}
                                                        className="text-xl hover:bg-gray-100 rounded p-1"
                                                    >
                                                        {emoji}
                                                    </motion.button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Attachment Button */}
                                <div className="relative">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setShowAttachMenu(!showAttachMenu)}
                                        className="p-2 hover:bg-gray-100 rounded-full"
                                    >
                                        <Paperclip className="w-5 h-5 text-gray-500" />
                                    </motion.button>

                                    <AnimatePresence>
                                        {showAttachMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                                                className="absolute bottom-12 left-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                                            >
                                                {attachmentOptions.map((option, index) => (
                                                    <motion.button
                                                        key={index}
                                                        whileHover={{ backgroundColor: '#f3f4f6' }}
                                                        onClick={() => handleFileUpload(option.label)}
                                                        className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-gray-100"
                                                    >
                                                        <option.icon className={`w-5 h-5 ${option.color}`} />
                                                        <span className="text-sm text-gray-700">{option.label}</span>
                                                    </motion.button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Message Input */}
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Type a message..."
                                        className="w-full px-4 py-3 bg-gray-50 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Send/Voice Button */}
                                {message.trim() ? (
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleSendMessage}
                                        className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600"
                                    >
                                        <Send className="w-5 h-5" />
                                    </motion.button>
                                ) : (
                                    <div className="relative">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onMouseDown={startRecording}
                                            onMouseUp={stopRecording}
                                            onMouseLeave={stopRecording}
                                            className={`p-3 rounded-full ${isRecording ? 'bg-red-500 text-white' : 'bg-green-500 text-white hover:bg-green-600'
                                                }`}
                                        >
                                            <Mic className="w-5 h-5" />
                                        </motion.button>

                                        {isRecording && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium"
                                            >
                                                Recording: {formatTime(recordingTime)}
                                            </motion.div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    // Welcome Screen
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="w-64 h-64 mx-auto mb-8 bg-green-100 rounded-full flex items-center justify-center"
                            >
                                <MessageCircle className="w-32 h-32 text-green-500" />
                            </motion.div>
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-3xl font-bold text-gray-900 mb-4"
                            >
                                Welcome to Chatify
                            </motion.h2>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-gray-600 text-lg max-w-md mx-auto"
                            >
                                Select a chat to start messaging, or create a new conversation with your contacts.
                            </motion.p>
                            <motion.button
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowSidebar(true)}
                                className="mt-8 lg:hidden bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600"
                            >
                                Start Chatting
                            </motion.button>
                        </div>
                    </div>
                )}
            </div>

            {/* Video Call Modal */}
            <AnimatePresence>
                {isVideoCall && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black z-50 flex items-center justify-center"
                    >
                        <div className="relative w-full h-full">
                            {/* Main Video */}
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                <div className="text-center text-white">
                                    <img
                                        src={activeChat?.avatar}
                                        alt={activeChat?.name}
                                        className="w-32 h-32 rounded-full mx-auto mb-4"
                                    />
                                    <h3 className="text-2xl font-semibold mb-2">{activeChat?.name}</h3>
                                    <p className="text-gray-300">Video calling...</p>
                                </div>
                            </div>

                            {/* Self Video (Picture in Picture) */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="absolute top-4 right-4 w-32 h-24 bg-gray-700 rounded-lg overflow-hidden border-2 border-white"
                            >
                                <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                                    <span className="text-white font-semibold">You</span>
                                </div>
                            </motion.div>

                            {/* Call Controls */}
                            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-6">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsMuted(!isMuted)}
                                    className={`p-4 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-600'} text-white`}
                                >
                                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                                    className={`p-4 rounded-full ${!isVideoEnabled ? 'bg-red-500' : 'bg-gray-600'} text-white`}
                                >
                                    <Video className="w-6 h-6" />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleEndCall}
                                    className="p-4 rounded-full bg-red-500 text-white"
                                >
                                    <Phone className="w-6 h-6 transform rotate-135" />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-4 rounded-full bg-gray-600 text-white"
                                >
                                    <Maximize2 className="w-6 h-6" />
                                </motion.button>
                            </div>

                            {/* Call Duration */}
                            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                00:45
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Audio Call Modal */}
            <AnimatePresence>
                {isAudioCall && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gradient-to-br from-green-600 to-green-800 z-50 flex items-center justify-center"
                    >
                        <div className="text-center text-white">
                            <motion.img
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                src={activeChat?.avatar}
                                alt={activeChat?.name}
                                className="w-48 h-48 rounded-full mx-auto mb-8 border-4 border-white/20"
                            />
                            <motion.h3
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-4xl font-bold mb-4"
                            >
                                {activeChat?.name}
                            </motion.h3>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-xl text-green-100 mb-12"
                            >
                                Calling...
                            </motion.p>

                            {/* Audio Call Controls */}
                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="flex justify-center space-x-8"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsMuted(!isMuted)}
                                    className={`p-6 rounded-full ${isMuted ? 'bg-red-500' : 'bg-white/20'} backdrop-blur-sm`}
                                >
                                    {isMuted ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleEndCall}
                                    className="p-6 rounded-full bg-red-500"
                                >
                                    <Phone className="w-8 h-8 transform rotate-135" />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-6 rounded-full bg-white/20 backdrop-blur-sm"
                                >
                                    <Plus className="w-8 h-8" />
                                </motion.button>
                            </motion.div>

                            {/* Call Duration */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black/30 text-white px-4 py-2 rounded-full"
                            >
                                00:32
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Sidebar Overlay */}
            {showSidebar && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowSidebar(false)}
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                />
            )}

            {/* New Chat FAB (Mobile) */}
            <motion.div
                className="fixed bottom-6 right-6 lg:hidden z-30"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <button className="w-14 h-14 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6" />
                </button>
            </motion.div>

            {/* Status Bar (Mobile) */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-6 bg-green-600 z-40" />

            {/* Custom Styles for WhatsApp-like scrollbar */}
            <style jsx>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>

            {/* Message Context Menu */}
            <AnimatePresence>
                {/* This would be triggered by right-clicking on messages */}
            </AnimatePresence>

            {/* Profile Modal */}
            <AnimatePresence>
                {/* This would show user profile when clicking on avatar */}
            </AnimatePresence>

            {/* Settings Modal */}
            <AnimatePresence>
                {/* This would show app settings */}
            </AnimatePresence>

            {/* Group Info Modal */}
            <AnimatePresence>
                {/* This would show group information for group chats */}
            </AnimatePresence>

            {/* Media Viewer Modal */}
            <AnimatePresence>
                {/* This would show full-screen media viewer */}
            </AnimatePresence>

            {/* Voice Message Player */}
            <AnimatePresence>
                {/* This would show voice message controls */}
            </AnimatePresence>

            {/* Document Viewer Modal */}
            <AnimatePresence>
                {/* This would show document preview */}
            </AnimatePresence>

            {/* Location Sharing Modal */}
            <AnimatePresence>
                {/* This would show location picker */}
            </AnimatePresence>

            {/* Contact Sharing Modal */}
            <AnimatePresence>
                {/* This would show contact picker */}
            </AnimatePresence>

            {/* Message Search Results */}
            <AnimatePresence>
                {/* This would show search results overlay */}
            </AnimatePresence>

            {/* New Group Creation Modal */}
            <AnimatePresence>
                {/* This would show group creation flow */}
            </AnimatePresence>

            {/* Broadcast List Modal */}
            <AnimatePresence>
                {/* This would show broadcast list creation */}
            </AnimatePresence>

            {/* Archived Chats Modal */}
            <AnimatePresence>
                {/* This would show archived conversations */}
            </AnimatePresence>

            {/* Starred Messages Modal */}
            <AnimatePresence>
                {/* This would show starred messages */}
            </AnimatePresence>

            {/* Loading States */}
            <AnimatePresence>
                {/* Loading spinners for various operations */}
            </AnimatePresence>

            {/* Network Status Indicator */}
            <AnimatePresence>
                {/* Connection status indicator */}
            </AnimatePresence>

            {/* Message Status Indicators */}
            <AnimatePresence>
                {/* Message delivery status updates */}
            </AnimatePresence>

            {/* Typing Indicators */}
            <AnimatePresence>
                {/* Real-time typing indicators */}
            </AnimatePresence>

            {/* Push Notification Permission Request */}
            <AnimatePresence>
                {/* Notification permission modal */}
            </AnimatePresence>

            {/* App Update Available Modal */}
            <AnimatePresence>
                {/* Update notification modal */}
            </AnimatePresence>

            {/* Error Boundaries and Fallbacks */}
            <AnimatePresence>
                {/* Error state displays */}
            </AnimatePresence>

            {/* Accessibility Features */}
            <div className="sr-only">
                {/* Screen reader announcements */}
                <div role="status" aria-live="polite" aria-atomic="true">
                    {/* Dynamic status updates for screen readers */}
                </div>
            </div>

            {/* Analytics and Tracking */}
            {/* Event tracking for user interactions */}

            {/* Service Worker Registration */}
            {/* PWA functionality */}

            {/* WebRTC Configuration */}
            {/* Real-time communication setup */}

            {/* Socket.IO Connection */}
            {/* Real-time messaging connection */}

            {/* File Upload Progress */}
            <AnimatePresence>
                {/* File upload progress indicators */}
            </AnimatePresence>

            {/* Message Encryption Indicator */}
            <AnimatePresence>
                {/* End-to-end encryption status */}
            </AnimatePresence>

            {/* Dark Mode Toggle */}
            <AnimatePresence>
                {/* Theme switching functionality */}
            </AnimatePresence>

            {/* Language Selector */}
            <AnimatePresence>
                {/* Multi-language support */}
            </AnimatePresence>

            {/* Backup and Restore */}
            <AnimatePresence>
                {/* Data backup/restore modals */}
            </AnimatePresence>

            {/* Privacy Settings */}
            <AnimatePresence>
                {/* Privacy configuration modals */}
            </AnimatePresence>

            {/* Block/Unblock User */}
            <AnimatePresence>
                {/* User blocking functionality */}
            </AnimatePresence>

            {/* Report User/Content */}
            <AnimatePresence>
                {/* Reporting system modals */}
            </AnimatePresence>

            {/* Custom Ringtones */}
            <AnimatePresence>
                {/* Ringtone selection modals */}
            </AnimatePresence>

            {/* Font Size Settings */}
            <AnimatePresence>
                {/* Typography customization */}
            </AnimatePresence>

            {/* Chat Wallpaper Selector */}
            <AnimatePresence>
                {/* Background customization */}
            </AnimatePresence>

            {/* Auto-download Settings */}
            <AnimatePresence>
                {/* Media download preferences */}
            </AnimatePresence>

            {/* Storage Usage Display */}
            <AnimatePresence>
                {/* Storage management interface */}
            </AnimatePresence>

            {/* Message Forwarding Interface */}
            <AnimatePresence>
                {/* Message forwarding modals */}
            </AnimatePresence>

            {/* Quick Replies */}
            <AnimatePresence>
                {/* Pre-defined message responses */}
            </AnimatePresence>

            {/* Message Scheduling */}
            <AnimatePresence>
                {/* Scheduled message functionality */}
            </AnimatePresence>

            {/* Multi-device Sync Status */}
            <AnimatePresence>
                {/* Cross-device synchronization indicators */}
            </AnimatePresence>

            {/* Call History */}
            <AnimatePresence>
                {/* Call log interface */}
            </AnimatePresence>

            {/* Status Updates (Stories) */}
            <AnimatePresence>
                {/* WhatsApp-style status feature */}
            </AnimatePresence>

            {/* Business Features */}
            <AnimatePresence>
                {/* Business account functionality */}
            </AnimatePresence>

            {/* Payment Integration */}
            <AnimatePresence>
                {/* In-app payment system */}
            </AnimatePresence>

            {/* QR Code Scanner */}
            <AnimatePresence>
                {/* QR code functionality */}
            </AnimatePresence>

            {/* Live Location Sharing */}
            <AnimatePresence>
                {/* Real-time location sharing */}
            </AnimatePresence>

            {/* Message Reactions */}
            <AnimatePresence>
                {/* Emoji reactions to messages */}
            </AnimatePresence>

            {/* Polls and Surveys */}
            <AnimatePresence>
                {/* Interactive polling system */}
            </AnimatePresence>

            {/* Voice/Video Message Recording */}
            <AnimatePresence>
                {/* Enhanced media recording interface */}
            </AnimatePresence>

            {/* Chat Export */}
            <AnimatePresence>
                {/* Chat history export functionality */}
            </AnimatePresence>

            {/* Two-Factor Authentication */}
            <AnimatePresence>
                {/* Security enhancement modals */}
            </AnimatePresence>

            {/* Admin Controls (Groups) */}
            <AnimatePresence>
                {/* Group administration interface */}
            </AnimatePresence>

            {/* Message Translation */}
            <AnimatePresence>
                {/* Auto-translation features */}
            </AnimatePresence>

            {/* Smart Suggestions */}
            <AnimatePresence>
                {/* AI-powered message suggestions */}
            </AnimatePresence>

            {/* Productivity Integrations */}
            <AnimatePresence>
                {/* Third-party app integrations */}
            </AnimatePresence>

            {/* Advanced Search Filters */}
            <AnimatePresence>
                {/* Enhanced search functionality */}
            </AnimatePresence>

            {/* Message Templates */}
            <AnimatePresence>
                {/* Pre-saved message templates */}
            </AnimatePresence>

            {/* Conversation Analytics */}
            <AnimatePresence>
                {/* Chat statistics and insights */}
            </AnimatePresence>
        </div>
    );
};

export default ChatifyWhatsApp;