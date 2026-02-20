import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from '../Whatsapp/Sidebar';
import ChatArea from '../Whatsapp/ChatArea';
import VideoCall from '../Whatsapp/Viedocall';
import Phonecall from '../Whatsapp/Phonecall';
import API_URL, { API_ENDPOINTS } from '../../config/api';

// Initialize socket connection
const socket = io(API_URL, {
    withCredentials: true,
    transports: ["websocket"],
});

// Helper to get avatar URL
const getAvatarUrl = (profileImage) => {
    if (!profileImage) return null;
    return `${API_URL}/${profileImage.replace(/\\/g, '/')}`;
};

const Conversation = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [showSidebar, setShowSidebar] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [notifications, setNotifications] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Call states
    const [showVideoCall, setShowVideoCall] = useState(false);
    const [showAudioCall, setShowAudioCall] = useState(false);
    const [incomingCall, setIncomingCall] = useState(null);

    // Check for mobile on resize
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Initialize user and fetch data
    useEffect(() => {
        const initializeUser = async () => {
            setIsLoading(true);
            setError(null);
            
            const storedUser = localStorage.getItem('user');
            const storedToken = localStorage.getItem('token');

            if (!storedToken) {
                setError('Please login again');
                setIsLoading(false);
                showNotification('Please login again', 'error');
                return;
            }

            let user = null;
            if (storedUser) {
                try {
                    user = JSON.parse(storedUser);
                } catch (e) {
                    console.error('Error parsing user:', e);
                }
            }

            // If no valid user, fetch from server
            if (!user || !user._id) {
                try {
                    const response = await axios.get(API_ENDPOINTS.getMe, {
                        headers: { Authorization: `Bearer ${storedToken}` },
                    });
                    user = response.data;
                    localStorage.setItem('user', JSON.stringify(user));
                } catch (error) {
                    console.error('Failed to get user:', error);
                    setError('Failed to authenticate. Please login again.');
                    setIsLoading(false);
                    showNotification('Failed to authenticate', 'error');
                    return;
                }
            }

            setCurrentUser(user);
            socket.emit('addUser', user._id);

            // Fetch all users
            try {
                const res = await axios.post(
                    API_ENDPOINTS.getUsers,
                    {},
                    { headers: { Authorization: `Bearer ${storedToken}` } }
                );

                const others = res.data.filter(u => u._id !== user._id);
                setAllUsers(res.data);

                // Create chat list from other users
                const chatsData = others
                    .sort((a, b) => a.fullName.localeCompare(b.fullName))
                    .map(u => ({
                        _id: u._id,
                        name: u.fullName,
                        avatar: getAvatarUrl(u.profileImage),
                        lastMessage: '',
                        unread: 0,
                        typing: false,
                        online: false,
                        time: '',
                        messages: [],
                    }));

                setChats(chatsData);
            } catch (error) {
                console.error('Failed to fetch users:', error);
                // Don't block UI, just show empty chat list
            }
            
            setIsLoading(false);
        };

        initializeUser();
    }, []);

    // Socket event listeners
    useEffect(() => {
        socket.on('receiveMessage', ({ chatId, message }) => {
            setChats(prevChats => {
                const chatExists = prevChats.find(c => c._id === chatId);
                if (chatExists) {
                    return prevChats.map(c =>
                        c._id === chatId
                            ? { ...c, messages: [...c.messages, message], lastMessage: message.text, time: 'now' }
                            : c
                    );
                }
                return prevChats;
            });
        });

        socket.on('userOnline', ({ userId }) => {
            setChats(prevChats =>
                prevChats.map(c => (c._id === userId ? { ...c, online: true } : c))
            );
        });

        socket.on('userOffline', ({ userId }) => {
            setChats(prevChats =>
                prevChats.map(c => (c._id === userId ? { ...c, online: false } : c))
            );
        });

        // Handle incoming calls
        socket.on('incomingCall', ({ callId, caller, type }) => {
            setIncomingCall({ callId, caller, type });
            if (type === 'video') {
                setShowVideoCall(true);
            } else {
                setShowAudioCall(true);
            }
        });

        socket.on('callAccepted', ({ callId }) => {
            showNotification('Call accepted!', 'success');
        });

        socket.on('callDeclined', ({ callId }) => {
            showNotification('Call declined', 'error');
            setShowVideoCall(false);
            setShowAudioCall(false);
        });

        return () => {
            socket.off('receiveMessage');
            socket.off('userOnline');
            socket.off('userOffline');
            socket.off('incomingCall');
            socket.off('callAccepted');
            socket.off('callDeclined');
        };
    }, []);

    // Notification helper
    const showNotification = (message, type = 'success') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    };

    // Handle starting a new chat
    const handleStartChat = (user) => {
        if (user._id === currentUser?._id) {
            showNotification("You can't chat with yourself!", 'error');
            return;
        }

        const existingChat = chats.find(c => c._id === user._id);

        if (existingChat) {
            setActiveChat(existingChat);
        } else {
            const newChat = {
                _id: user._id,
                name: user.fullName,
                avatar: getAvatarUrl(user.profileImage),
                lastMessage: '',
                unread: 0,
                typing: false,
                online: false,
                time: '',
                messages: [],
            };
            setChats(prev => [newChat, ...prev]);
            setActiveChat(newChat);
        }

        if (isMobile) setShowSidebar(false);
    };

    // Handle selecting a chat
    const handleSelectChat = (chat) => {
        setActiveChat(chat);
        if (isMobile) setShowSidebar(false);
    };

    // Handle sending a message
    const handleSendMessage = (text) => {
        if (!activeChat || !text.trim()) return;

        const messageObj = {
            text: text.trim(),
            sender: currentUser._id,
            receiver: activeChat._id,
            timestamp: new Date().toISOString(),
        };

        const newMessage = {
            _id: uuidv4(),
            ...messageObj,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent',
            senderName: currentUser.fullName,
        };

        // Update local state immediately
        setChats(prevChats =>
            prevChats.map(c =>
                c._id === activeChat._id
                    ? { ...c, messages: [...c.messages, newMessage], lastMessage: text.trim(), time: 'now' }
                    : c
            )
        );

        // Update active chat
        setActiveChat(prev => ({
            ...prev,
            messages: [...prev.messages, newMessage],
            lastMessage: text.trim(),
            time: 'now',
        }));

        // Send via socket
        socket.emit('sendMessage', {
            chatId: activeChat._id,
            message: messageObj,
        });
    };

    // Handle back button on mobile
    const handleBack = () => {
        setShowSidebar(true);
        setActiveChat(null);
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch(API_ENDPOINTS.logout, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                credentials: 'include',
            });
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Call handlers
    const handleCall = (type) => {
        if (!activeChat) {
            showNotification('Select a chat to start a call', 'error');
            return;
        }
        
        // Emit call event to server
        socket.emit('initiateCall', {
            calleeId: activeChat._id,
            type,
            caller: currentUser,
        });

        if (type === 'video') {
            setShowVideoCall(true);
        } else {
            setShowAudioCall(true);
        }
    };

    const handleAcceptCall = () => {
        if (incomingCall) {
            socket.emit('acceptCall', { callId: incomingCall.callId });
        }
        setIncomingCall(null);
    };

    const handleDeclineCall = () => {
        if (incomingCall) {
            socket.emit('declineCall', { callId: incomingCall.callId });
        }
        setIncomingCall(null);
        setShowVideoCall(false);
        setShowAudioCall(false);
    };

    const handleEndCall = () => {
        setShowVideoCall(false);
        setShowAudioCall(false);
        setIncomingCall(null);
    };

    // Get current chat messages
    const activeMessages = activeChat
        ? chats.find(c => c._id === activeChat._id)?.messages || []
        : [];

    // Loading state
    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center" style={{ background: '#0b141a' }}>
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#25d366] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[#8696a0]">Loading...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="h-screen flex items-center justify-center" style={{ background: '#0b141a' }}>
                <div className="text-center max-w-md px-8">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-[#e9edef] text-xl font-semibold mb-2">Unable to Load</h2>
                    <p className="text-[#8696a0] mb-4">{error}</p>
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="px-6 py-2 bg-[#25d366] text-[#111b21] rounded-full font-semibold hover:bg-[#20bd5a] transition-colors"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-100 flex overflow-hidden relative">
            {/* Sidebar */}
            <AnimatePresence mode="wait">
                {(showSidebar || isMobile) && (
                    <motion.div
                        key="sidebar"
                        initial={isMobile ? { x: '-100%' } : false}
                        animate={{ x: 0 }}
                        exit={isMobile ? { x: '-100%' } : false}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="relative z-30"
                    >
                        <Sidebar
                            currentUser={currentUser}
                            chats={chats}
                            allUsers={allUsers}
                            activeChat={activeChat}
                            onSelectChat={handleSelectChat}
                            onStartChat={handleStartChat}
                            onLogout={handleLogout}
                            isOpen={showSidebar}
                            onClose={() => setShowSidebar(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Area */}
            <motion.div
                key="chat"
                initial={isMobile ? { x: '100%' } : false}
                animate={{ x: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="flex-1 flex flex-col h-full"
            >
                <ChatArea
                    chat={activeChat}
                    messages={activeMessages}
                    currentUser={currentUser}
                    onSendMessage={handleSendMessage}
                    onBack={handleBack}
                    onCall={() => handleCall('audio')}
                    onVideoCall={() => handleCall('video')}
                    onEmojiToggle={() => setShowEmojiPicker(!showEmojiPicker)}
                    showEmojiPicker={showEmojiPicker}
                    onAttachToggle={() => {}}
                />
            </motion.div>

            {/* Video Call Modal */}
            <VideoCall
                isOpen={showVideoCall}
                onClose={handleEndCall}
                callType="video"
                user={activeChat || incomingCall?.caller || { name: 'Unknown' }}
                isIncoming={!!incomingCall && incomingCall.type === 'video'}
                onAccept={handleAcceptCall}
                onDecline={handleDeclineCall}
            />

            {/* Audio Call Modal */}
            <Phonecall
                isOpen={showAudioCall}
                onClose={handleEndCall}
                callType="audio"
                user={activeChat || incomingCall?.caller || { name: 'Unknown' }}
                isIncoming={!!incomingCall && incomingCall.type === 'audio'}
                onAccept={handleAcceptCall}
                onDecline={handleDeclineCall}
            />

            {/* Notifications */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                <AnimatePresence>
                    {notifications.map(n => (
                        <motion.div
                            key={n.id}
                            initial={{ opacity: 0, y: -20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.9 }}
                            className={`px-4 py-3 rounded-lg shadow-xl ${
                                n.type === 'error' ? 'bg-red-500' : 'bg-[#25d366]'
                            } text-white text-sm font-medium`}
                        >
                            {n.message}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Conversation;

