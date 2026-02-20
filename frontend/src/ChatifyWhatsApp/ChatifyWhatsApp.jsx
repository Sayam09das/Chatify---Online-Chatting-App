import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
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
    UserPlus,
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

const socket = io("http://localhost:3000", {
    withCredentials: true,
    transports: ["websocket"],
});

const ChatifyWhatsApp = () => {
    const [chats, setChats] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showAttachMenu, setShowAttachMenu] = useState(false);
    const [showChatMenu, setShowChatMenu] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isVideoCall, setIsVideoCall] = useState(false);
    const [isAudioCall, setIsAudioCall] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/auth/logout", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                showNotification("Logged out successfully", "success");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
            } else {
                showNotification(data.message || "Logout failed", "error");
            }
        } catch (err) {
            console.error(err);
            showNotification("Server error during logout", "error");
        }
    };

    // Alternative method to get current user if localStorage fails
    const getCurrentUserFromToken = async (token) => {
        try {
            const response = await axios.get('http://localhost:3000/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Failed to get user from token:', error);
            return null;
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        console.log('🔍 Checking localStorage:', { storedUser, storedToken });

        if (!storedToken) {
            console.warn('Token not found in localStorage');
            showNotification('Please login again', 'error');
            return;
        }

        const initializeUser = async () => {
            let currentUserParsed = null;

            // Try to get user from localStorage first
            if (storedUser) {
                try {
                    currentUserParsed = JSON.parse(storedUser);
                    console.log('👤 Parsed user from localStorage:', currentUserParsed);
                } catch (error) {
                    console.error('Error parsing user from localStorage:', error);
                }
            }

            // If localStorage user is invalid, fetch from server
            if (!currentUserParsed || !currentUserParsed._id) {
                console.log('🔄 Fetching user from server...');
                currentUserParsed = await getCurrentUserFromToken(storedToken);

                if (currentUserParsed) {
                    // Update localStorage with fresh user data
                    localStorage.setItem('user', JSON.stringify(currentUserParsed));
                    console.log('✅ User data refreshed from server');
                } else {
                    console.error('Failed to get user data from server');
                    showNotification('Failed to authenticate. Please login again', 'error');
                    return;
                }
            }

            if (!currentUserParsed || !currentUserParsed._id) {
                console.error('Invalid user data:', currentUserParsed);
                showNotification('Invalid user data. Please login again', 'error');
                return;
            }

            setCurrentUser(currentUserParsed);

            // Emit addUser with proper ID
            socket.emit('addUser', currentUserParsed._id);
            console.log("🟢 Emitting addUser:", currentUserParsed._id);

            const fetchUsers = async () => {
                try {
                    const res = await axios.post(
                        'http://localhost:3000/auth/users',
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${storedToken}`,
                            },
                        }
                    );

                    const others = res.data.filter(user => user._id !== currentUserParsed._id);
                    const sortedOthers = others.sort((a, b) => a.fullName.localeCompare(b.fullName));

                    // ✅ Don't include current user in the chat list - only show other users
                    setAllUsers(res.data); // Keep all users for search/reference

                    // ✅ Create chats only for OTHER users, not including yourself
                    const chatsData = sortedOthers.map(user => ({
                        _id: user._id,
                        name: user.fullName,
                        avatar: user.profileImage
                            ? `http://localhost:3000/${user.profileImage.replace(/\\/g, '/')}`
                            : '/default-avatar.png',
                        lastMessage: '',
                        unread: 0,
                        typing: false,
                        online: false,
                        time: '',
                        messages: [],
                    }));

                    setChats(chatsData);
                    console.log('✅ Users and chats loaded successfully');
                } catch (err) {
                    console.error('Failed to fetch users:', err);
                    showNotification('Failed to load users', 'error');
                }
            };

            fetchUsers();
        };

        initializeUser();
    }, []);

    const handleStartChat = (user) => {
        // ✅ Prevent starting chat with yourself
        if (user._id === currentUser?._id) {
            showNotification("You can't chat with yourself!", 'error');
            return;
        }

        const chatExists = chats.find(chat => chat._id === user._id);

        if (chatExists) {
            setActiveChat(chatExists);
            setShowSidebar(false);
        } else {
            const newChat = {
                _id: user._id,
                name: user.fullName,
                avatar: user.profileImage
                    ? `http://localhost:3000/${user.profileImage.replace(/\\/g, '/')}`
                    : '/default-avatar.png',
                lastMessage: '',
                unread: 0,
                typing: false,
                online: false,
                time: '',
                messages: [],
            };

            setChats(prevChats => [newChat, ...prevChats]);
            setActiveChat(newChat);
            setShowSidebar(false);
        }
    };

    const emojis = ['😀', '😂', '😍', '🥺', '😭', '😡', '👍', '👎', '❤️', '🔥', '💯', '😎'];

    const attachmentOptions = [
        { icon: FileText, label: 'Document', color: 'text-blue-500' },
        { icon: Camera, label: 'Camera', color: 'text-green-500' },
        { icon: Image, label: 'Gallery', color: 'text-purple-500' },
        { icon: Mic, label: 'Audio', color: 'text-red-500' },
        { icon: MapPin, label: 'Location', color: 'text-orange-500' },
        { icon: UserPlus, label: 'Contact', color: 'text-indigo-500' }
    ];

    const showNotification = (message, type = 'success') => {
        const id = Date.now();
        const notification = { id, message, type };
        setNotifications(prev => [...prev, notification]);

        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    };

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

    const handleSearch = async (query) => {
        if (!query.trim()) return;
        try {
            const res = await axios.get(`http://localhost:3000/api/search?search=${query}`);
            setSearchResults(res.data);
        } catch (error) {
            console.error('Search error:', error);
        }
    };

    const handleProfileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profileImage', file);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('http://localhost:3000/auth/update-profile-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            const updatedUser = response.data.user;
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setCurrentUser(updatedUser);
            showNotification('Profile image updated!', 'success');
        } catch (error) {
            console.error('Profile update failed:', error);
            showNotification('Failed to update profile image', 'error');
        }
    };

    // Handle Receiving Messages
    const handleReceiveMessage = ({ chatId, message }) => {
        console.log("📨 Received message:", { chatId, message });

        setChats(prevChats => {
            const chatExists = prevChats.find(chat => chat._id === chatId);

            if (chatExists) {
                return prevChats.map(chat =>
                    chat._id === chatId
                        ? {
                            ...chat,
                            messages: [...chat.messages, message],
                            lastMessage: message.text,
                            time: 'now'
                        }
                        : chat
                );
            } else {
                // New chat creation
                const newChat = {
                    _id: chatId,
                    name: 'New User',
                    avatar: '/default-avatar.png',
                    messages: [message],
                    lastMessage: message.text,
                    time: 'now',
                    unread: 1
                };
                return [newChat, ...prevChats];
            }
        });
    };

    // Register socket listener
    useEffect(() => {
        socket.on('receiveMessage', handleReceiveMessage);

        // Handle socket connection events
        socket.on('connect', () => {
            console.log('🔌 Socket connected:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('❌ Socket disconnected');
        });

        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
            socket.off('connect');
            socket.off('disconnect');
        };
    }, []);

    // Handle Sending Messages - FIXED VERSION
    const handleSendMessage = () => {
        const trimmed = message.trim();

        // Enhanced validation with detailed logging
        if (!trimmed) {
            console.warn('Cannot send message: empty message');
            return;
        }

        if (!activeChat) {
            console.warn('Cannot send message: no active chat');
            return;
        }

        if (!currentUser || !currentUser._id) {
            console.error('Cannot send message: currentUser or _id is missing', { currentUser });
            showNotification('Please refresh the page and login again', 'error');
            return;
        }

        // Create the message object with guaranteed sender ID
        const messageObj = {
            text: trimmed,
            sender: currentUser._id,  // ✅ Ensure sender is included
            receiver: activeChat._id,
            timestamp: new Date().toISOString()
        };

        const newMessage = {
            _id: uuidv4(),
            ...messageObj,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent'
        };

        console.log('📤 Sending message:', messageObj);
        console.log('👤 Current user:', currentUser);
        console.log('💬 Active chat:', activeChat);

        // Update local state immediately
        setChats(prevChats =>
            prevChats.map(chat =>
                chat._id === activeChat._id
                    ? {
                        ...chat,
                        messages: [...chat.messages, newMessage],
                        lastMessage: trimmed,
                        time: 'now'
                    }
                    : chat
            )
        );

        // ✅ Send to socket server with proper structure
        socket.emit('sendMessage', {
            chatId: activeChat._id,
            message: messageObj  // Send the complete message object
        });

        setMessage('');
    };

    const handleStartCall = (type) => {
        if (type === 'video') {
            setIsVideoCall(true);
            showNotification('Starting video call...');
        } else {
            setIsAudioCall(true);
            showNotification('Starting audio call...');
        }
    };

    const handleEndCall = () => {
        setIsVideoCall(false);
        setIsAudioCall(false);
        setIsMuted(false);
        setIsVideoEnabled(true);
        showNotification('Call ended', 'info');
    };

    const handleFileUpload = (type) => {
        setShowAttachMenu(false);
        showNotification(`${type} attachment added`);
    };

    const startRecording = () => {
        setIsRecording(true);
        showNotification('Recording started', 'info');
    };

    const stopRecording = () => {
        setIsRecording(false);
        if (recordingTime > 0) {
            showNotification('Voice message sent!');
        }
    };

    const filteredChats = chats.filter(chat =>
        (chat.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (chat.lastMessage || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeMessages = activeChat
        ? chats.find(c => c._id === activeChat._id)?.messages || []
        : [];

    const filteredUsers = allUsers.filter(user =>
        user._id !== currentUser?._id && // ✅ Don't show current user in results
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-screen bg-gray-100 flex overflow-hidden relative">
            {/* Debug Info (Remove in production) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="fixed top-4 left-4 z-50 bg-black text-white p-2 rounded text-xs max-w-xs">
                    <div>User ID: {currentUser?._id || 'undefined'}</div>
                    <div>User Name: {currentUser?.fullName || 'undefined'}</div>
                    <div>Socket Connected: {socket.connected ? 'Yes' : 'No'}</div>
                </div>
            )}

            {/* Notification Container */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                <AnimatePresence>
                    {notifications.map((notification) => (
                        <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: 300 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 300 }}
                            className={`px-4 py-2 rounded-lg shadow-lg text-white ${notification.type === 'success' ? 'bg-green-500' :
                                notification.type === 'error' ? 'bg-red-500' :
                                    'bg-blue-500'
                                }`}
                        >
                            {notification.message}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Sidebar */}
            <div className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-30 w-80 bg-white border-r border-gray-200 transition-transform duration-300`}>
                {/* Header */}
                <div className="bg-green-600 text-white p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="relative group cursor-pointer">
                                <img
                                    src={
                                        currentUser?.profileImage
                                            ? `http://localhost:3000${currentUser.profileImage}`
                                            : '/default-avatar.png'
                                    }
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white transition-transform group-hover:scale-105"
                                    onClick={() => document.getElementById('profileUploadInput').click()}
                                />
                                <input
                                    id="profileUploadInput"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleProfileChange}
                                />
                                <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 hidden group-hover:block">
                                    <Camera className="w-4 h-4 text-gray-800" />
                                </div>
                            </div>
                            <h1 className="text-xl font-bold">{currentUser?.fullName || 'Chatify'}</h1>
                        </div>
                        <div className="flex items-center space-x-2">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 hover:bg-green-700 rounded-full"
                                onClick={() => showNotification('New contact feature coming soon!', 'info')}
                            >
                                <UserPlus className="w-5 h-5" />
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

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search or start new chat"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch(searchQuery);
                                }
                            }}
                            className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:bg-white/30"
                        />
                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                    {/* Show available users to chat with if no search results */}
                    {searchQuery && (
                        <div className="border-b border-gray-200 bg-gray-50">
                            <div className="px-4 py-2 text-sm font-medium text-gray-700">
                                Available Users
                            </div>
                            {allUsers
                                .filter(user =>
                                    user._id !== currentUser?._id && // Don't show current user
                                    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                .map((user) => (
                                    <motion.div
                                        key={user._id}
                                        whileHover={{ scale: 1.01 }}
                                        onClick={() => handleStartChat(user)}
                                        className="flex items-center p-3 cursor-pointer hover:bg-gray-100 border-b border-gray-100"
                                    >
                                        <img
                                            src={
                                                user.profileImage
                                                    ? `http://localhost:3000/${user.profileImage.replace(/\\/g, '/')}`
                                                    : '/default-avatar.png'
                                            }
                                            alt={user.fullName}
                                            className="w-10 h-10 rounded-full object-cover mr-3"
                                        />
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900">
                                                {user.fullName}
                                            </h3>
                                            <p className="text-xs text-gray-500">@{user.username}</p>
                                        </div>
                                    </motion.div>
                                ))}
                        </div>
                    )}

                    {/* Existing Chats */}
                    {filteredChats.length > 0 && (
                        <div className="border-b border-gray-200 bg-gray-50">
                            <div className="px-4 py-2 text-sm font-medium text-gray-700">
                                Conversations
                            </div>
                        </div>
                    )}

                    {filteredChats.map((chat) => (
                        <motion.div
                            key={chat._id}
                            whileHover={{ scale: 1.01 }}
                            onClick={() => {
                                setActiveChat(chat);
                                setShowSidebar(false);
                            }}
                            className={`flex items-center p-4 cursor-pointer border-b border-gray-100 transition-all duration-150 hover:bg-gray-100 rounded-md ${activeChat?._id === chat._id
                                ? 'bg-green-50 border-r-4 border-green-500'
                                : ''
                                }`}
                        >
                            <div className="relative mr-3">
                                <img
                                    src={chat.avatar || '/default-avatar.png'}
                                    alt={chat.name}
                                    className="w-12 h-12 rounded-full object-cover"
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
                                    <span className="text-xs text-gray-500">{chat.time || ''}</span>
                                </div>

                                <div className="flex items-center justify-between mt-1">
                                    <p className="text-sm text-gray-600 truncate max-w-[200px]">
                                        {chat.typing ? (
                                            <span className="text-green-600 font-medium animate-pulse">
                                                typing...
                                            </span>
                                        ) : (
                                            chat.lastMessage || 'Start a conversation'
                                        )}
                                    </p>

                                    {chat.unread > 0 && (
                                        <span className="bg-green-500 text-white text-xs font-medium rounded-full px-2 py-0.5 min-w-[20px] text-center ml-2">
                                            {chat.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* No chats message */}
                    {filteredChats.length === 0 && !searchQuery && (
                        <div className="p-8 text-center text-gray-500">
                            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <p className="text-sm">No conversations yet</p>
                            <p className="text-xs mt-2">Search for users above to start chatting</p>
                        </div>
                    )}
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
                                { icon: LogOut, label: 'Log Out', logout: true }
                            ].map((item, index) => (
                                <motion.button
                                    key={index}
                                    whileHover={{ backgroundColor: '#f3f4f6' }}
                                    className="flex items-center space-x-3 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                                    onClick={() => {
                                        setShowChatMenu(false);
                                        if (item.logout) {
                                            handleLogout();
                                        } else {
                                            showNotification(`${item.label} clicked`, 'info');
                                        }
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
                                    onClick={() => showNotification('Search in chat coming soon!', 'info')}
                                >
                                    <Search className="w-5 h-5" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                    onClick={() => showNotification('Chat options coming soon!', 'info')}
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
                            {activeMessages.map((msg, index) => (
                                <motion.div
                                    key={msg._id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.sender === currentUser?._id ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender === currentUser?._id
                                            ? 'bg-green-500 text-white rounded-br-none'
                                            : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                                            }`}
                                    >
                                        {msg.senderName && (
                                            <p className="text-xs font-semibold text-green-600 mb-1">{msg.senderName}</p>
                                        )}
                                        <p className="text-sm">{msg.text}</p>
                                        <div className={`flex items-center justify-end space-x-1 mt-1 ${msg.sender === currentUser?._id ? 'text-white/70' : 'text-gray-500'
                                            }`}>
                                            <span className="text-xs">{msg.time}</span>
                                            {msg.sender === currentUser?._id && (
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
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
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
                                    onClick={() => showNotification('Fullscreen mode', 'info')}
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
                                    onClick={() => showNotification('Add participant feature coming soon!', 'info')}
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
                <button
                    className="w-14 h-14 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center"
                    onClick={() => showNotification('New chat feature coming soon!', 'info')}
                >
                    <MessageCircle className="w-6 h-6" />
                </button>
            </motion.div>
        </div>
    );
};

export default ChatifyWhatsApp;