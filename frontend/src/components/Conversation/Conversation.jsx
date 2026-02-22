import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '@/config/axios';
import io from 'socket.io-client';
import Sidebar from '@/Whatsapp/Sidebar';
import ChatArea from '@/Whatsapp/ChatArea';
import VideoCall from '@/Whatsapp/Viedocall';
import Phonecall from '@/Whatsapp/Phonecall';
import API_URL, { API_ENDPOINTS } from '@/config/api';
import { useRealtimeState } from '@/context/RealtimeStateContext';

// Initialize socket connection
const socket = io(API_URL, {
    withCredentials: true,
    transports: ["websocket", "polling"],
});

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

// Helper to get avatar URL
const getAvatarUrl = (profileImage) => {
    if (!profileImage) return null;
    return `${API_URL}/${profileImage.replace(/\\/g, '/')}`;
};

const Conversation = () => {
    const { state: realtimeState, dispatch: realtimeDispatch } = useRealtimeState();
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
    const [userStatuses, setUserStatuses] = useState({});

    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isSpeakerOn, setIsSpeakerOn] = useState(false);
    const [callDurationSec, setCallDurationSec] = useState(0);
    const typingTimeoutsRef = useRef(new Map());
    const chatsRef = useRef([]);
    const receivedMessageIdsRef = useRef(new Set());
    const notifiedMessageIdsRef = useRef(new Set());
    const rtcPeerRef = useRef(null);
    const pendingIceCandidatesRef = useRef([]);

    useEffect(() => {
        chatsRef.current = chats;
    }, [chats]);

    useEffect(() => {
        const totalUnread = Object.values(realtimeState.unreadByChat).reduce((sum, n) => sum + (n || 0), 0);
        document.title = totalUnread > 0 ? `(${totalUnread}) Chatify` : 'Chatify';
    }, [realtimeState.unreadByChat]);

    const triggerBrowserNotification = (title, body = '') => {
        if (typeof window === 'undefined' || !('Notification' in window)) return;
        if (Notification.permission !== 'granted') return;
        try {
            new Notification(title, { body });
        } catch (err) {
            console.error('Browser notification failed:', err);
        }
    };

    const activeCall = realtimeState.call;
    const isCallOpen = activeCall.status !== 'idle' && activeCall.status !== 'ended' && !!activeCall.type;
    const isIncomingCall = activeCall.isIncoming && activeCall.status === 'ringing';
    const callDuration = `${Math.floor(callDurationSec / 60).toString().padStart(2, '0')}:${(callDurationSec % 60).toString().padStart(2, '0')}`;

    useEffect(() => {
        if (activeCall.status !== 'in_call') return;
        const timer = setInterval(() => setCallDurationSec((prev) => prev + 1), 1000);
        return () => clearInterval(timer);
    }, [activeCall.status]);

    useEffect(() => {
        return () => {
            cleanupCallMedia();
        };
    }, []);

    const cleanupCallMedia = () => {
        if (rtcPeerRef.current) {
            rtcPeerRef.current.ontrack = null;
            rtcPeerRef.current.onicecandidate = null;
            rtcPeerRef.current.close();
            rtcPeerRef.current = null;
        }

        if (localStream) {
            localStream.getTracks().forEach((track) => track.stop());
        }
        if (remoteStream) {
            remoteStream.getTracks().forEach((track) => track.stop());
        }

        pendingIceCandidatesRef.current = [];
        setLocalStream(null);
        setRemoteStream(null);
        setIsMuted(false);
        setIsVideoOff(false);
        setIsSpeakerOn(false);
        setCallDurationSec(0);
    };

    const createPeerConnection = (callId) => {
        if (rtcPeerRef.current) return rtcPeerRef.current;
        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
            ],
        });

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('webrtc-ice-candidate', {
                    callId,
                    candidate: event.candidate,
                });
            }
        };

        pc.ontrack = (event) => {
            const stream = event.streams?.[0];
            if (stream) {
                setRemoteStream(stream);
                realtimeDispatch({ type: 'SET_CALL', payload: { status: 'in_call' } });
            }
        };

        rtcPeerRef.current = pc;
        return pc;
    };

    const ensureLocalStream = async (type) => {
        if (localStream) return localStream;
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: type === 'video',
        });
        setLocalStream(stream);
        return stream;
    };

    const attachLocalTracks = (pc, stream) => {
        const existingSenders = pc.getSenders();
        stream.getTracks().forEach((track) => {
            const sender = existingSenders.find((s) => s.track && s.track.kind === track.kind);
            if (!sender) {
                pc.addTrack(track, stream);
            }
        });
    };

    const loadMessagesForChat = async (otherUserId) => {
        try {
            const response = await axios.get(`${API_ENDPOINTS.getMessages}/${otherUserId}`);
            const messages = (response.data?.messages || []).map((m) => ({
                ...m,
                time: new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'delivered',
            }));

            setChats(prevChats =>
                prevChats.map(c =>
                    c._id === otherUserId
                        ? {
                            ...c,
                            messages,
                            lastMessage: messages.length ? messages[messages.length - 1].text : c.lastMessage,
                            time: messages.length ? 'now' : c.time,
                        }
                        : c
                )
            );
        } catch (err) {
            console.error('Failed to load chat messages:', err);
        }
    };

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

            if (!storedUser) {
                setError('Please login again');
                setIsLoading(false);
                showNotification('Please login again', 'error');
                return;
            }

            let user = null;
            try {
                user = JSON.parse(storedUser);
            } catch (e) {
                console.error('Error parsing user:', e);
            }

            // If no valid user, fetch from server
            if (!user || !user._id) {
                try {
                    const response = await axios.get(API_ENDPOINTS.getMe);
                    user = response.data.user || response.data;
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

            // Fetch all users with their statuses
            try {
                const res = await axios.post(
                    API_ENDPOINTS.getUsers,
                    {}
                );

                const others = res.data.filter(u => u._id !== user._id);
                setAllUsers(res.data);

                // Create user statuses map
                const statuses = {};
                others.forEach(u => {
                    statuses[u._id] = {
                        isOnline: u.isOnline || false,
                        lastSeen: u.lastSeen,
                        lastSeenFormatted: u.lastSeenFormatted || formatLastSeen(u.lastSeen)
                    };
                });
                setUserStatuses(statuses);

                // Create chat list from other users
                const chatsData = others
                    .sort((a, b) => {
                        // Sort by online status first, then by name
                        if (a.isOnline && !b.isOnline) return -1;
                        if (!a.isOnline && b.isOnline) return 1;
                        return (a.fullName || a.username || '').localeCompare(b.fullName || b.username || '');
                    })
                    .map(u => ({
                        _id: u._id,
                        name: u.fullName || u.username,
                        avatar: getAvatarUrl(u.profileImage),
                        lastMessage: '',
                        unread: 0,
                        typing: false,
                        online: u.isOnline || false,
                        lastSeen: u.lastSeen,
                        lastSeenFormatted: u.lastSeenFormatted || formatLastSeen(u.lastSeen),
                        time: '',
                        messages: [],
                    }));

                setChats(chatsData);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
            
            setIsLoading(false);
        };

        initializeUser();
    }, []);

    // Socket event listeners
    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().catch(() => {});
        }
    }, []);

    useEffect(() => {
        const activeChatId = activeChat?._id;

        // Handle receiving messages
        socket.on('receiveMessage', ({ chatId, message }) => {
            if (!message?._id) return;
            if (receivedMessageIdsRef.current.has(message._id)) return;
            receivedMessageIdsRef.current.add(message._id);

            const formattedMessage = {
                ...message,
                time: new Date(message.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'delivered',
            };

            setChats(prevChats => {
                const chatExists = prevChats.find(c => c._id === chatId);
                if (chatExists) {
                    return prevChats.map(c =>
                        c._id === chatId
                            ? {
                                ...c,
                                messages: [...c.messages, formattedMessage],
                                lastMessage: formattedMessage.text,
                                time: 'now',
                            }
                            : c
                    );
                }
                return prevChats;
            });

            if (activeChatId !== chatId) {
                realtimeDispatch({ type: 'INCREMENT_UNREAD', payload: chatId });
            }

            if (activeChatId !== chatId) {
                const senderName = chatsRef.current.find((c) => c._id === chatId)?.name || 'New message';
                showNotification(`${senderName}: ${formattedMessage.text || 'sent a message'}`, 'success');
                triggerBrowserNotification(senderName, formattedMessage.text || 'New message');
            }
        });

        socket.on('messageNotification', ({ chatId, messageId, text }) => {
            if (messageId && notifiedMessageIdsRef.current.has(messageId)) return;
            if (messageId) notifiedMessageIdsRef.current.add(messageId);
            if (activeChatId === chatId) return;
            const senderName = chatsRef.current.find((c) => c._id === chatId)?.name || 'New message';
            showNotification(`${senderName}: ${text || 'sent a message'}`, 'success');
            triggerBrowserNotification(senderName, text || 'New message');
        });

        // Handle user online
        socket.on('userOnline', ({ userId }) => {
            setUserStatuses(prev => ({
                ...prev,
                [userId]: {
                    ...prev[userId],
                    isOnline: true
                }
            }));
            setChats(prevChats =>
                prevChats.map(c => 
                    c._id === userId ? { ...c, online: true } : c
                )
            );
        });

        // Handle user offline
        socket.on('userOffline', ({ userId, lastSeen }) => {
            const formattedLastSeen = formatLastSeen(lastSeen);
            setUserStatuses(prev => ({
                ...prev,
                [userId]: {
                    ...prev[userId],
                    isOnline: false,
                    lastSeen: lastSeen,
                    lastSeenFormatted: formattedLastSeen
                }
            }));
            setChats(prevChats =>
                prevChats.map(c => 
                    c._id === userId ? { 
                        ...c, 
                        online: false,
                        lastSeen: lastSeen,
                        lastSeenFormatted: formattedLastSeen
                    } : c
                )
            );
        });

        // Handle incoming calls
        socket.on('incomingCall', ({ callId, caller, type }) => {
            if (activeCall.status !== 'idle' && activeCall.callId && activeCall.callId !== callId) {
                socket.emit('declineCall', { callId });
                return;
            }

            realtimeDispatch({
                type: 'SET_CALL',
                payload: {
                    callId,
                    type,
                    status: 'ringing',
                    isIncoming: true,
                    peer: caller,
                    error: null,
                },
            });
            showNotification(`Incoming ${type} call from ${caller?.name || caller?.fullName || 'Unknown'}`, 'success');
            triggerBrowserNotification('Incoming Call', `${caller?.name || caller?.fullName || 'Unknown'} is calling you`);
            if (navigator?.vibrate) navigator.vibrate([200, 100, 200, 100, 200]);
        });

        socket.on('callNotification', ({ callerName, type }) => {
            showNotification(`Incoming ${type} call from ${callerName}`, 'success');
            triggerBrowserNotification('Incoming Call', `${callerName} started a ${type} call`);
        });

        socket.on('callRinging', ({ callId }) => {
            realtimeDispatch({ type: 'SET_CALL', payload: { callId, status: 'ringing' } });
            showNotification('Ringing...', 'success');
        });

        socket.on('callAccepted', async ({ callId }) => {
            if (activeCall.callId && activeCall.callId !== callId) return;
            realtimeDispatch({ type: 'SET_CALL', payload: { callId, status: 'connecting' } });
            showNotification('Call accepted!', 'success');

            const callType = activeCall.type;
            const isCaller = !activeCall.isIncoming;

            if (isCaller && callType) {
                try {
                    const stream = await ensureLocalStream(callType);
                    const pc = createPeerConnection(callId);
                    attachLocalTracks(pc, stream);
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);
                    socket.emit('webrtc-offer', { callId, offer });
                } catch (err) {
                    console.error('Failed to create offer:', err);
                    showNotification('Call setup failed', 'error');
                    socket.emit('endCall', { callId });
                    cleanupCallMedia();
                    realtimeDispatch({ type: 'CLEAR_CALL' });
                }
            }
        });

        socket.on('callDeclined', ({ callId }) => {
            if (activeCall.callId && activeCall.callId !== callId) return;
            showNotification('Call declined', 'error');
            cleanupCallMedia();
            realtimeDispatch({ type: 'CLEAR_CALL' });
        });

        socket.on('callEnded', ({ callId }) => {
            if (activeCall.callId && callId && activeCall.callId !== callId) return;
            showNotification('Call ended', 'error');
            cleanupCallMedia();
            realtimeDispatch({ type: 'CLEAR_CALL' });
        });

        socket.on('callUnavailable', ({ message }) => {
            showNotification(message || 'Call unavailable', 'error');
            cleanupCallMedia();
            realtimeDispatch({ type: 'CLEAR_CALL' });
        });

        socket.on('webrtc-offer', async ({ callId, offer }) => {
            if (activeCall.callId !== callId) return;
            try {
                const stream = await ensureLocalStream(activeCall.type || 'audio');
                const pc = createPeerConnection(callId);
                attachLocalTracks(pc, stream);
                await pc.setRemoteDescription(new RTCSessionDescription(offer));

                while (pendingIceCandidatesRef.current.length) {
                    const candidate = pendingIceCandidatesRef.current.shift();
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                }

                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit('webrtc-answer', { callId, answer });
                realtimeDispatch({ type: 'SET_CALL', payload: { status: 'in_call', startedAt: Date.now() } });
            } catch (err) {
                console.error('Failed to process offer:', err);
            }
        });

        socket.on('webrtc-answer', async ({ callId, answer }) => {
            if (activeCall.callId !== callId || !rtcPeerRef.current) return;
            try {
                await rtcPeerRef.current.setRemoteDescription(new RTCSessionDescription(answer));

                while (pendingIceCandidatesRef.current.length) {
                    const candidate = pendingIceCandidatesRef.current.shift();
                    await rtcPeerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                }

                realtimeDispatch({ type: 'SET_CALL', payload: { status: 'in_call', startedAt: Date.now() } });
            } catch (err) {
                console.error('Failed to process answer:', err);
            }
        });

        socket.on('webrtc-ice-candidate', async ({ callId, candidate }) => {
            if (activeCall.callId !== callId || !candidate) return;
            try {
                if (!rtcPeerRef.current || !rtcPeerRef.current.remoteDescription) {
                    pendingIceCandidatesRef.current.push(candidate);
                    return;
                }
                await rtcPeerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
                console.error('Failed to add ICE candidate:', err);
            }
        });

        // Handle typing events
        socket.on('userTyping', ({ userId, userName, chatId }) => {
            const existing = typingTimeoutsRef.current.get(chatId);
            if (existing) clearTimeout(existing);

            setChats(prevChats =>
                prevChats.map(c => 
                    c._id === chatId ? { ...c, typing: true, typingName: userName } : c
                )
            );
            setActiveChat(prev => (
                prev && prev._id === chatId
                    ? { ...prev, typing: true, typingName: userName }
                    : prev
            ));

            const timeoutId = setTimeout(() => {
                setChats(prevChats =>
                    prevChats.map(c =>
                        c._id === chatId ? { ...c, typing: false, typingName: null } : c
                    )
                );
                setActiveChat(prev => (
                    prev && prev._id === chatId
                        ? { ...prev, typing: false, typingName: null }
                        : prev
                ));
                typingTimeoutsRef.current.delete(chatId);
            }, 2500);

            typingTimeoutsRef.current.set(chatId, timeoutId);
        });

        socket.on('userStopTyping', ({ userId, chatId }) => {
            const existing = typingTimeoutsRef.current.get(chatId);
            if (existing) {
                clearTimeout(existing);
                typingTimeoutsRef.current.delete(chatId);
            }

            setChats(prevChats =>
                prevChats.map(c => 
                    c._id === chatId ? { ...c, typing: false, typingName: null } : c
                )
            );
            setActiveChat(prev => (
                prev && prev._id === chatId
                    ? { ...prev, typing: false, typingName: null }
                    : prev
            ));
        });

        return () => {
            socket.off('receiveMessage');
            socket.off('messageNotification');
            socket.off('userOnline');
            socket.off('userOffline');
            socket.off('incomingCall');
            socket.off('callNotification');
            socket.off('callRinging');
            socket.off('callAccepted');
            socket.off('callDeclined');
            socket.off('callEnded');
            socket.off('callUnavailable');
            socket.off('webrtc-offer');
            socket.off('webrtc-answer');
            socket.off('webrtc-ice-candidate');
            socket.off('userTyping');
            socket.off('userStopTyping');

            for (const timeoutId of typingTimeoutsRef.current.values()) {
                clearTimeout(timeoutId);
            }
            typingTimeoutsRef.current.clear();
        };
    }, [activeChat?._id, activeCall.callId, activeCall.isIncoming, activeCall.status, activeCall.type, realtimeDispatch]);

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
        const userStatus = userStatuses[user._id] || { 
            isOnline: false, 
            lastSeenFormatted: formatLastSeen(user.lastSeen) 
        };

        if (existingChat) {
            realtimeDispatch({ type: 'RESET_UNREAD', payload: user._id });
            realtimeDispatch({ type: 'SET_ACTIVE_CHAT', payload: user._id });
            setActiveChat(existingChat);
        } else {
            const newChat = {
                _id: user._id,
                name: user.fullName || user.username,
                avatar: getAvatarUrl(user.profileImage),
                lastMessage: '',
                unread: 0,
                typing: false,
                online: userStatus.isOnline,
                lastSeen: userStatus.lastSeen,
                lastSeenFormatted: userStatus.lastSeenFormatted,
                time: '',
                messages: [],
            };
            setChats(prev => [newChat, ...prev]);
            setActiveChat(newChat);
            realtimeDispatch({ type: 'SET_ACTIVE_CHAT', payload: user._id });
        }

        loadMessagesForChat(user._id);

        if (isMobile) setShowSidebar(false);
    };

    // Handle selecting a chat
    const handleSelectChat = (chat) => {
        realtimeDispatch({ type: 'RESET_UNREAD', payload: chat._id });
        realtimeDispatch({ type: 'SET_ACTIVE_CHAT', payload: chat._id });
        setActiveChat(chat);
        loadMessagesForChat(chat._id);
        if (isMobile) setShowSidebar(false);
    };

    // Handle sending a message
    const handleSendMessage = async (text) => {
        if (!activeChat || !text.trim()) return;
        try {
            const response = await axios.post(API_ENDPOINTS.sendMessage, {
                receiver: activeChat._id,
                text: text.trim(),
            });

            const savedMessage = response.data?.message;
            if (!savedMessage) return;
            const formattedSavedMessage = {
                ...savedMessage,
                time: new Date(savedMessage.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'sent',
            };

            setChats(prevChats =>
                prevChats.map(c =>
                    c._id === activeChat._id
                        ? { ...c, messages: [...c.messages, formattedSavedMessage], lastMessage: formattedSavedMessage.text, time: 'now' }
                        : c
                )
            );

            setActiveChat(prev => ({
                ...prev,
                messages: [...(prev?.messages || []), formattedSavedMessage],
                lastMessage: formattedSavedMessage.text,
                time: 'now',
            }));

            socket.emit('sendMessage', {
                chatId: activeChat._id,
                message: formattedSavedMessage,
            });
        } catch (err) {
            console.error('Failed to send message:', err);
            showNotification('Failed to send message', 'error');
        }
    };

    // Handle typing
    const handleTyping = (isTyping) => {
        if (!activeChat) return;
        
        if (isTyping) {
            socket.emit('typing', {
                chatId: activeChat._id,
                userId: currentUser._id,
                userName: currentUser.fullName || currentUser.username || 'User'
            });
        } else {
            socket.emit('stopTyping', {
                chatId: activeChat._id,
                userId: currentUser._id
            });
        }
    };

    // Handle back button on mobile
    const handleBack = () => {
        setShowSidebar(true);
        setActiveChat(null);
        realtimeDispatch({ type: 'SET_ACTIVE_CHAT', payload: null });
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            await axios.post(API_ENDPOINTS.logout);
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
        if (activeCall.status !== 'idle' && activeCall.status !== 'ended') {
            showNotification('You are already in a call', 'error');
            return;
        }

        realtimeDispatch({
            type: 'SET_CALL',
            payload: {
                callId: null,
                type,
                status: 'connecting',
                isIncoming: false,
                peer: activeChat,
                error: null,
            },
        });
        
        socket.emit('initiateCall', {
            calleeId: activeChat._id,
            type,
            caller: currentUser,
        });
    };

    const handleAcceptCall = async () => {
        if (!activeCall.callId) return;
        try {
            await ensureLocalStream(activeCall.type || 'audio');
            realtimeDispatch({ type: 'SET_CALL', payload: { status: 'connecting', isIncoming: false } });
            socket.emit('acceptCall', { callId: activeCall.callId });
        } catch (err) {
            console.error('Accept call media error:', err);
            showNotification('Microphone/Camera permission denied', 'error');
            socket.emit('declineCall', { callId: activeCall.callId });
            cleanupCallMedia();
            realtimeDispatch({ type: 'CLEAR_CALL' });
        }
    };

    const handleDeclineCall = () => {
        if (activeCall.callId) {
            socket.emit('declineCall', { callId: activeCall.callId });
        }
        cleanupCallMedia();
        realtimeDispatch({ type: 'CLEAR_CALL' });
    };

    const handleEndCall = () => {
        if (activeCall.callId) {
            socket.emit('endCall', { callId: activeCall.callId });
        }
        cleanupCallMedia();
        realtimeDispatch({ type: 'CLEAR_CALL' });
    };

    const handleToggleMute = () => {
        if (!localStream) return;
        const nextMuted = !isMuted;
        localStream.getAudioTracks().forEach((t) => {
            t.enabled = !nextMuted;
        });
        setIsMuted(nextMuted);
    };

    const handleToggleVideo = () => {
        if (!localStream) return;
        const nextVideoOff = !isVideoOff;
        localStream.getVideoTracks().forEach((t) => {
            t.enabled = !nextVideoOff;
        });
        setIsVideoOff(nextVideoOff);
    };

    const handleToggleSpeaker = () => {
        setIsSpeakerOn((prev) => !prev);
    };

    // Get current chat messages
    const chatsWithUnread = chats.map((c) => ({
        ...c,
        unread: realtimeState.unreadByChat[c._id] || 0,
    }));

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
                            chats={chatsWithUnread}
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
                    onTyping={handleTyping}
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
                isOpen={isCallOpen && activeCall.type === 'video'}
                onClose={handleEndCall}
                callType="video"
                user={activeCall.peer || activeChat || { name: 'Unknown' }}
                isIncoming={isIncomingCall && activeCall.type === 'video'}
                callStatus={activeCall.status}
                callDuration={callDuration}
                localStream={localStream}
                remoteStream={remoteStream}
                isMuted={isMuted}
                isVideoOff={isVideoOff}
                onAccept={handleAcceptCall}
                onDecline={handleDeclineCall}
                onEnd={handleEndCall}
                onToggleMute={handleToggleMute}
                onToggleVideo={handleToggleVideo}
            />

            {/* Audio Call Modal */}
            <Phonecall
                isOpen={isCallOpen && activeCall.type === 'audio'}
                onClose={handleEndCall}
                callType="audio"
                user={activeCall.peer || activeChat || { name: 'Unknown' }}
                isIncoming={isIncomingCall && activeCall.type === 'audio'}
                callStatus={activeCall.status}
                callDuration={callDuration}
                isMuted={isMuted}
                isSpeakerOn={isSpeakerOn}
                onAccept={handleAcceptCall}
                onDecline={handleDeclineCall}
                onEnd={handleEndCall}
                onToggleMute={handleToggleMute}
                onToggleSpeaker={handleToggleSpeaker}
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
